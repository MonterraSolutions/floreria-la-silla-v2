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

export function Hero({ play }: { play: boolean }) {
  return (
    <section id="inicio" className="relative isolate flex min-h-svh items-center overflow-hidden bg-night text-snow">
      <motion.img
        src="img/boda-ramo-pareja.webp"
        alt="Ramo de novia con rosas, lavanda y suculenta, hecho por Florería La Silla"
        initial={{ scale: 1.06 }}
        animate={play ? { scale: 1 } : undefined}
        transition={{ duration: 2.4, ease }}
        className="absolute inset-0 -z-10 size-full object-cover object-[38%_50%]"
      />
      {/* B: todo va al centro, así que se oscurece parejo (un poco más en medio, donde va el texto) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_55%,rgba(11,10,9,0.72)_0%,rgba(11,10,9,0.55)_60%,rgba(11,10,9,0.45)_100%)]"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pt-28 pb-16 text-center md:px-8">
        {/* B: logo al centro y la descripción debajo */}
        <motion.h1 {...rise(0.2, play)}>
          <img src="brand/logo-blanco.png" alt="Florería La Silla" width={1600} height={1128} className="w-[min(76vw,18rem)] md:w-[24rem] lg:w-[27rem]" />
        </motion.h1>

        <motion.div {...rise(0.35, play)} className="mt-8 md:mt-10">
          <p className="font-display text-[1.9rem] leading-tight md:text-[2.4rem]">Desde {SITE.since}</p>
          <p className="mx-auto mt-2 max-w-md text-[1.05rem] leading-relaxed text-snow/85 md:text-lg">Arreglos florales para toda ocasión en Monterrey.</p>
        </motion.div>

        <motion.div {...rise(0.5, play)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#arreglos"
            className="inline-flex min-h-12 items-center rounded-sm bg-snow px-7 text-[0.8rem] font-normal tracking-[0.16em] text-night uppercase transition hover:bg-snow/85"
          >
            Ver arreglos
          </a>
          <a
            href="#cotizar"
            className="inline-flex min-h-12 items-center rounded-sm px-7 text-[0.8rem] font-normal tracking-[0.16em] text-snow uppercase ring-1 ring-snow/50 transition hover:bg-snow/10 hover:ring-snow"
          >
            Cotizar evento
          </a>
        </motion.div>
      </div>
    </section>
  )
}
