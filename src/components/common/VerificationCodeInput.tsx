'use client';

import './ver-code.css'

import React, { useState, useEffect } from 'react';

export type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de';

const translations: Record<Lang, Record<string, string>> = {
  uk: {
    title: 'Підтвердження Email',
    instruction: 'Введіть код підтвердження, який був відправлений на ваш email:',
    code: 'Код підтвердження',
    verify: 'Підтвердити',
    resend: 'Надіслати повторно',
    success: 'Успішно підтверджено!',
    error: 'Неправильний код підтвердження',
    loading: 'Підтвердження...',
    resending: 'Надсилання...',
    email: 'Email',
    resendSuccess: 'Код надіслано повторно',
    resendError: 'Помилка при надсиланні коду',
    waitBeforeResend: 'Зачекайте {seconds} сек. перед повторним надсиланням'
  },
  en: {
    title: 'Email Verification',
    instruction: 'Enter the verification code sent to your email:',
    code: 'Verification Code',
    verify: 'Verify',
    resend: 'Resend',
    success: 'Successfully verified!',
    error: 'Invalid verification code',
    loading: 'Verifying...',
    resending: 'Sending...',
    email: 'Email',
    resendSuccess: 'Code sent again',
    resendError: 'Error sending code',
    waitBeforeResend: 'Wait {seconds} sec. before resending'
  },
  pl: {
    title: 'Weryfikacja Email',
    instruction: 'Wprowadź kod weryfikacyjny wysłany na Twój email:',
    code: 'Kod weryfikacyjny',
    verify: 'Weryfikuj',
    resend: 'Wyślij ponownie',
    success: 'Pomyślnie zweryfikowano!',
    error: 'Nieprawidłowy kod weryfikacyjny',
    loading: 'Weryfikacja...',
    resending: 'Wysyłanie...',
    email: 'Email',
    resendSuccess: 'Kod wysłany ponownie',
    resendError: 'Błąd wysyłania kodu',
    waitBeforeResend: 'Poczekaj {seconds} sek. przed ponownym wysłaniem'
  },
  fr: {
    title: 'Vérification Email',
    instruction: 'Entrez le code de vérification envoyé à votre email:',
    code: 'Code de vérification',
    verify: 'Vérifier',
    resend: 'Renvoyer',
    success: 'Vérifié avec succès!',
    error: 'Code de vérification invalide',
    loading: 'Vérification...',
    resending: 'Envoi...',
    email: 'Email',
    resendSuccess: 'Code renvoyé',
    resendError: 'Erreur lors de l\'envoi du code',
    waitBeforeResend: 'Attendez {seconds} sec. avant de renvoyer'
  },
  de: {
    title: 'Email-Verifizierung',
    instruction: 'Geben Sie den Verifizierungscode ein, der an Ihre E-Mail gesendet wurde:',
    code: 'Verifizierungscode',
    verify: 'Verifizieren',
    resend: 'Erneut senden',
    success: 'Erfolgreich verifiziert!',
    error: 'Ungültiger Verifizierungscode',
    loading: 'Verifizierung...',
    resending: 'Senden...',
    email: 'Email',
    resendSuccess: 'Code erneut gesendet',
    resendError: 'Fehler beim Senden des Codes',
    waitBeforeResend: 'Warten Sie {seconds} Sek. vor erneutem Senden'
  }
};

export interface VerificationCodeInputProps {
  lang: Lang;
  email: string;
  onVerify: (code: string) => Promise<{ success: boolean; message?: string }>;
  onResend?: () => Promise<{ success: boolean; message?: string }>;
  title?: string;
  instruction?: string;
  showEmail?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function VerificationCodeInput({
  lang,
  email,
  onVerify,
  onResend,
  title,
  instruction,
  showEmail = true,
  autoFocus = true,
  className = ""
}: VerificationCodeInputProps) {
  const t = translations[lang] || translations.uk;
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setMessage(t.error);
      setMessageType('error');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const result = await onVerify(code.trim());
      
      if (result.success) {
        setMessage(result.message || t.success);
        setMessageType('success');
      } else {
        setMessage(result.message || t.error);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setMessage(t.error);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!onResend || resendCooldown > 0) return;
    
    setResending(true);
    setMessage('');
    
    try {
      const result = await onResend();
      
      if (result.success) {
        setMessage(result.message || t.resendSuccess);
        setMessageType('success');
        setResendCooldown(60); // 60 seconds cooldown
      } else {
        setMessage(result.message || t.resendError);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage(t.resendError);
      setMessageType('error');
    } finally {
      setResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    
    // Clear message when user starts typing
    if (message && messageType === 'error') {
      setMessage('');
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-8 ${className}`}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {title || t.title}
      </h1>
      
      <p className="text-gray-600 mb-6 text-center">
        {instruction || t.instruction}
      </p>
      
      <form onSubmit={handleVerification} className="space-y-4">
        {showEmail && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.email}
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.code}
          </label>
          <input
            type="text"
            value={code}
            onChange={handleCodeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-lg font-mono"
            placeholder="000000"
            maxLength={6}
            autoFocus={autoFocus}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="ver-button"
        >
          {loading ? t.loading : t.verify}
        </button>
        
        {onResend && (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || resendCooldown > 0}
            className="ver-button-inverse"
          >
            {resending 
              ? t.resending 
              : resendCooldown > 0 
                ? t.waitBeforeResend.replace('{seconds}', resendCooldown.toString())
                : t.resend
            }
          </button>
        )}
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-center ${
          messageType === 'success' 
            ? 'bg-green-100 text-green-800' 
            : messageType === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
