'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageUploaderProps {
    onImageUploaded: (url: string) => void
    currentImageUrl?: string
    bucketName?: string
}

export default function ImageUploader({
    onImageUploaded,
    currentImageUrl,
    bucketName = 'images_products'
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
    const [error, setError] = useState<string | null>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            setError('Por favor selecciona un archivo de imagen válido')
            return
        }

        // Validar tamaño (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('La imagen no debe superar los 5MB')
            return
        }

        setError(null)
        setUploading(true)

        try {
            // Crear preview local
            const localPreview = URL.createObjectURL(file)
            setPreviewUrl(localPreview)

            // Crear FormData
            const formData = new FormData()
            formData.append('file', file)
            formData.append('bucket', bucketName)

            // Subir imagen
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al subir la imagen')
            }

            // Llamar al callback con la URL pública
            onImageUploaded(data.publicUrl)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al subir la imagen')
            setPreviewUrl(currentImageUrl || null)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Preview de la imagen */}
            {previewUrl && (
                <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                    <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                    {uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="text-white flex flex-col items-center">
                                <svg className="animate-spin h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="font-medium">Subiendo imagen...</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Input de archivo */}
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Haz clic para subir</span> o arrastra la imagen
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP (máx. 5MB)</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>
            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
                    <p className="text-sm text-red-800 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                </div>
            )}

            {/* Información */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800 flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    La imagen se subirá automáticamente a Supabase Storage y estará disponible públicamente.
                </p>
            </div>
        </div>
    )
}
