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

/** true en pantallas de compu; el video solo se baja ahí (en celular sigue la foto) */
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

export function Hero({ play }: { play: boolean }) {
  const desktop = useDesktop()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const video = useRef<HTMLVideoElement>(null)

  // el video arranca cuando sube el telón del intro, corre una vez y se queda en el último cuadro
  useEffect(() => {
    if (play) video.current?.play().catch(() => {})
  }, [play, desktop])

  return (
    <section id="inicio" className="relative isolate flex min-h-svh items-end overflow-hidden bg-ink text-paper">
      {desktop && !reduce ? (
        <video
          ref={video}
          src="video/portada-compu.mp4"
          poster="video/portada-compu-inicio.jpg"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
      ) : desktop ? (
        <img
          src="video/portada-compu-final.jpg"
          alt="Arreglo en caja rosa de Florería La Silla sobre una mesa de mármol"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
      ) : (
        <motion.img
          src="img/boda-ramo-pareja.webp"
          alt="Ramo de novia con rosas, lavanda y suculenta, hecho por Florería La Silla"
          initial={{ scale: 1.06 }}
          animate={play ? { scale: 1 } : undefined}
          transition={{ duration: 2.4, ease }}
          className="absolute inset-0 -z-10 size-full object-cover object-[38%_50%]"
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
