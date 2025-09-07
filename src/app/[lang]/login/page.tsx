'use client'

import { Lang } from '@/app/(types)/lang'
import LoginForm from '@/components/login/LoginForm'
import React from 'react'

export default function LoginPage({
	params,
}: {
	params: Promise<{ lang: string }>
}) {
	const resolvedParams = React.use(params)
	return <LoginForm lang={resolvedParams.lang as Lang} />
}
