'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductImageProps {
    src: string
    alt: string
    width: number
    height: number
    className?: string
    priority?: boolean
}

export default function ProductImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false
}: ProductImageProps) {
    const [imageError, setImageError] = useState(false)

    if (!src || imageError) {
        return (
            <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}>
                <div className="text-center p-4">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Sin imagen</p>
                </div>
            </div>
        )
    }

    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            onError={() => setImageError(true)}
            priority={priority}
            unoptimized={src.includes('example.com') || src.includes('supabase.co')}
        />
    )
}
