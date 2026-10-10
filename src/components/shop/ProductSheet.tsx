import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarClock, ChevronRight, Flower2, Mail, Minus, Plus, Truck, X } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons'
import { Badge, Price, ProductCard } from '@/components/shop/ProductCard'
import { CATEGORIAS, PRODUCTOS, byId, precio } from '@/lib/catalogo'
import { useShop } from '@/lib/cart'
import { waPedido } from '@/lib/site'
import { cn } from '@/lib/utils'

const TABS = ['Descripción', 'Envío', 'Pago'] as const
type Tab = (typeof TABS)[number]

const CHIPS = [
  { icon: Mail, t: 'Tarjeta con tu mensaje' },
  { icon: Truck, t: 'Entrega a domicilio' },
  { icon: CalendarClock, t: 'Mismo día antes de las 12' },
  { icon: Flower2, t: 'Flor de temporada' },
]

export function Stepper({ value, onChange, min = 1, small = false }: { value: number; onChange: (n: number) => void; min?: number; small?: boolean }) {
  const btn = cn('grid cursor-pointer place-items-center rounded-full text-ink transition hover:bg-ink/[0.06] disabled:cursor-default disabled:opacity-30', small ? 'size-8' : 'size-11')
  return (
    <div className={cn('inline-flex items-center rounded-full ring-1 ring-ink/15', small ? 'h-9 px-0.5' : 'h-12 px-0.5')}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Uno menos">
        <Minus className="size-3.5" strokeWidth={1.5} />
      </button>
      <span className={cn('text-center tabular-nums', small ? 'w-6 text-[0.9rem]' : 'w-8')} aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= 20} aria-label="Uno más">
        <Plus className="size-3.5" strokeWidth={1.5} />
      </button>
    </div>
  )
}

/** Ficha del arreglo: foto grande, precio, pestañas y "más para ver". */
export function ProductSheet() {
  const { viewing, view, add, qtyOf, setCartOpen } = useShop()
  const p = viewing ? byId(viewing) : undefined
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<Tab>('Descripción')
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQty(1)
    setTab('Descripción')
    scroller.current?.scrollTo({ top: 0 })
  }, [viewing])

  useEffect(() => {
    if (!viewing) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && view(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewing, view])

  const cat = p ? CATEGORIAS.find((c) => c.id === p.cat)! : null
  const mas = p ? PRODUCTOS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4) : []
  const enPedido = p ? qtyOf(p.id) : 0

  return (
    <AnimatePresence>
      {p && cat && (
        <motion.div key="sheet" className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-6" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.button
            type="button"
            aria-label="Cerrar"
            onClick={() => view(null)}
            className="absolute inset-0 cursor-default bg-ink/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={p.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[94svh] w-full max-w-6xl flex-col overflow-hidden rounded-t-[1.25rem] bg-cream shadow-[0_40px_100px_-30px_rgba(23,20,20,0.55)] md:max-h-[90svh] md:rounded-[1.25rem]"
          >
            <button
              type="button"
              onClick={() => view(null)}
              className="absolute top-3 right-3 z-20 grid size-11 cursor-pointer place-items-center rounded-full bg-cream/90 text-ink ring-1 ring-ink/10 transition hover:bg-ink hover:text-paper"
              aria-label="Cerrar ficha"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>

            <div ref={scroller} className="overflow-y-auto overscroll-contain px-4 pt-5 pb-8 md:px-10 md:pt-8 md:pb-10">
              <nav aria-label="Ruta" className="flex flex-wrap items-center gap-1.5 pr-12 text-[0.72rem] font-medium tracking-[0.18em] text-stone uppercase">
                <button type="button" onClick={() => view(null)} className="cursor-pointer uppercase hover:text-ink">
                  Arreglos
                </button>
                <ChevronRight className="size-3.5" strokeWidth={1.5} />
                <span>{cat.name}</span>
                <ChevronRight className="size-3.5" strokeWidth={1.5} />
                <span className="text-ink">{p.name}</span>
              </nav>

              <div className="mt-5 grid gap-7 md:mt-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-12">
                <div className="relative overflow-hidden rounded-[12px] bg-tile ring-1 ring-ink/[0.05]">
                  {p.badge && <Badge>{p.badge}</Badge>}
                  <motion.img
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    src={`p/${p.id}.webp`}
                    alt={p.name}
                    width={800}
                    height={1000}
                    className="aspect-[4/5] w-full object-contain max-md:max-h-[52svh]"
                  />
                </div>

                <div className="md:pt-3">
                  <p className="text-[0.75rem] font-medium tracking-[0.22em] text-stone uppercase">
                    {cat.name} <span className="mx-1.5 text-ink/25">·</span> Florería La Silla
                  </p>
                  <h3 className="mt-3 font-serif text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.08] text-ink">{p.name}</h3>

                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-4">
                    <p className="flex items-baseline gap-2">
                      <Price value={p.price} className={p.price === null ? 'text-[0.95rem]' : 'font-serif text-[1.7rem] leading-none text-rose'} />
                      {p.price !== null && <span className="text-[0.85rem] text-stone">+ envío</span>}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Stepper value={qty} onChange={setQty} />
                    <button
                      type="button"
                      onClick={() => {
                        add(p.id, qty)
                        view(null)
                      }}
                      className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-sm bg-ink px-7 text-[0.75rem] tracking-[0.14em] text-paper uppercase transition hover:bg-rose sm:flex-none"
                    >
                      Agregar al pedido
                      {p.price !== null && qty > 1 && <span className="text-paper/70">· {precio(p.price * qty)}</span>}
                    </button>
                  </div>
                  {enPedido > 0 && (
                    <button type="button" onClick={() => setCartOpen(true)} className="mt-3 cursor-pointer text-[0.85rem] text-rose underline decoration-rose/30 underline-offset-4">
                      Ya llevas {enPedido} en tu pedido · Ver pedido
                    </button>
                  )}
                  {p.price === null && (
                    <a href={waPedido(p.name)} target="_blank" rel="noopener noreferrer" className="mt-3 flex w-fit items-center gap-2 text-[0.88rem] text-ink-soft hover:text-rose">
                      <WhatsAppIcon className="size-4" /> Preguntar el precio por WhatsApp
                    </a>
                  )}

                  <div className="mt-9 border-b border-ink/10" role="tablist" aria-label="Información del arreglo">
                    <div className="flex gap-7">
                      {TABS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          role="tab"
                          aria-selected={tab === t}
                          onClick={() => setTab(t)}
                          className={cn('relative min-h-11 cursor-pointer pb-2 text-[0.75rem] font-medium tracking-[0.18em] uppercase transition-colors', tab === t ? 'text-ink' : 'text-stone/80 hover:text-ink')}
                        >
                          {t}
                          {tab === t && <motion.span layoutId="ficha-tab" className="absolute inset-x-0 -bottom-px h-[2px] bg-rose" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="min-h-[7.5rem] pt-5 text-[1rem] leading-relaxed text-ink-soft" role="tabpanel">
                    {tab === 'Descripción' && <p className="max-w-xl">{p.desc}</p>}
                    {tab === 'Envío' && (
                      <p className="max-w-xl">
                        Entregamos en todo Monterrey y su área metropolitana. Pide antes de las 12:00 de lunes a viernes y llega el mismo día; para sábado,
                        pide desde el viernes. El envío depende de la colonia y te lo confirmamos por WhatsApp. También puedes recogerlo en la tienda.
                      </p>
                    )}
                    {tab === 'Pago' && (
                      <p className="max-w-xl">
                        Transferencia, efectivo o tarjeta. Primero te confirmamos por WhatsApp el total con envío y la hora de entrega; después pagas.
                      </p>
                    )}
                  </div>

                  <ul className="mt-2 flex flex-wrap gap-2">
                    {CHIPS.map(({ icon: Icon, t }) => (
                      <li key={t} className="inline-flex items-center gap-2 rounded-sm bg-paper px-3 py-2 text-[0.85rem] text-ink-soft ring-1 ring-ink/10">
                        <Icon className="size-4 text-rose" strokeWidth={1.5} />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-[0.8rem] text-stone">* La flor está sujeta a disponibilidad de color y temporada.</p>
                </div>
              </div>

              {mas.length > 0 && (
                <div className="mt-12 border-t border-ink/10 pt-9">
                  <h4 className="font-serif text-[1.6rem] leading-none text-ink md:text-[1.9rem]">Más para ver</h4>
                  <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 md:grid-cols-4">
                    {mas.map((x) => (
                      <ProductCard key={x.id} p={x} size="sm" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
