'use client';

import React from 'react';
import LoginForm from '@/components/login/LoginForm';

export default function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = React.use(params);
    return <LoginForm lang={resolvedParams.lang as any} />;
}