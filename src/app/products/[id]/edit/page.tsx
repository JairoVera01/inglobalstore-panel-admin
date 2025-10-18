import { createClient } from '@/lib/utils/supabase/server'
import ProductForm from '@/components/ProductForm'
import { updateProduct } from '@/lib/actions/products'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !product) {
        notFound()
    }

    const updateProductWithId = async (formData: FormData) => {
        'use server'
        return updateProduct(params.id, formData)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
                        <svg className="w-10 h-10 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar Producto
                    </h1>
                    <p className="text-gray-600">
                        Modifica la información del producto: <span className="font-semibold text-gray-900">{product.name}</span>
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <ProductForm
                        product={product}
                        action={updateProductWithId}
                        submitLabel="Guardar Cambios"
                    />
                </div>
            </div>
        </div>
    )
}
