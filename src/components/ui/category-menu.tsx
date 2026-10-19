import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Opcion<T extends string> {
  id: T
  name: string
}

interface Liga {
  href: string
  name: string
}

/**
 * Categorías en celular: un desplegable propio (no el <select> del sistema) en lugar de la tira con scroll de lado.
 * `ligas` van al final y llevan a otra sección en vez de cambiar la categoría.
 */
export function CategoryMenu<T extends string>({
  opciones,
  activa,
  onPick,
  ligas = [],
  className,
}: {
  opciones: Opcion<T>[]
  activa: T
  onPick: (id: T) => void
  ligas?: Liga[]
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const raiz = useRef<HTMLDivElement>(null)
  const lista = useRef<HTMLUListElement>(null)
  const id = useId()
  const actual = opciones.find((o) => o.id === activa)!

  // se cierra al tocar fuera o con Escape
  useEffect(() => {
    if (!open) return
    const fuera = (e: PointerEvent) => !raiz.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', fuera)
    document.addEventListener('keydown', esc)
    // al abrir, el foco va a la opción elegida
    lista.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus()
    return () => {
      document.removeEventListener('pointerdown', fuera)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const mover = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const items = [...(lista.current?.querySelectorAll<HTMLElement>('[data-item]') ?? [])]
    const i = items.indexOf(document.activeElement as HTMLElement)
    items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus()
  }

  const fila = 'flex min-h-13 w-full items-center gap-3 px-5 text-left transition-colors focus:bg-blush-50 active:bg-blush-50'
  // el contorno global de :focus-visible gana a las clases; aquí el foco se nota con el fondo
  const sinContorno = { outline: 'none' }

  return (
    <div ref={raiz} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-lista`}
        className={cn(
          'flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-md bg-tile px-5 text-left ring-1 transition-[box-shadow,background-color]',
          open ? 'ring-rose/60' : 'ring-ink/10',
        )}
      >
        <span className="sr-only">Categoría: </span>
        <span className="font-display text-[1.3rem] leading-none text-ink">{actual.name}</span>
        <ChevronDown className={cn('ml-auto size-5 shrink-0 text-ink/70 transition-transform duration-300', open && 'rotate-180')} strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={lista}
            id={`${id}-lista`}
            role="listbox"
            aria-label="Categorías"
            onKeyDown={mover}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full z-30 mt-2 origin-top overflow-hidden rounded-md bg-paper py-2 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.4)] ring-1 ring-ink/10"
          >
            {opciones.map((o) => {
              const sel = o.id === activa
              return (
                <li
                  key={o.id}
                  role="option"
                  aria-selected={sel}
                  tabIndex={-1}
                  data-item
                  onClick={() => {
                    onPick(o.id)
                    setOpen(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return
                    e.preventDefault()
                    onPick(o.id)
                    setOpen(false)
                  }}
                  className={cn(fila, 'cursor-pointer')}
                  style={sinContorno}
                >
                  <span className={cn('font-display text-[1.15rem] leading-tight', sel ? 'text-rose' : 'text-ink')}>{o.name}</span>
                  <Check className={cn('ml-auto size-4 shrink-0 text-rose', !sel && 'invisible')} strokeWidth={2} />
                </li>
              )
            })}
            {ligas.length > 0 && <li role="none" className="mx-5 my-1.5 h-px bg-ink/10" />}
            {ligas.map((l) => (
              <li key={l.href} role="none">
                <a href={l.href} data-item onClick={() => setOpen(false)} className={fila} style={sinContorno}>
                  <span className="font-display text-[1.15rem] leading-tight text-ink">{l.name}</span>
                  <ChevronRight className="ml-auto size-4 shrink-0 text-stone" strokeWidth={1.5} />
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
