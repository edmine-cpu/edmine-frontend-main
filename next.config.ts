import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// Оптимизации производительности
	experimental: {
		optimizeCss: true,
		optimizePackageImports: ['react-icons', '@headlessui/react'],
	},

	// Сжатие изображений
	images: {
		formats: ['image/webp', 'image/avif'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60,
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},

	// Кодгенерация и компиляция
	swcMinify: true,

	// Компрессия
	compress: true,

	// Генерация source maps только для production
	productionBrowserSourceMaps: false,

	// Оптимизация бандла
	webpack: (config, { dev, isServer }) => {
		// Оптимизация для клиентской стороны в production
		if (!dev && !isServer) {
			config.optimization = {
				...config.optimization,
				splitChunks: {
					chunks: 'all',
					cacheGroups: {
						default: false,
						vendors: false,
						// Выделяем vendor библиотеки в отдельный чанк
						vendor: {
							name: 'vendors',
							chunks: 'all',
							test: /node_modules/,
							priority: 20,
						},
						// Выделяем общий код в отдельный чанк
						common: {
							name: 'commons',
							minChunks: 2,
							chunks: 'all',
							priority: 10,
							reuseExistingChunk: true,
							enforce: true,
						},
					},
				},
			}
		}

		return config
	},

	// Headers для оптимизации кеширования
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'X-DNS-Prefetch-Control',
						value: 'on',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'Referrer-Policy',
						value: 'origin-when-cross-origin',
					},
				],
			},
			// Кеширование статических ресурсов
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
}

export default nextConfig
