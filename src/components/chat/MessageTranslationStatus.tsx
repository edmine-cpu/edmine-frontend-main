'use client'

interface MessageTranslationStatusProps {
	isTranslated: boolean
	detectedLanguage?: string
	targetLanguage?: string
	isOwnMessage?: boolean
}

export default function MessageTranslationStatus({
	isTranslated,
	detectedLanguage,
	targetLanguage,
	isOwnMessage = false,
}: MessageTranslationStatusProps) {
	if (!isTranslated) return null

	return (
		<div className='text-xs opacity-70 mt-1 flex items-center space-x-1'>
			<span className='text-green-600'>🌍</span>
			<span className='text-green-600'>
				Переведено
				{detectedLanguage && targetLanguage && (
					<span className='ml-1 opacity-60'>
						({detectedLanguage} → {targetLanguage})
					</span>
				)}
			</span>
		</div>
	)
}
