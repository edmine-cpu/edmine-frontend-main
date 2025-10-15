'use client';

import React, { useState, useEffect } from 'react';
import { Header } from "@/components/Header/Header";
import Link from "next/link";
import { API_ENDPOINTS } from '@/config/api';
import { VerificationCodeInput, Lang } from '@/components/common/VerificationCodeInput';

export default function VerifyCodePage() {
    const lang: Lang = 'en';

    const [email, setEmail] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        function getCookie(name: string) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift()!);
            return null;
        }
        setEmail(getCookie('email'));
    }, []);

    useEffect(() => {
        if (success) {
            const timeout = setTimeout(() => {
                setRedirecting(true);
                window.location.href = '/';
                document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [success]);

    if (email === null) {
        return <p>Loading...</p>;
    }

    if (!email) {
        return <p className="text-red-600">Error: email not found. Please register first.</p>;
    }

    const handleVerification = async (verificationCode: string) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.verifyCode}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, code: verificationCode }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Verification successful:', result);

                if (result.token) {
                    const { setAuthCache } = await import('@/utils/auth');
                    setAuthCache(true);

                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new Event('auth-changed'));
                    }
                }

                setSuccess(true);

                if (typeof window !== 'undefined') {
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50';
                    notification.textContent = result.message || 'Verification successful!';
                    document.body.appendChild(notification);
                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                }

                return { success: true, message: result.message || 'Verification successful!' };
            } else {
                const result = await response.json();
                return { success: false, message: result.error || 'Invalid verification code' };
            }
        } catch (err) {
            console.error('Verification error:', err);
            return { success: false, message: 'Connection error with server' };
        }
    };

    const handleResend = async () => {
        try {
            const response = await fetch(`${API_ENDPOINTS.verifyCode}?resend=true`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const result = await response.json();
                return { success: true, message: result.message || 'Code resent' };
            } else {
                const result = await response.json();
                return { success: false, message: result.error || 'Error sending code' };
            }
        } catch (err) {
            console.error('Resend error:', err);
            return { success: false, message: 'Error sending code' };
        }
    };

    return (
        <div className="min-h-screen">
            <Header lang={lang} />

            <div className="flex items-center justify-center min-h-screen px-4 py-12">

                <div className="max-w-md w-full">
                    <VerificationCodeInput
                        lang={lang}
                        email={email || ''}
                        onVerify={handleVerification}
                        onResend={handleResend}
                        title="Email Verification"
                        instruction={`Enter the code sent to email: ${email}`}
                        showEmail={false}
                        autoFocus={true}
                    />

                    {success && (
                        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
                            {redirecting ? 'Congratulations! User successfully verified. Redirecting...' : 'Verification successful!'}
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link href="/register" className="text-red-600 hover:text-red-700 text-sm">
                            ← Back to registration
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
