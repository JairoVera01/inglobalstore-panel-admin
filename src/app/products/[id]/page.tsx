import { createClient } from '@/lib/utils/supabase/server'
import ProductImage from '@/components/ProductImage'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import DeleteProductButton from '@/components/DeleteProductButton'

export default async function ProductPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !product) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Link
                        href="/products"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
                    >
                        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver a productos
                    </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid lg:grid-cols-2 gap-0">
                        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                            <ProductImage
                                src={product.image_url || ''}
                                alt={product.name}
                                width={600}
                                height={600}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                                priority
                            />
                        </div>

                        <div className="p-8 lg:p-12 space-y-6">
                            <div>
                                <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
                                    {product.category}
                                </span>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            </div>

                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-blue-600">
                                    ${product.price.toFixed(2)}
                                </span>
                                <span className="text-gray-500 text-lg">USD</span>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h2 className="font-semibold text-gray-900 text-lg mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    Descripción
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description || 'Sin descripción disponible'}
                                </p>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h2 className="font-semibold text-gray-900 text-lg mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    Disponibilidad
                                </h2>
                                <span className={`inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold ${product.stock > 10
                                    ? 'bg-green-100 text-green-700'
                                    : product.stock > 0
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {product.stock} unidades en stock
                                </span>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <p className="text-sm text-gray-500 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Creado el {new Date(product.created_at).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-6">
                                <Link
                                    href={`/products/${product.id}/edit`}
                                    className="flex-1 flex justify-center items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Editar Producto
                                </Link>
                                <DeleteProductButton productId={product.id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
