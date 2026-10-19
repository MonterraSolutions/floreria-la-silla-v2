import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ShoppingCart, Store, Trash2, Truck, X } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons'
import { Price } from '@/components/shop/ProductCard'
import { Stepper } from '@/components/shop/ProductSheet'
import { TarjetaCampos } from '@/components/shop/TarjetaCampos'
import { MUNICIPIOS, esFuneraria, foto, precio } from '@/lib/catalogo'
import { useShop, type Linea } from '@/lib/cart'
import { SITE, wa } from '@/lib/site'
import { textoTarjeta, type Tarjeta } from '@/lib/tarjeta'
import { cn } from '@/lib/utils'

interface Entrega {
  modo: 'domicilio' | 'tienda'
  fecha: string
  municipio: string
  recibe: string
  nombre: string
}

const EMPTY: Entrega = { modo: 'domicilio', fecha: '', municipio: 'Monterrey', recibe: '', nombre: '' }
const KEY = 'lasilla-entrega-v2'

function hoy() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** "2026-10-12" → "lunes 12 de octubre" */
function fechaLarga(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, d))
}

export function mensajePedido(lines: Linea[], tarjetas: Record<string, Tarjeta[]>, listones: Record<string, string[]>, sala: string, subtotal: number, porConfirmar: boolean, e: Entrega) {
  const out = ['Hola, quiero hacer este pedido en Florería La Silla:', '']
  for (const { product: p, qty } of lines) {
    out.push(`• ${qty} × ${p.name} — ${p.price === null ? 'precio por confirmar' : precio(p.price * qty)}`)
    for (let i = 0; i < qty; i++) {
      if (esFuneraria(p)) {
        const l = listones[p.id]?.[i]?.trim()
        out.push(`   ${qty > 1 ? `Listón ${i + 1}` : 'Listón'}: ${l ? `"${l}"` : 'texto por definir'}`)
        continue
      }
      const t = textoTarjeta(tarjetas[p.id]?.[i])
      if (t) out.push(`   ${qty > 1 ? `Tarjeta ${i + 1}` : 'Tarjeta'}: ${t}`)
    }
  }
  out.push('')
  if (subtotal) out.push(`Subtotal: ${precio(subtotal)} + envío${porConfirmar ? ' (más lo que está por confirmar)' : ''}`)
  const cuando = e.fecha ? fechaLarga(e.fecha) : 'fecha por definir'
  out.push(e.modo === 'tienda' ? `Recojo en tienda: ${cuando}` : `Entrega a domicilio en ${e.municipio}: ${cuando}`)
  if (lines.some((l) => esFuneraria(l.product))) out.push(`Funeraria y sala (condolencias): ${sala.trim() || 'por definir'}`)
  if (e.recibe.trim()) out.push(`Recibe: ${e.recibe.trim()}`)
  if (e.nombre.trim()) out.push(`Mi nombre: ${e.nombre.trim()}`)
  out.push('', '¿Me confirman disponibilidad y el costo de envío?')
  return out.join('\n')
}

const field =
  'min-h-12 w-full rounded-sm bg-paper px-4 text-[1rem] text-ink ring-1 ring-ink/12 outline-none placeholder:text-stone/60 focus:ring-2 focus:ring-rose'
const label = 'mb-1.5 block text-[0.78rem] font-medium tracking-[0.08em] text-stone uppercase'

export function CartDrawer() {
  const { lines, count, subtotal, porConfirmar, setQty, remove, clear, cartOpen, setCartOpen, view, nombre, setNombre, tarjetas, setTarjeta, listones, setListon, sala, setSala } = useShop()
  const [e, setE] = useState<Entrega>(() => {
    try {
      return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }
    } catch {
      return EMPTY
    }
  })
  const [sent, setSent] = useState(false)
  const id = useId()

  // Si ya escribió su nombre en el cotizador, aparece aquí; si lo borra o lo cambia, se respeta.
  useEffect(() => {
    if (nombre) setE((s) => (s.nombre ? s : { ...s, nombre }))
  }, [nombre])

  // «¿De parte de quién?» de la primera tarjeta llena «Tu nombre» ("Con cariño, Ana" → "Ana").
  // Lo sigue mientras el campo esté vacío o tenga lo que puso esta misma copia; si el cliente lo cambia, ya no se toca.
  const firma = lines.flatMap(({ product: p }) => tarjetas[p.id] ?? []).find((t) => t && t.tipo !== 'anonima' && t.firma.trim())?.firma ?? ''
  const deFirma = firma.split(',').pop()!.trim()
  const [copiado, setCopiado] = useState('')
  useEffect(() => {
    if (!deFirma) return
    setE((s) => (!s.nombre.trim() || s.nombre === copiado ? { ...s, nombre: deFirma } : s))
    setCopiado(deFirma)
  }, [deFirma]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...e, fecha: e.fecha && e.fecha >= hoy() ? e.fecha : '' }))
    } catch {
      /* sin almacenamiento */
    }
  }, [e])

  useEffect(() => {
    if (!cartOpen) {
      setSent(false)
      return
    }
    const onKey = (ev: KeyboardEvent) => ev.key === 'Escape' && setCartOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cartOpen, setCartOpen])

  const set = <K extends keyof Entrega>(k: K, v: Entrega[K]) => setE((s) => ({ ...s, [k]: v }))
  const href = wa(mensajePedido(lines, tarjetas, listones, sala, subtotal, porConfirmar, e))
  const hayFuneraria = lines.some((l) => esFuneraria(l.product))

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div key="cart" className="fixed inset-0 z-[60] flex justify-end" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.button
            type="button"
            aria-label="Cerrar pedido"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 cursor-default bg-night/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Tu pedido"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full w-full max-w-[28rem] flex-col bg-cream shadow-[-30px_0_80px_-40px_rgba(23,20,20,0.5)]"
          >
            <header className="flex items-center justify-between border-b border-ink/10 px-5 py-4 md:px-7">
              <div>
                <p className="text-[0.72rem] font-medium tracking-[0.22em] text-stone uppercase">Florería La Silla</p>
                <h2 className="font-serif text-[1.7rem] leading-none text-ink">
                  Tu pedido {count > 0 && <span className="text-[1.05rem] text-stone">({count})</span>}
                </h2>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} className="grid size-11 cursor-pointer place-items-center rounded-full ring-1 ring-ink/15 transition hover:bg-ink hover:text-paper" aria-label="Cerrar">
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-tile">
                  <ShoppingCart className="size-7 text-rose" strokeWidth={1.25} />
                </span>
                <p className="mt-5 font-serif text-[1.45rem] leading-tight text-ink">Todavía no hay flores aquí</p>
                <p className="mt-2 max-w-xs text-[0.95rem] text-stone">Agrega uno o varios arreglos y al final nos mandas el pedido completo por WhatsApp.</p>
                <a
                  href="#arreglos"
                  onClick={() => setCartOpen(false)}
                  className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-sm bg-ink px-7 text-[0.75rem] tracking-[0.14em] text-paper uppercase transition hover:bg-rose"
                >
                  Ver arreglos <ArrowRight className="size-4" />
                </a>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto overscroll-contain px-5 md:px-7">
                  <ul className="divide-y divide-ink/10">
                    {lines.map(({ product: p, qty }) => (
                      <li key={p.id} className="flex gap-4 py-4">
                        {esFuneraria(p) ? (
                          // funeraria no tiene ficha: solo la foto
                          <span className="w-[4.5rem] shrink-0 self-start overflow-hidden rounded-[8px] bg-tile ring-1 ring-ink/[0.05]">
                            <img src={foto(p, true)} alt="" className="aspect-[4/5] w-full object-cover" />
                          </span>
                        ) : (
                          <button type="button" onClick={() => view(p.id)} className="w-[4.5rem] shrink-0 cursor-pointer self-start overflow-hidden rounded-[8px] bg-tile ring-1 ring-ink/[0.05]" aria-label={`Ver ${p.name}`}>
                            <img src={foto(p, true)} alt="" className="aspect-[4/5] w-full object-contain" />
                          </button>
                        )}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-serif text-[1rem] leading-snug text-ink">{p.name}</p>
                            <Price value={p.price === null ? null : p.price * qty} className="font-serif text-[1rem] leading-snug text-rose" />
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <Stepper small value={qty} onChange={(n) => setQty(p.id, n)} />
                            <button type="button" onClick={() => remove(p.id)} className="grid size-9 cursor-pointer place-items-center rounded-full text-stone transition hover:bg-ink/[0.06] hover:text-rose" aria-label={`Quitar ${p.name}`}>
                              <Trash2 className="size-4" strokeWidth={1.5} />
                            </button>
                          </div>
                          <div className="mt-2.5 flex flex-col gap-4">
                            {Array.from({ length: qty }, (_, i) =>
                              esFuneraria(p) ? (
                                <div key={i}>
                                  <label htmlFor={`${id}-l-${p.id}-${i}`} className="mb-1 block text-[0.88rem] text-ink">
                                    {qty > 1 ? `Texto del listón ${i + 1} de ${qty}` : 'Texto del listón'}
                                  </label>
                                  <input
                                    id={`${id}-l-${p.id}-${i}`}
                                    value={listones[p.id]?.[i] ?? ''}
                                    maxLength={60}
                                    onChange={(ev) => setListon(p.id, i, ev.target.value)}
                                    placeholder="Ej. Con cariño, familia García Treviño"
                                    className="min-h-11 w-full rounded-sm bg-paper px-3 text-[0.95rem] text-ink ring-1 ring-ink/15 outline-none placeholder:text-stone/60 focus:ring-2 focus:ring-ink/40"
                                  />
                                </div>
                              ) : (
                              <TarjetaCampos
                                key={i}
                                compact
                                numero={qty > 1 ? `Tarjeta ${i + 1} de ${qty}` : undefined}
                                value={tarjetas[p.id]?.[i]}
                                onChange={(t) => setTarjeta(p.id, i, t)}
                              />
                              ),
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* datos de entrega */}
                  <div className="border-t border-ink/10 py-6">
                    <p className="font-serif text-[1.3rem] leading-none text-ink">Entrega</p>
                    <div className="mt-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Cómo lo recibes">
                      {(
                        [
                          ['domicilio', 'A domicilio', Truck],
                          ['tienda', 'Recojo en tienda', Store],
                        ] as const
                      ).map(([v, t, Icon]) => (
                        <button
                          key={v}
                          type="button"
                          role="radio"
                          aria-checked={e.modo === v}
                          onClick={() => set('modo', v)}
                          className={cn(
                            'flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-sm text-[0.9rem] ring-1 transition',
                            e.modo === v ? 'bg-ink text-paper ring-ink' : 'bg-paper text-ink-soft ring-ink/12 hover:ring-ink/30',
                          )}
                        >
                          <Icon className="size-4" strokeWidth={1.5} />
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className={e.modo === 'tienda' ? 'col-span-2' : ''}>
                        <label htmlFor={`${id}-f`} className={label}>
                          Fecha
                        </label>
                        <input id={`${id}-f`} type="date" min={hoy()} value={e.fecha} onChange={(ev) => set('fecha', ev.target.value)} className={cn(field, 'appearance-none')} />
                      </div>
                      {e.modo === 'domicilio' && (
                        <div>
                          <label htmlFor={`${id}-m`} className={label}>
                            Municipio
                          </label>
                          <select id={`${id}-m`} value={e.municipio} onChange={(ev) => set('municipio', ev.target.value)} className={field}>
                            {MUNICIPIOS.map((m) => (
                              <option key={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      {hayFuneraria && (
                        <div className="col-span-2">
                          <label htmlFor={`${id}-sala`} className={label}>
                            Funeraria y sala (condolencias)
                          </label>
                          <input id={`${id}-sala`} value={sala} onChange={(ev) => setSala(ev.target.value)} placeholder="Ej. Funerales Hernández, sala 3" className={field} />
                        </div>
                      )}
                      <div className="col-span-2">
                        <label htmlFor={`${id}-r`} className={label}>
                          ¿Quién lo recibe?
                        </label>
                        <input id={`${id}-r`} value={e.recibe} onChange={(ev) => set('recibe', ev.target.value)} placeholder="Nombre de quien recibe" autoComplete="off" className={field} />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor={`${id}-n`} className={label}>
                          Tu nombre
                        </label>
                        <input id={`${id}-n`} value={e.nombre} onChange={(ev) => set('nombre', ev.target.value)} onBlur={(ev) => setNombre(ev.target.value)} placeholder="Para saber quién pide" autoComplete="name" className={field} />
                      </div>
                    </div>

                    <button type="button" onClick={clear} className="mt-5 cursor-pointer text-[0.82rem] text-stone underline decoration-ink/20 underline-offset-4 hover:text-rose">
                      Vaciar pedido
                    </button>
                  </div>
                </div>

                <footer className="border-t border-ink/10 bg-cream px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-7">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[0.95rem] text-ink-soft">Subtotal</span>
                    <span className="font-serif text-[1.5rem] leading-none text-ink">{subtotal ? precio(subtotal) : '—'}</span>
                  </div>
                  <p className="mt-1 text-right text-[0.8rem] text-stone">
                    + envío según tu colonia{porConfirmar && ' · hay arreglos por cotizar'}
                  </p>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSent(true)}
                    className="mt-4 flex min-h-13 w-full items-center justify-center gap-2.5 rounded-sm bg-[#1FAF54] px-6 text-[0.78rem] tracking-[0.14em] text-white uppercase shadow-[0_14px_30px_-14px_rgba(31,175,84,0.8)] transition hover:bg-[#189446]"
                  >
                    <WhatsAppIcon className="size-5" />
                    Enviar pedido por WhatsApp
                  </a>
                  <p className="mt-2.5 text-center text-[0.78rem] text-stone">
                    {sent ? 'Listo. Si no se abrió WhatsApp, escríbenos al ' : 'Te confirmamos disponibilidad y envío al '}
                    <span className="text-ink">{SITE.whatsapp}</span>
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
