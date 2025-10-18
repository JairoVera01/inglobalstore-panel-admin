import { getUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import RedeployButton from '@/components/RedeployButton'

export default async function AdminPage() {
    const user = await getUser()

    if (!user) {
        redirect('/auth/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
                        <svg className="w-10 h-10 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Configuración de Admin
                    </h1>
                    <p className="text-gray-600">
                        Herramientas administrativas y configuración del sistema
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card de Deploy */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Deploy en Cloudflare</h2>
                                <p className="text-sm text-gray-500">Cloudflare Pages</p>
                            </div>
                        </div>

                        <p className="text-gray-600 mb-6 text-sm">
                            Inicia un nuevo deploy en Cloudflare Pages para actualizar tu sitio web con los últimos cambios de productos.
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-start text-sm text-gray-600">
                                <svg className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Actualiza el catálogo de productos
                            </div>
                            <div className="flex items-start text-sm text-gray-600">
                                <svg className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Sincroniza cambios de inventario
                            </div>
                            <div className="flex items-start text-sm text-gray-600">
                                <svg className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Proceso automático (2-5 min)
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <RedeployButton />
                        </div>
                    </div>

                    {/* Card de Información del Usuario */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Información de Usuario</h2>
                                <p className="text-sm text-gray-500">Cuenta actual</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Email</p>
                                <p className="font-medium text-gray-900 truncate">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">ID de Usuario</p>
                                <p className="font-mono text-xs text-gray-600 truncate">{user.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Estado</p>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Activo
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card de Estadísticas (placeholder para futuro) */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Estadísticas</h2>
                                <p className="text-sm text-gray-500">Métricas del sistema</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total de Productos</p>
                                <p className="text-3xl font-bold text-gray-900">-</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Último Deploy</p>
                                <p className="text-sm text-gray-700">Por configurar</p>
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                    💡 Próximamente: tracking de deploys y estadísticas detalladas
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
