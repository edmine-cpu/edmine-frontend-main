/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// Базовые настройки
	compress: true,
	poweredByHeader: false,
	productionBrowserSourceMaps: false,
	output: 'standalone',

	// Заголовки (объединено)
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{ key: 'X-DNS-Prefetch-Control', value: 'on' },
					{ key: 'X-Frame-Options', value: 'DENY' },
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=()',
					},
				],
			},
			{
				source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
				locale: false,
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
		]
	},

	// Редиректы (убрано: дефолтная версия без языка - английская)
	async redirects() {
		return []
	},

	// Прокси для API
	async rewrites() {
		const apiBaseUrl =
			process.env.NODE_ENV === 'production'
				? process.env.API_BASE_URL || 'http://backend:8000'
				: 'http://localhost:8000'

		return [
			{
				source: '/api/:path*',
				destination: `${apiBaseUrl}/api/:path*`,
			},
			{
				source: '/check/:path*',
				destination: `${apiBaseUrl}/check/:path*`,
			},
			{
				source: '/login',
				destination: `${apiBaseUrl}/login`,
			},
			{
				source: '/logout',
				destination: `${apiBaseUrl}/logout`,
			},
			{
				source: '/me',
				destination: `${apiBaseUrl}/me`,
			},
		]
	},
}

export default nextConfig
