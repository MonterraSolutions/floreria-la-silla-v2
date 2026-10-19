import { Minus, Plus } from 'lucide-react'
import { precio, type Producto } from '@/lib/catalogo'
import { useShop } from '@/lib/cart'
import { cn } from '@/lib/utils'

export function Price({ value, className }: { value: number | null; className?: string }) {
  // sin precio: en la misma letra que un precio, pero en gris
  if (value === null) return <span className={cn('whitespace-nowrap', className, 'text-stone')}>A cotizar</span>
  return <span className={cn('whitespace-nowrap', className)}>{precio(value)}</span>
}

/** Recuadro del arreglo: foto, y abajo el nombre con el precio a la derecha (en celular, el precio debajo del nombre). */
export function ProductCard({ p, size = 'md' }: { p: Producto; size?: 'md' | 'sm' }) {
  const { add, setQty, qtyOf, view } = useShop()
  const qty = qtyOf(p.id)

  return (
    <article className="group">
      <div className="relative">
        <button
          type="button"
          onClick={() => view(p.id)}
          className="relative block w-full cursor-pointer overflow-hidden rounded-[10px] bg-tile ring-1 ring-ink/[0.05] transition-colors duration-500 group-hover:bg-tile-deep"
          aria-label={`Ver ${p.name}`}
        >
          <img
            src={`p/${p.id}-sm.webp`}
            alt={p.name}
            loading="lazy"
            width={480}
            height={600}
            className="aspect-[4/5] w-full object-contain transition-transform duration-[1.1s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.045]"
          />
        </button>

        {qty ? (
          // ya está en el pedido: menos / cantidad / más
          <div className="absolute right-2 bottom-2 z-10 inline-flex h-11 items-center rounded-full bg-rose-deep text-paper shadow-[0_8px_20px_-10px_rgba(23,20,20,0.5)]">
            <button type="button" onClick={() => setQty(p.id, qty - 1)} className="grid size-11 cursor-pointer place-items-center rounded-full transition hover:bg-paper/15" aria-label={qty === 1 ? `Quitar ${p.name} del pedido` : `Uno menos de ${p.name}`}>
              <Minus className="size-4" strokeWidth={1.75} />
            </button>
            <span className="min-w-5 text-center text-[0.95rem] tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button type="button" onClick={() => add(p.id)} disabled={qty >= 20} className="grid size-11 cursor-pointer place-items-center rounded-full transition hover:bg-paper/15 disabled:opacity-40" aria-label={`Uno más de ${p.name}`}>
              <Plus className="size-4" strokeWidth={1.75} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => add(p.id)}
            className="absolute right-2.5 bottom-2.5 z-10 inline-flex h-10 w-10 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-cream text-[0.82rem] text-ink shadow-[0_8px_20px_-10px_rgba(23,20,20,0.5)] ring-1 ring-ink/10 transition-all duration-300 hover:bg-ink hover:text-paper md:w-auto md:translate-y-2 md:px-4 md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100"
            aria-label={`Agregar ${p.name} al pedido`}
          >
            <Plus className="size-4" strokeWidth={1.5} />
            <span className="max-md:sr-only">Agregar</span>
          </button>
        )}
      </div>

      <button type="button" onClick={() => view(p.id)} className="mt-3 flex w-full cursor-pointer flex-col gap-1 px-0.5 text-left sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <h4 className={cn('min-w-0 font-serif leading-[1.1] text-ink', size === 'md' ? 'text-[0.98rem] md:text-[1.08rem]' : 'text-[0.92rem]')}>{p.name}</h4>
        <Price value={p.price} className={cn('shrink-0 font-serif text-ink', size === 'md' ? 'text-[0.98rem] md:text-[1.08rem]' : 'text-[0.92rem]')} />
      </button>
    </article>
  )
}
