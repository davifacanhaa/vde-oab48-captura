'use client'

import { useEffect } from 'react'

export default function Fx() {
  useEffect(() => {
    let raf = 0

    // Consulta o DOM a cada varredura (nada de lista cacheada):
    // sobrevive a re-renders e revela elementos pulados em saltos de âncora.
    const sweep = () => {
      raf = 0
      const limit = window.innerHeight * 0.92
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        if (el.getBoundingClientRect().top < limit) el.classList.add('in')
      })
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(sweep)
    }

    sweep()
    const timer = window.setInterval(schedule, 400)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return null
}
