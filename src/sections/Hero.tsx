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
    <section id="inicio" className="relative isolate flex min-h-svh items-end overflow-hidden bg-night text-snow">
      <motion.img
        src="img/boda-ramo-pareja.webp"
        alt="Ramo de novia con rosas, lavanda y suculenta, hecho por Florería La Silla"
        initial={{ scale: 1.06 }}
        animate={play ? { scale: 1 } : undefined}
        transition={{ duration: 2.4, ease }}
        className="absolute inset-0 -z-10 size-full object-cover object-[38%_50%]"
      />
      {/* oscurece abajo y a la izquierda para que el texto se lea sin tapar el ramo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(28,28,32,0.9)_0%,rgba(28,28,32,0.55)_50%,rgba(28,28,32,0.2)_100%)] md:bg-[linear-gradient(to_right,rgba(28,28,32,0.88)_0%,rgba(28,28,32,0.6)_40%,rgba(28,28,32,0.1)_70%)]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-16 md:px-8 md:pb-24">
        {/* logo con la descripción a un lado (en celular, debajo) */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
          <motion.h1 {...rise(0.2, play)} className="shrink-0">
            <img src="brand/logo-blanco.png" alt="Florería La Silla" width={1600} height={1128} className="w-[min(72vw,17rem)] md:w-[22rem] lg:w-[25rem]" />
          </motion.h1>

          <motion.div {...rise(0.35, play)} className="max-w-xs md:border-l md:border-snow/35 md:pl-10">
            <p className="font-display text-[1.7rem] leading-tight md:text-[2rem]">Desde {SITE.since}</p>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-snow/85 md:text-lg">Arreglos florales para toda ocasión en Monterrey.</p>
          </motion.div>
        </div>

        <motion.div {...rise(0.5, play)} className="mt-9 flex flex-wrap items-center gap-3">
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
