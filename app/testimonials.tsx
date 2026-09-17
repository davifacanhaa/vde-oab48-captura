'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export type Depoimento = { src: string; w: number; h: number; alt: string }

const IconArrow = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    {dir === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
  </svg>
)

export default function Testimonials({ items }: { items: Depoimento[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const scrollToIndex = (i: number) => {
    const track = trackRef.current
    const card = track?.children[i] as HTMLElement | undefined
    if (!track || !card) return
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' })
  }

  const go = (dir: number) => {
    const next = Math.max(0, Math.min(items.length - 1, index + dir))
    setIndex(next)
    scrollToIndex(next)
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        let closest = 0
        let closestDist = Infinity
        Array.from(track.children).forEach((child, i) => {
          const el = child as HTMLElement
          const dist = Math.abs(el.offsetLeft - track.offsetLeft - track.scrollLeft)
          if (dist < closestDist) {
            closestDist = dist
            closest = i
          }
        })
        setIndex(closest)
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="dep-carousel">
      <div className="dep-track" ref={trackRef}>
        {items.map((t) => (
          <div className="dep-card" key={t.src}>
            <Image src={t.src} alt={t.alt} width={t.w} height={t.h} sizes="(min-width: 1024px) 380px, 84vw" />
          </div>
        ))}
      </div>

      <div className="dep-controls">
        <button
          type="button"
          className="dep-arrow"
          aria-label="Depoimento anterior"
          onClick={() => go(-1)}
          disabled={index === 0}
        >
          <IconArrow dir="left" />
        </button>
        <div className="dep-dots">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`dep-dot${i === index ? ' active' : ''}`}
              aria-label={`Ir para o depoimento ${i + 1}`}
              onClick={() => {
                setIndex(i)
                scrollToIndex(i)
              }}
            />
          ))}
        </div>
        <button
          type="button"
          className="dep-arrow"
          aria-label="Próximo depoimento"
          onClick={() => go(1)}
          disabled={index === items.length - 1}
        >
          <IconArrow dir="right" />
        </button>
      </div>
    </div>
  )
}
