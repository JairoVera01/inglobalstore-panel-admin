import Link from 'next/link'
import { signUp } from '@/lib/actions/auth'

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">InGlobalStore</h1>
                    <h2 className="text-2xl font-semibold text-gray-700">Crear Cuenta</h2>
                    <p className="mt-2 text-gray-600">Regístrate para gestionar tu tienda</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form action={signUp} className="space-y-6">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-semibold text-gray-800 mb-2">
                                Nombre Completo
                            </label>
                            <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                required
                                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                                placeholder="Escribe tu nombre completo"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                                placeholder="ejemplo@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                                placeholder="Crea una contraseña segura"
                            />
                            <p className="mt-2 text-xs text-gray-600 flex items-center">
                                <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Mínimo 6 caracteres
                            </p>
                        </div>                        <div className="flex items-start">
                            <div className="flex items-center h-6">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-2 border-gray-300 rounded-lg cursor-pointer transition-all"
                                />
                            </div>
                            <label htmlFor="terms" className="ml-3 block text-sm text-gray-700 font-medium cursor-pointer">
                                Acepto los{' '}
                                <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 underline decoration-blue-400 hover:decoration-blue-600">
                                    términos y condiciones
                                </a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-md text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-[1.02]"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Crear Cuenta
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                href="/auth/login"
                                className="w-full flex justify-center py-3 px-4 border-2 border-blue-600 rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                            >
                                Iniciar Sesión
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-600">
                    Al registrarte, aceptas nuestros{' '}
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                        Términos de Servicio
                    </a>{' '}
                    y{' '}
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                        Política de Privacidad
                    </a>
                </p>
            </div>
        </div>
    )
}
