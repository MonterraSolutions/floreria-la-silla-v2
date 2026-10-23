import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/** Intro de marca: la rosa se dibuja, el nombre sale de desenfocado a nítido y el telón sube. */
export function Intro({ onDone }: { onDone: () => void }) {
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.body.classList.add('is-locked')
    // «Boutique floral» termina de aparecer a los 1.8 s: se deja un segundo para leerlo antes de subir el telón
    const finish = window.setTimeout(() => setDone(true), reduce ? 500 : 2800)
    const safety = window.setTimeout(() => setDone(true), 6000)
    return () => {
      window.clearTimeout(finish)
      window.clearTimeout(safety)
    }
  }, [])

  useEffect(() => {
    if (!done) return
    document.body.classList.remove('is-locked')
    onDone()
    const t = window.setTimeout(() => setGone(true), 1000)
    return () => window.clearTimeout(t)
  }, [done, onDone])

  if (gone) return null

  return (
    <div className={cn('intro', done && 'is-done')} onClick={() => setDone(true)} aria-hidden="true">
      <div className="intro-stage flex flex-col items-center text-center">
        <div className="intro-logo">
          <img className="intro-frame" src="brand/capa-marco.png" alt="" width={1600} height={1128} />
          <img className="intro-rose" src="brand/capa-rosa.png" alt="" width={1600} height={1128} />
          <span className="intro-shine" />
        </div>
        <span className="intro-tag">Boutique floral</span>
      </div>
    </div>
  )
}
