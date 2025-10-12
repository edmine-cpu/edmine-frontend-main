'use client'

import type { User } from '@/lib/getCurrentUser'
import React, { createContext, useContext } from 'react'

interface AuthContextType {
	user: User | null
	isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({
	children,
	user,
}: {
	children: React.ReactNode
	user: User | null
}) => {
	return (
		<AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
