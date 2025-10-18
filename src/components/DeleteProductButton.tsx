'use client'

import { deleteProduct } from '@/lib/actions/products'
import { useTransition } from 'react'

export default function DeleteProductButton({ productId }: { productId: string }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
            startTransition(() => {
                deleteProduct(productId)
            })
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 flex justify-center items-center border-2 border-red-500 text-red-600 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white hover:border-transparent disabled:opacity-50 disabled:cursor-not-allowed font-semibold px-6 py-4 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-[1.02]"
        >
            {isPending ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Eliminando...
                </>
            ) : (
                <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar Producto
                </>
            )}
        </button>
    )
}
