'use client'

import { useEffect } from 'react'

/* Efeitos de página baseados em DOM (sem estado React):
   1. reveal: marca .reveal como .in quando entra na tela
   2. timeline: --tl (0..1) na .timeline, a linha se desenha no scroll
   3. aro de luz do .capture: segue o cursor, acende no foco de campos,
      faz uma varredura de apresentação ao entrar na tela
   4. botões magnéticos: --mx/--my puxam o botão em direção ao cursor
   Referência de comportamento: motion-lab (border glow, aura CTA). */
export default function Fx() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0

    /* ---------- 1 + 2: reveal e progresso da timeline ---------- */
    const sweep = () => {
      raf = 0
      const vh = window.innerHeight
      const limit = vh * 0.92
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        if (el.getBoundingClientRect().top < limit) el.classList.add('in')
      })
      const tl = document.querySelector<HTMLElement>('.timeline')
      if (tl) {
        const r = tl.getBoundingClientRect()
        const progress = reduced ? 1 : Math.min(1, Math.max(0, (vh * 0.85 - r.top) / r.height))
        tl.style.setProperty('--tl', progress.toFixed(3))
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(sweep)
    }
    sweep()
    const timer = window.setInterval(schedule, 400)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    /* ---------- 3: aro de luz no card do formulário ---------- */
    const card = document.querySelector<HTMLElement>('.capture')
    const cleanups: Array<() => void> = []

    if (card && !reduced) {
      let hovered = false
      let focused = false
      let sweepFrame = 0
      let pointerFrame = 0
      let pending: PointerEvent | null = null

      const render = (angle: number, opacity: number) => {
        card.style.setProperty('--ga', `${angle.toFixed(2)}deg`)
        card.style.setProperty('--go', opacity.toFixed(3))
      }

      // ângulo do cursor em relação ao centro do card (0deg = topo, sentido horário)
      // e proximidade da borda (0 no centro, 1 na borda), como no border glow do React Bits
      const fromPointer = (e: PointerEvent) => {
        const r = card.getBoundingClientRect()
        const dx = e.clientX - r.left - r.width / 2
        const dy = e.clientY - r.top - r.height / 2
        const kx = dx === 0 ? Infinity : r.width / 2 / Math.abs(dx)
        const ky = dy === 0 ? Infinity : r.height / 2 / Math.abs(dy)
        const proximity = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
        let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
        if (angle < 0) angle += 360
        render(angle, 0.35 + proximity * 0.65)
      }

      const cancelSweep = () => {
        if (sweepFrame) cancelAnimationFrame(sweepFrame)
        sweepFrame = 0
      }
      // varredura de apresentação: a luz dá uma volta no card e apaga
      const playSweep = () => {
        cancelSweep()
        const start = performance.now()
        const dur = 2600
        const easeOut = (x: number) => 1 - (1 - x) ** 3
        const easeIn = (x: number) => x ** 3
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur)
          const op = p < 0.15 ? easeOut(p / 0.15) : p < 0.65 ? 1 : 1 - easeIn((p - 0.65) / 0.35)
          render(110 + 355 * p, op * 0.9)
          if (p < 1) sweepFrame = requestAnimationFrame(tick)
          else {
            sweepFrame = 0
            if (!hovered && !focused) render(45, 0)
          }
        }
        sweepFrame = requestAnimationFrame(tick)
      }

      const onEnter = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return
        hovered = true
        cancelSweep()
        fromPointer(e)
      }
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return
        pending = e
        if (pointerFrame) return
        pointerFrame = requestAnimationFrame(() => {
          pointerFrame = 0
          if (pending) fromPointer(pending)
        })
      }
      const onLeave = () => {
        hovered = false
        pending = null
        if (!focused) render(45, 0)
      }
      // teclado/celular: campo focado acende o aro por cima
      const onFocusIn = () => {
        focused = true
        cancelSweep()
        if (!hovered) render(0, 0.8)
      }
      const onFocusOut = () => {
        focused = false
        if (!hovered) render(45, 0)
      }

      card.addEventListener('pointerenter', onEnter)
      card.addEventListener('pointermove', onMove)
      card.addEventListener('pointerleave', onLeave)
      card.addEventListener('focusin', onFocusIn)
      card.addEventListener('focusout', onFocusOut)

      let seen = false
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !seen) {
            seen = true
            window.setTimeout(playSweep, 900) // depois da entrada do hero
          }
        },
        { threshold: 0.4 },
      )
      io.observe(card)

      cleanups.push(() => {
        cancelSweep()
        if (pointerFrame) cancelAnimationFrame(pointerFrame)
        io.disconnect()
        card.removeEventListener('pointerenter', onEnter)
        card.removeEventListener('pointermove', onMove)
        card.removeEventListener('pointerleave', onLeave)
        card.removeEventListener('focusin', onFocusIn)
        card.removeEventListener('focusout', onFocusOut)
      })
    }

    /* ---------- 4: botões magnéticos ---------- */
    if (!reduced) {
      const MAGNET = 6
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return
        const btn = (e.target as HTMLElement | null)?.closest<HTMLElement>('.btn-primary, .btn-light')
        if (!btn) return
        const r = btn.getBoundingClientRect()
        const x = ((e.clientX - r.left) / r.width - 0.5) * MAGNET
        const y = ((e.clientY - r.top) / r.height - 0.5) * MAGNET
        btn.style.setProperty('--mx', `${x.toFixed(1)}px`)
        btn.style.setProperty('--my', `${y.toFixed(1)}px`)
      }
      const onOut = (e: PointerEvent) => {
        const btn = (e.target as HTMLElement | null)?.closest<HTMLElement>('.btn-primary, .btn-light')
        if (!btn) return
        btn.style.setProperty('--mx', '0px')
        btn.style.setProperty('--my', '0px')
      }
      document.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerout', onOut, { passive: true })
      cleanups.push(() => {
        document.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerout', onOut)
      })
    }

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return null
}
