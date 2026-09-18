'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  to: number
  prefix?: string
  suffix?: string
  duration?: number
}

/* Número que conta de 0 até `to` quando entra na tela.
   Formata em pt-BR (ponto de milhar). Com prefers-reduced-motion,
   mostra o valor final direto. */
export default function CountUp({ to, prefix = '', suffix = '', duration = 1600 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || done) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setValue(to)
      setDone(true)
      return
    }

    let raf = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - p, 3)
          setValue(Math.round(to * eased))
          if (p < 1) raf = requestAnimationFrame(tick)
          else setDone(true)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [to, duration, done])

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString('pt-BR')}
      {suffix}
    </span>
  )
}
