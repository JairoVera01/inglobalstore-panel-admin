'use client'

import { useState } from 'react'
import Image from 'next/image'
import ImageUploader from './ImageUploader'

interface MultiImageUploaderProps {
    productId?: string
    onImagesChange: (images: { url: string; isPrimary: boolean; order: number }[]) => void
    initialImages?: { url: string; isPrimary: boolean; order: number }[]
}

export default function MultiImageUploader({
    onImagesChange,
    initialImages = []
}: MultiImageUploaderProps) {
    const [images, setImages] = useState<{ url: string; isPrimary: boolean; order: number }[]>(initialImages)

    const handleImageUploaded = (url: string) => {
        const newImages = [...images, {
            url,
            isPrimary: images.length === 0, // Primera imagen es principal
            order: images.length
        }]
        setImages(newImages)
        onImagesChange(newImages)
    }

    const handleSetPrimary = (index: number) => {
        const newImages = images.map((img, i) => ({
            ...img,
            isPrimary: i === index
        }))
        setImages(newImages)
        onImagesChange(newImages)
    }

    const handleRemoveImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        // Si eliminamos la imagen principal, hacer que la primera sea principal
        if (images[index].isPrimary && newImages.length > 0) {
            newImages[0].isPrimary = true
        }
        // Reordenar
        const reordered = newImages.map((img, i) => ({ ...img, order: i }))
        setImages(reordered)
        onImagesChange(reordered)
    }

    const handleMoveImage = (fromIndex: number, direction: 'up' | 'down') => {
        const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
        if (toIndex < 0 || toIndex >= images.length) return

        const newImages = [...images]
        const temp = newImages[fromIndex]
        newImages[fromIndex] = newImages[toIndex]
        newImages[toIndex] = temp

        // Actualizar orden
        const reordered = newImages.map((img, i) => ({ ...img, order: i }))
        setImages(reordered)
        onImagesChange(reordered)
    }

    return (
        <div className="space-y-6">
            {/* Galería de imágenes existentes */}
            {images.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700">
                        Imágenes del producto ({images.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className={`relative group rounded-xl overflow-hidden border-2 ${img.isPrimary
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : 'border-gray-200'
                                    }`}
                            >
                                {/* Badge de imagen principal */}
                                {img.isPrimary && (
                                    <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                        Principal
                                    </div>
                                )}

                                {/* Imagen */}
                                <div className="aspect-square bg-gray-100 relative">
                                    {img.url ? (
                                        <Image
                                            src={img.url}
                                            alt={`Imagen ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                            onError={(e) => {
                                                console.error('Error loading image:', img.url);
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center text-gray-400">
                                                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-xs">Sin URL</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Controles */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex gap-2">
                                        {/* Establecer como principal */}
                                        {!img.isPrimary && (
                                            <button
                                                type="button"
                                                onClick={() => handleSetPrimary(index)}
                                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                                title="Establecer como principal"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </button>
                                        )}

                                        {/* Mover arriba */}
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => handleMoveImage(index, 'up')}
                                                className="p-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors"
                                                title="Mover arriba"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                                </svg>
                                            </button>
                                        )}

                                        {/* Mover abajo */}
                                        {index < images.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleMoveImage(index, 'down')}
                                                className="p-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors"
                                                title="Mover abajo"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        )}

                                        {/* Eliminar */}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                            title="Eliminar imagen"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Subir nueva imagen */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {images.length === 0 ? 'Imagen del Producto' : 'Agregar más imágenes'}
                </label>
                <ImageUploader
                    onImageUploaded={handleImageUploaded}
                    currentImageUrl=""
                />
            </div>

            {/* Información */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Tips para las imágenes:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>La primera imagen (o la marcada como principal) se mostrará en las tarjetas</li>
                            <li>Puedes reordenar las imágenes con las flechas</li>
                            <li>Usa imágenes de alta calidad (hasta 5MB cada una)</li>
                            <li>Formatos recomendados: JPG, PNG, WEBP</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
