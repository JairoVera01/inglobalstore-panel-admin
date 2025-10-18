'use client'

import { Product } from '@/types/database'
import { useState } from 'react'
import Link from 'next/link'
import MultiImageUploader from './MultiImageUploader'

interface ProductFormProps {
    product?: Product
    action: (formData: FormData) => Promise<void> | void
    submitLabel: string
}

export default function ProductForm({ product, action, submitLabel }: ProductFormProps) {
    // Debug: Ver qué datos llegan
    console.log('ProductForm - product:', product);
    console.log('ProductForm - product.images:', product?.images);
    console.log('ProductForm - product.images type:', typeof product?.images);

    // Inicializar con las imágenes existentes
    let initialImages = [];

    // Si product.images es un array válido
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
        initialImages = product.images;
    }
    // Si product.images es un string JSON, parsearlo
    else if (product?.images && typeof product.images === 'string') {
        try {
            const parsed = JSON.parse(product.images);
            if (Array.isArray(parsed) && parsed.length > 0) {
                initialImages = parsed;
            }
        } catch (e) {
            console.error('Error parsing images JSON:', e);
        }
    }
    // Fallback: usar image_url si existe
    if (initialImages.length === 0 && product?.image_url) {
        initialImages = [{ url: product.image_url, isPrimary: true, order: 0 }];
    }

    console.log('ProductForm - initialImages:', initialImages);

    const [images, setImages] = useState(initialImages)

    return (
        <form action={action} className="max-w-2xl mx-auto space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre del Producto *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={product?.name}
                    required
                    className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                    placeholder="Ej: iPhone 15 Pro"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción
                </label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={product?.description}
                    rows={4}
                    className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400 resize-none"
                    placeholder="Describe el producto en detalle..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                        Precio (USD) *
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            defaultValue={product?.price}
                            required
                            step="0.01"
                            min="0"
                            className="w-full pl-8 pr-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-2">
                        Stock Disponible *
                    </label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        defaultValue={product?.stock}
                        required
                        min="0"
                        className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                        placeholder="Ej: 100"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoría
                </label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    defaultValue={product?.category}
                    className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                    placeholder="Ej: Electrónica, Ropa, Hogar, etc."
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Imágenes del Producto
                </label>
                <MultiImageUploader
                    onImagesChange={(imgs) => setImages(imgs)}
                    initialImages={initialImages}
                />
                {/* Campo oculto para enviar la URL principal */}
                <input
                    type="hidden"
                    id="image_url"
                    name="image_url"
                    value={images.find((img) => img.isPrimary)?.url || images[0]?.url || ''}
                />
                {/* Campo oculto para enviar el array completo de imágenes */}
                <input
                    type="hidden"
                    id="images_json"
                    name="images_json"
                    value={JSON.stringify(images)}
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                    type="submit"
                    className="flex-1 flex justify-center items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-4 rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-[1.02]"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {submitLabel}
                </button>
                <Link
                    href="/products"
                    className="flex-1 flex justify-center items-center text-center border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-4 rounded-xl transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-200"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancelar
                </Link>
            </div>
        </form>
    )
}
