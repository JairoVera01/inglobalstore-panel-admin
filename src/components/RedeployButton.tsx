'use client'

import { useState } from 'react'

export default function RedeployButton() {
    const [isDeploying, setIsDeploying] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleRedeploy = async () => {
        if (isDeploying) return

        if (!confirm('¿Estás seguro de que deseas iniciar un nuevo deploy en Cloudflare Pages? Esto puede tardar varios minutos.')) {
            return
        }

        setIsDeploying(true)
        setMessage(null)

        try {
            const res = await fetch('/api/redeploy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const data = await res.json()

            if (data.ok) {
                setMessage({
                    type: 'success',
                    text: '🚀 Deploy iniciado correctamente. Tu sitio se actualizará en unos minutos.'
                })
            } else {
                setMessage({
                    type: 'error',
                    text: `Error: ${data.error || 'No se pudo iniciar el deploy'}`
                })
            }
        } catch {
            setMessage({
                type: 'error',
                text: 'Error de conexión. Intenta nuevamente.'
            })
        } finally {
            setIsDeploying(false)
        }
    }

    return (
        <div className="space-y-4">
            <button
                onClick={handleRedeploy}
                disabled={isDeploying}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-md text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all transform hover:scale-[1.02]"
            >
                {isDeploying ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Desplegando...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Redeploy en Cloudflare
                    </>
                )}
            </button>

            {message && (
                <div className={`p-4 rounded-xl border-2 ${message.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                    <p className="text-sm font-medium flex items-center">
                        {message.type === 'success' ? (
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        )}
                        {message.text}
                    </p>
                </div>
            )}
        </div>
    )
}
