'use client'

import { memo, useEffect, useMemo, useState } from 'react'

interface OptimizedImageProps {
	src: string
	alt: string
	width?: number
	height?: number
	className?: string
	priority?: boolean
	placeholder?: string
	sizes?: string
}

const OptimizedImage = memo(function OptimizedImage({
	src,
	alt,
	width,
	height,
	className = '',
	priority = false,
	placeholder,
	sizes,
}: OptimizedImageProps) {
	const [loaded, setLoaded] = useState(false)
	const [error, setError] = useState(false)

	// Мемоизируем srcSet для разных размеров
	const srcSet = useMemo(() => {
		if (!width || !height) return undefined

		const baseUrl = src.split('?')[0]
		const params = new URLSearchParams(src.split('?')[1] || '')

		// Создаем разные размеры для респонсивности
		const sizes = [1, 1.5, 2, 3]
		return sizes
			.map(scale => {
				const scaledWidth = Math.round(width * scale)
				const scaledHeight = Math.round(height * scale)
				params.set('w', scaledWidth.toString())
				params.set('h', scaledHeight.toString())
				return `${baseUrl}?${params.toString()} ${scale}x`
			})
			.join(', ')
	}, [src, width, height])

	// Предзагрузка критических изображений
	useEffect(() => {
		if (priority && typeof window !== 'undefined') {
			const link = document.createElement('link')
			link.rel = 'preload'
			link.as = 'image'
			link.href = src
			if (srcSet) link.setAttribute('imagesrcset', srcSet)
			document.head.appendChild(link)

			return () => {
				if (document.head.contains(link)) {
					document.head.removeChild(link)
				}
			}
		}
	}, [src, srcSet, priority])

	const handleLoad = () => {
		setLoaded(true)
	}

	const handleError = () => {
		setError(true)
	}

	if (error) {
		return (
			<div
				className={`bg-gray-200 flex items-center justify-center ${className}`}
				style={{ width, height }}
			>
				<span className='text-gray-400 text-sm'>
					Изображение не загрузилось
				</span>
			</div>
		)
	}

	return (
		<div className='relative'>
			{placeholder && !loaded && (
				<div
					className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
					style={{ width, height }}
				/>
			)}
			<img
				src={src}
				srcSet={srcSet}
				sizes={sizes}
				alt={alt}
				width={width}
				height={height}
				className={`${className} ${
					loaded ? 'loaded' : ''
				} transition-opacity duration-300`}
				loading={priority ? 'eager' : 'lazy'}
				onLoad={handleLoad}
				onError={handleError}
				style={{
					opacity: loaded ? 1 : 0,
				}}
			/>
		</div>
	)
})

export default OptimizedImage
