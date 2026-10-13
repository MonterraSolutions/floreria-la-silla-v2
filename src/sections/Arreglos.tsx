import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, ChevronRight, Clock, CreditCard, Truck } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { ProductCard } from '@/components/shop/ProductCard'
import { Carousel } from '@/components/ui/carousel'
import { CATEGORIAS, PRODUCTOS, type CategoriaId } from '@/lib/catalogo'
import { SITE } from '@/lib/site'
import { cn } from '@/lib/utils'

// datos de su sección de preguntas frecuentes (florerialasilla.com)
const INFO = [
  { icon: Clock, t: 'Mismo día', d: 'Pide antes de las 12:00, lun a vie' },
  { icon: CalendarDays, t: 'Sábados', d: 'Pide desde el viernes' },
  { icon: Truck, t: 'Todo Monterrey', d: 'Y su área metropolitana' },
  { icon: CreditCard, t: 'Pagos', d: 'Transferencia, efectivo o tarjeta' },
]

const label = 'text-[0.68rem] font-medium tracking-[0.24em] text-stone uppercase'
/**
 * La categoría elegida: carrusel, y "ver más" la abre en cuadrícula. Cambia en su lugar, sin mover la página.
 * "Ver más" se queda abierto al cambiar de categoría (el estado vive en la sección).
 */
function Panel({ cat, all, setAll }: { cat: (typeof CATEGORIAS)[number]; all: boolean; setAll: (fn: (v: boolean) => boolean) => void }) {
  const items = PRODUCTOS.filter((p) => p.cat === cat.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="pb-10"
    >
      <div className="mb-4 flex items-end justify-end gap-4 lg:mb-7 lg:justify-between">
        <h3 className="max-lg:sr-only font-display text-[clamp(1.6rem,2.8vw,2.3rem)] leading-none text-ink">{cat.title}</h3>
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          className="group inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1 text-[0.7rem] font-medium tracking-[0.18em] text-stone uppercase transition-colors hover:text-rose"
          aria-expanded={all}
        >
          {all ? 'Ver menos' : 'Ver más'}
          <ChevronRight className={cn('size-4 transition-transform', all ? '-rotate-90' : 'group-hover:translate-x-0.5')} strokeWidth={1.5} />
        </button>
      </div>

      {all ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4"
        >
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </motion.div>
      ) : (
        <Carousel label={cat.title} resetKey={cat.id} itemClassName="w-[64%] sm:w-[calc((100%-2rem)/2.6)] md:w-[calc((100%-2rem)/3)] xl:w-[calc((100%-3rem)/4)]">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </Carousel>
      )}
    </motion.div>
  )
}

function Sidebar({ active, onPick }: { active: CategoriaId; onPick: (c: CategoriaId) => void }) {
  return (
    <aside className="hidden lg:block">
      {/* se queda a la vista al bajar por los arreglos, solo si cabe completo en la pantalla */}
      <div className="flex flex-col lg:[@media(min-height:740px)]:sticky lg:top-20">
        <p className={label}>Categorías:</p>
        <ul className="mt-4 flex flex-col" role="tablist" aria-label="Categorías" aria-orientation="vertical">
          {CATEGORIAS.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                role="tab"
                aria-selected={active === c.id}
                onClick={() => onPick(c.id)}
                className={cn('group flex w-full cursor-pointer items-center gap-3 py-1.5 text-left font-display text-[1.22rem] leading-snug transition-colors', active === c.id ? 'text-rose' : 'text-ink/75 hover:text-ink')}
              >
                <span className={cn('h-px shrink-0 bg-rose transition-all duration-500', active === c.id ? 'w-5' : 'w-0 group-hover:w-3')} />
                {c.name}
                <span className="ml-auto font-sans text-[0.75rem] text-stone/70 tabular-nums">{PRODUCTOS.filter((p) => p.cat === c.id).length}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-md bg-tile/70 px-5 py-6">
          <p className={label}>Entregas:</p>
          <ul className="mt-4 flex flex-col gap-4">
            {INFO.map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex items-start gap-3">
                <Icon className="mt-0.5 size-[1.05rem] shrink-0 text-rose" strokeWidth={1.5} />
                <span>
                  <span className="block font-display text-[0.98rem] leading-none text-ink">{t}</span>
                  <span className="mt-1.5 block text-[0.82rem] leading-snug text-stone">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-5">
          <p className="text-[0.82rem] text-stone">
            ¿Dudas?{' '}
            <a href={SITE.phoneHref} className="text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-rose">
              {SITE.phone}
            </a>
          </p>
          <p className="mt-3 text-[0.78rem] leading-relaxed text-stone">* Precios más envío. La flor está sujeta a disponibilidad de color y temporada.</p>
        </div>
      </div>
    </aside>
  )
}

export function Arreglos() {
  const [active, setActive] = useState<CategoriaId>(CATEGORIAS[0].id)
  const [all, setAll] = useState(false)
  const cat = CATEGORIAS.find((c) => c.id === active)!

  return (
    <section id="flores" className="scroll-mt-16 bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-[88rem] px-4 md:px-8">
        <Reveal className="text-center">
          <h2 id="arreglos" className="scroll-mt-24 font-display text-[clamp(2.6rem,5.6vw,4.6rem)] leading-[1] text-ink">
            Arreglos ocasionales
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[1rem] leading-relaxed text-stone">
            Arma tu pedido con uno o varios arreglos y mándanoslo por WhatsApp. Le ponemos tu tarjeta y lo llevamos a donde nos digas.
          </p>
        </Reveal>

        {/* categorías en celular y tablet: texto con línea fina bajo la activa */}
        <div className="-mx-4 mt-8 overflow-x-auto px-4 [mask-image:linear-gradient(to_right,transparent,#000_1rem,#000_calc(100%-2.5rem),transparent)] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          <ul className="mx-auto flex w-max items-center border-b border-ink/10" role="tablist" aria-label="Categorías">
            {CATEGORIAS.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={active === c.id}
                  onClick={(e) => {
                    setActive(c.id)
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
                  }}
                  className={cn(
                    'relative inline-flex min-h-11 cursor-pointer items-center px-3.5 text-[0.7rem] font-medium tracking-[0.18em] uppercase transition-colors',
                    active === c.id ? 'text-rose' : 'text-stone',
                  )}
                >
                  {c.name}
                  {active === c.id && <motion.span layoutId="cat-line" className="absolute inset-x-3.5 -bottom-px h-[2px] bg-rose" />}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-16 lg:grid-cols-[14.5rem_1fr] lg:gap-12 xl:grid-cols-[16rem_1fr]">
          <Sidebar active={active} onPick={setActive} />
          <div className="min-w-0 lg:border-l lg:border-ink/10 lg:pl-12" role="tabpanel" aria-label={cat.title}>
            <AnimatePresence mode="wait" initial={false}>
              <Panel key={cat.id} cat={cat} all={all} setAll={setAll} />
            </AnimatePresence>
            <p className="border-t border-ink/10 pt-6 text-[0.82rem] text-stone lg:hidden">* Precios más envío. La flor está sujeta a disponibilidad de color y temporada.</p>
          </div>
        </div>

        {/* entregas en celular y tablet */}
        <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/10 pt-8 lg:hidden">
          {INFO.map(({ icon: Icon, t, d }) => (
            <li key={t} className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-tile">
                <Icon className="size-[1.1rem] text-rose" strokeWidth={1.5} />
              </span>
              <span>
                <span className="block text-[0.95rem] text-ink">{t}</span>
                <span className="block text-[0.85rem] leading-snug text-stone">{d}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
