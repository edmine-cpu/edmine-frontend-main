/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// Базовые настройки
	compress: true,
	poweredByHeader: false,
	productionBrowserSourceMaps: false,
	output: 'standalone',

	// Конфигурация для внешних изображений
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: '82.25.86.30',
				port: '8888',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'makeasap.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'content.freelancehunt.com',
				pathname: '/**',
			},
		],
		unoptimized: true,
	},

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
			// JavaScript chunks - короткий кеш с валидацией
			{
				source: '/_next/static/chunks/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
					{
						key: 'Content-Type',
						value: 'application/javascript; charset=utf-8',
					},
				],
			},
			// CSS файлы
			{
				source: '/_next/static/css/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
					{
						key: 'Content-Type',
						value: 'text/css; charset=utf-8',
					},
				],
			},
			// Изображения
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
