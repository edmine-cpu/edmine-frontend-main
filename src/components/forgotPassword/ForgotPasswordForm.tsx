'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header/Header';
import Link from 'next/link';
import { API_ENDPOINTS } from '@/config/api';
import { VerificationCodeInput } from '@/components/common/VerificationCodeInput';
import { getLangPath } from '@/utils/linkHelper';
import { useTranslation, type Lang } from '@/translations';

type Step = 'email' | 'code' | 'password' | 'success';

interface Props {
    lang: Lang;
}

export default function ForgotPasswordForm({ lang }: Props) {
    const t = useTranslation(lang);
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('email', email);

            const response = await fetch(API_ENDPOINTS.forgotPassword, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                console.log('🔐 Verification code (for testing):', data.code);
                setStep('code');
            } else {
                setError(data.detail || t('errorSendingCode'));
            }
        } catch (err) {
            setError(t('networkError'));
        } finally {
            setLoading(false);
        }
    };

    const handleCodeVerification = async (verificationCode: string) => {
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('code', verificationCode);

            const response = await fetch(API_ENDPOINTS.verifyResetCode, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setToken(data.token);
                setStep('password');

                if (typeof window !== 'undefined') {
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50';
                    notification.textContent = t('codeVerified');
                    document.body.appendChild(notification);
                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                }

                return { success: true, message: t('codeVerifiedSuccess') };
            } else {
                return { success: false, message: data.detail || t('invalidCode') };
            }
        } catch (err) {
            return { success: false, message: t('networkError') };
        }
    };

    const handleCodeResend = async () => {
        try {
            const formData = new FormData();
            formData.append('email', email);

            const response = await fetch(API_ENDPOINTS.forgotPassword, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, message: t('codeResent') };
            } else {
                return { success: false, message: data.detail || t('errorSendingCode') };
            }
        } catch (err) {
            return { success: false, message: t('networkError') };
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password.length < 8) {
            setError(t('passwordMinLength'));
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError(t('passwordsDoNotMatch'));
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('token', token);
            formData.append('new_password', password);
            formData.append('email', email);

            const response = await fetch(API_ENDPOINTS.resetPassword, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setStep('success');
            } else {
                setError(data.detail || t('errorResettingPassword'));
            }
        } catch (err) {
            setError(t('networkError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header lang={lang} />
            <div className="min-h-screen bg-white">
                <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 h-screen">
                    <div className="max-w-md w-full space-y-8">
                        <div className="flex justify-center mb-8">
                            <div className="flex items-center space-x-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    step === 'email' ? 'bg-red-600 text-white' :
                                    step === 'code' || step === 'password' || step === 'success' ? 'bg-green-600 text-white' :
                                    'bg-gray-300 text-gray-600'
                                }`}>1</div>
                                <div className="w-12 h-1 bg-gray-300">
                                    <div className={`h-1 bg-red-600 transition-all duration-300 ${
                                        step === 'code' || step === 'password' || step === 'success' ? 'w-full' : 'w-0'
                                    }`}></div>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    step === 'code' ? 'bg-red-600 text-white' :
                                    step === 'password' || step === 'success' ? 'bg-green-600 text-white' :
                                    'bg-gray-300 text-gray-600'
                                }`}>2</div>
                                <div className="w-12 h-1 bg-gray-300">
                                    <div className={`h-1 bg-red-600 transition-all duration-300 ${
                                        step === 'password' || step === 'success' ? 'w-full' : 'w-0'
                                    }`}></div>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    step === 'password' ? 'bg-red-600 text-white' :
                                    step === 'success' ? 'bg-green-600 text-white' :
                                    'bg-gray-300 text-gray-600'
                                }`}>3</div>
                            </div>
                        </div>

                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900 font-primary">
                                {step === 'email' && t('passwordRecovery')}
                                {step === 'code' && t('enterCode')}
                                {step === 'password' && t('newPassword')}
                                {step === 'success' && t('done')}
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 font-secondary">
                                {step === 'email' && t('enterEmailToReceiveCode')}
                                {step === 'code' && t('codeSentToEmail')}
                                {step === 'password' && t('createNewPassword')}
                                {step === 'success' && t('passwordChangedSuccess')}
                            </p>
                        </div>

                        {step === 'email' && (
                            <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-primary">
                                        {t('emailAddress')}
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 font-primary"
                                        placeholder={t('enterYourEmail')}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl font-primary">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 font-primary shadow-lg transition-colors duration-300"
                                >
                                    {loading ? t('sendingCode') : t('sendCode')}
                                </button>
                            </form>
                        )}

                        {step === 'code' && (
                            <div className="space-y-6">
                                <VerificationCodeInput
                                    lang={lang}
                                    email={email}
                                    onVerify={handleCodeVerification}
                                    onResend={handleCodeResend}
                                    title={t('codeVerification')}
                                    instruction={t('enterVerificationCode').replace('{email}', email)}
                                    showEmail={false}
                                    autoFocus={true}
                                    className="shadow-none border border-gray-200"
                                />

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setStep('email')}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        {t('backToEmailEntry')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'password' && (
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('newPassword')}
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder={t('enterNewPassword')}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('confirmPassword')}
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder={t('repeatNewPassword')}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || password.length < 8 || password !== confirmPassword}
                                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    {loading ? t('changingPassword') : t('changePassword')}
                                </button>

                                {password && (
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div className={password.length >= 8 ? 'text-green-600' : 'text-red-600'}>
                                            {password.length >= 8 ? '✓' : '✗'} {t('minimum8Characters')}
                                        </div>
                                        {confirmPassword && (
                                            <div className={password === confirmPassword ? 'text-green-600' : 'text-red-600'}>
                                                {password === confirmPassword ? '✓' : '✗'} {t('passwordsMatch')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </form>
                        )}

                        {step === 'success' && (
                            <div className="text-center space-y-6">
                                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                                    ✅
                                </div>
                                <h3 className="text-xl font-semibold text-green-700">
                                    {t('passwordChangedSuccess')}
                                </h3>
                                <Link
                                    href={getLangPath('/login', lang)}
                                    className="inline-block bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    {t('login')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
