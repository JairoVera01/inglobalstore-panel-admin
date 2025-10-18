import ProductForm from '@/components/ProductForm'
import { createProduct } from '@/lib/actions/products'

export default function NewProductPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
                        <svg className="w-10 h-10 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Producto
                    </h1>
                    <p className="text-gray-600">
                        Completa el formulario para agregar un nuevo producto al inventario
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <ProductForm action={createProduct} submitLabel="Crear Producto" />
                </div>
            </div>
        </div>
    )
}
