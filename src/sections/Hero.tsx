import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SITE } from '@/lib/site'

const ease = [0.22, 1, 0.36, 1] as const

function rise(delay: number, play: boolean) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: play ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, delay, ease },
  }
}

/** true en pantallas de compu: video horizontal; en celular va el vertical */
function useDesktop() {
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 768px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => setDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return desktop
}

/** Subirlo cada vez que cambie el video (el navegador y el CDN guardan la versión anterior). */
const VIDEO_V = 2

export function Hero({ play }: { play: boolean }) {
  const desktop = useDesktop()
  const formato = desktop ? 'compu' : 'celular'
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const video = useRef<HTMLVideoElement>(null)

  // el video arranca cuando sube el telón del intro, corre una vez y se queda en el último cuadro
  useEffect(() => {
    if (play) video.current?.play().catch(() => {})
  }, [play, formato])

  return (
    <section id="inicio" className="relative isolate flex min-h-svh items-end overflow-hidden bg-ink text-paper">
      {!reduce ? (
        <video
          key={formato}
          ref={video}
          src={`video/portada-${formato}.mp4?v=${VIDEO_V}`}
          poster={`video/portada-${formato}-inicio.jpg?v=${VIDEO_V}`}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
      ) : (
        <img
          src={`video/portada-${formato}-final.jpg?v=${VIDEO_V}`}
          alt="Arreglo en caja rosa de Florería La Silla sobre una mesa de mármol"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
      )}
      {/* oscurece abajo (celular) o solo la franja izquierda (compu) para que el texto se lea sin apagar el arreglo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(28,28,32,0.9)_0%,rgba(28,28,32,0.55)_50%,rgba(28,28,32,0.2)_100%)] md:bg-[linear-gradient(to_right,rgba(28,28,32,0.82)_0%,rgba(28,28,32,0.55)_24%,rgba(28,28,32,0.15)_42%,rgba(28,28,32,0)_58%)]"
      />
      {/* en compu la pared del video es muy clara: sombra arriba para que se lea el menú */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 hidden h-40 bg-[linear-gradient(to_bottom,rgba(28,28,32,0.55),rgba(28,28,32,0))] md:block" />

      <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-16 md:px-8 md:pb-24">
        {/* logo con la descripción debajo, a la izquierda */}
        <div className="flex flex-col gap-6">
          <motion.h1 {...rise(0.2, play)} className="shrink-0">
            <img src="brand/logo-blanco.png" alt="Florería La Silla" width={1600} height={1128} className="w-[min(72vw,17rem)] md:w-[17rem] lg:w-[19rem]" />
          </motion.h1>

          <motion.div {...rise(0.35, play)} className="max-w-md">
            <p className="font-display text-[1.7rem] leading-tight md:text-[2rem]">Desde {SITE.since}</p>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-paper/85 md:text-lg">Arreglos florales para toda ocasión en Monterrey.</p>
          </motion.div>
        </div>

        <motion.div {...rise(0.5, play)} className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#arreglos"
            className="inline-flex min-h-12 items-center rounded-sm bg-paper px-7 text-[0.8rem] font-normal tracking-[0.16em] text-ink uppercase transition hover:bg-blush"
          >
            Ver arreglos
          </a>
          <a
            href="#cotizar"
            className="inline-flex min-h-12 items-center rounded-sm px-7 text-[0.8rem] font-normal tracking-[0.16em] text-paper uppercase ring-1 ring-paper/50 transition hover:bg-paper/10 hover:ring-paper"
          >
            Cotizar evento
          </a>
        </motion.div>
      </div>
    </section>
  )
}
