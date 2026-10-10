import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, ChevronRight, Clock, CreditCard, ShoppingBag, Truck } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { ProductCard } from '@/components/shop/ProductCard'
import { Carousel } from '@/components/ui/carousel'
import { CATEGORIAS, PRODUCTOS, precio, type CategoriaId } from '@/lib/catalogo'
import { useShop } from '@/lib/cart'
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
const rowId = (c: CategoriaId) => `fila-${c}`

/** Qué fila está a la vista, para marcarla en la barra lateral. */
function useActiveRow() {
  const [active, setActive] = useState<CategoriaId>(CATEGORIAS[0].id)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id.replace('fila-', '') as CategoriaId)
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    CATEGORIAS.forEach((c) => {
      const el = document.getElementById(rowId(c.id))
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  return active
}

/** Una fila por categoría: carrusel, y "ver todos" la abre en cuadrícula. */
function Fila({ cat }: { cat: (typeof CATEGORIAS)[number] }) {
  const [all, setAll] = useState(false)
  const items = PRODUCTOS.filter((p) => p.cat === cat.id)

  return (
    <div id={rowId(cat.id)} className="scroll-mt-24 border-t border-ink/10 py-11 first:border-t-0 first:pt-0 md:py-14">
      <div className="mb-7 flex items-end justify-between gap-4">
        <h3 className="font-display text-[clamp(1.6rem,2.8vw,2.3rem)] leading-none text-ink">{cat.title}</h3>
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          className="group inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1 text-[0.7rem] font-medium tracking-[0.18em] text-stone uppercase transition-colors hover:text-rose"
          aria-expanded={all}
        >
          {all ? 'Ver menos' : `Ver los ${items.length}`}
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
        <Carousel label={cat.title} itemClassName="w-[64%] sm:w-[calc((100%-2rem)/2.6)] md:w-[calc((100%-2rem)/3)] xl:w-[calc((100%-3rem)/4)]">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </Carousel>
      )}
    </div>
  )
}

function Sidebar({ active }: { active: CategoriaId }) {
  const { count, subtotal, porConfirmar, setCartOpen } = useShop()
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 flex flex-col">
        <p className={label}>Categorías:</p>
        <ul className="mt-4 flex flex-col">
          {CATEGORIAS.map((c) => (
            <li key={c.id}>
              <a
                href={`#${rowId(c.id)}`}
                className={cn('group flex items-center gap-3 py-1.5 font-display text-[1.22rem] leading-snug transition-colors', active === c.id ? 'text-rose' : 'text-ink/75 hover:text-ink')}
              >
                <span className={cn('h-px shrink-0 bg-rose transition-all duration-500', active === c.id ? 'w-5' : 'w-0 group-hover:w-3')} />
                {c.name}
              </a>
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

        <div className="pt-7">
          <p className={label}>Tu pedido:</p>
          {count ? (
            <button type="button" onClick={() => setCartOpen(true)} className="group mt-3 flex w-full cursor-pointer items-center justify-between gap-3 text-left">
              <span>
                <span className="block font-display text-[1.3rem] leading-tight text-ink">
                  {count} {count === 1 ? 'arreglo' : 'arreglos'}
                </span>
                <span className="text-[0.85rem] text-stone">
                  {subtotal ? `${precio(subtotal)} + envío` : 'Precio por confirmar'}
                  {subtotal > 0 && porConfirmar && ' · y por cotizar'}
                </span>
              </span>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-paper transition group-hover:bg-rose">
                <ShoppingBag className="size-[1.1rem]" strokeWidth={1.5} />
              </span>
            </button>
          ) : (
            <p className="mt-3 max-w-[15rem] text-[0.88rem] leading-relaxed text-stone">
              Agrega los arreglos que quieras y al final nos mandas el pedido por WhatsApp.
            </p>
          )}
          <p className="mt-6 text-[0.82rem] text-stone">
            ¿Dudas?{' '}
            <a href={SITE.phoneHref} className="text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-rose">
              {SITE.phone}
            </a>
          </p>
        </div>
      </div>
    </aside>
  )
}

export function Arreglos() {
  const active = useActiveRow()

  return (
    <section id="flores" className="scroll-mt-20 bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-[88rem] px-4 md:px-8">
        <Reveal className="text-center">
          <h2 id="arreglos" className="scroll-mt-28 font-display text-[clamp(2.6rem,5.6vw,4.6rem)] leading-[1] text-ink">
            Arreglos ocasionales
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[1rem] leading-relaxed text-stone">
            Arma tu pedido con uno o varios arreglos y mándanoslo por WhatsApp. Le ponemos tu tarjeta y lo llevamos a donde nos digas.
          </p>
        </Reveal>

        {/* categorías en celular y tablet: texto con línea fina bajo la activa */}
        <div className="-mx-4 mt-8 overflow-x-auto px-4 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          <ul className="mx-auto flex w-max items-center border-b border-ink/10">
            {CATEGORIAS.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${rowId(c.id)}`}
                  className={cn(
                    'relative inline-flex min-h-11 items-center px-3.5 text-[0.7rem] font-medium tracking-[0.18em] uppercase transition-colors',
                    active === c.id ? 'text-rose' : 'text-stone',
                  )}
                >
                  {c.name}
                  {active === c.id && <motion.span layoutId="cat-line" className="absolute inset-x-3.5 -bottom-px h-[2px] bg-rose" />}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-16 lg:grid-cols-[14.5rem_1fr] lg:gap-12 xl:grid-cols-[16rem_1fr]">
          <Sidebar active={active} />
          <div className="min-w-0 lg:border-l lg:border-ink/10 lg:pl-12">
            {CATEGORIAS.map((c) => (
              <Fila key={c.id} cat={c} />
            ))}
            <p className="border-t border-ink/10 pt-6 text-[0.82rem] text-stone">* Precios más envío. La flor está sujeta a disponibilidad de color y temporada.</p>
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
