import { createClient } from '@/lib/utils/supabase/server'
import { Product } from '@/types/database'
import ProductImage from '@/components/ProductImage'
import Link from 'next/link'

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Productos</h1>
            <p className="text-gray-600">
              Total: <span className="font-semibold text-blue-600">{products?.length || 0}</span> productos
            </p>
          </div>
          <Link
            href="/products/new"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
          </Link>
        </div>

        {!products || products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-gray-500 mb-4 text-lg">
              No hay productos disponibles
            </p>
            <Link
              href="/products/new"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              Crear el primer producto →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Imagen</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Nombre</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Descripción</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Precio</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Stock</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Categoría</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: Product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm">
                          <ProductImage
                            src={product.image_url || ''}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-gray-900">{product.name}</td>
                      <td className="p-4 max-w-xs truncate text-gray-600">
                        {product.description}
                      </td>
                      <td className="p-4 font-bold text-blue-600 text-lg">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.stock > 10
                            ? 'bg-green-100 text-green-700'
                            : product.stock > 0
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/products/${product.id}`}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver
                          </Link>
                          <Link
                            href={`/products/${product.id}/edit`}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
