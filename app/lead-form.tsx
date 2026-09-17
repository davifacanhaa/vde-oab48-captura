'use client'

import { useState } from 'react'

const ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT
const REDIRECT = process.env.NEXT_PUBLIC_REDIRECT_URL

/* Máscara de telefone BR: (00) 00000-0000, aceitando fixo (00) 0000-0000 */
function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  const len = digits.length
  if (len === 0) return ''
  if (len <= 2) return `(${digits}`
  if (len <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (len <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export default function LeadForm({ cta = 'Finalizar inscrição gratuita' }: { cta?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [whatsapp, setWhatsapp] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    setStatus('sending')
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, origem: 'captura-oab48-90d' }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      }
      setStatus('ok')
      if (REDIRECT) window.location.href = REDIRECT
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <div className="form-success">
        <span className="ok">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </span>
        <h4>Inscrição confirmada!</h4>
        <p>
          Agora é só ficar de olho no seu WhatsApp e no seu e-mail. O link da
          aula e os lembretes vão chegar por lá.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="nome">Nome</label>
        <input id="nome" type="text" name="nome" placeholder="Seu nome completo" required autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="whatsapp">Número (WhatsApp)</label>
        <input
          id="whatsapp"
          type="tel"
          name="whatsapp"
          placeholder="(00) 00000-0000"
          required
          autoComplete="tel"
          inputMode="tel"
          maxLength={15}
          value={whatsapp}
          onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
        />
      </div>
      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" name="email" placeholder="Seu melhor e-mail" required autoComplete="email" />
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando...' : cta}
      </button>

      <p className="form-note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        100% gratuito. Seus dados estão seguros.
      </p>

      {status === 'error' && (
        <p className="form-error">Algo deu errado no envio. Tenta de novo em alguns segundos.</p>
      )}
    </form>
  )
}
