import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { byId, precio } from '@/lib/catalogo'
import { useShop } from '@/lib/cart'
import { cn } from '@/lib/utils'

/** Bolsa del menú con el número de arreglos. */
export function CartButton({ className }: { className?: string }) {
  const { count, setCartOpen } = useShop()
  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      className={cn('relative grid size-11 cursor-pointer place-items-center rounded-full ring-1 ring-ink/15 transition hover:bg-ink hover:text-paper', className)}
      aria-label={count ? `Ver tu pedido, ${count} ${count === 1 ? 'arreglo' : 'arreglos'}` : 'Ver tu pedido'}
    >
      <ShoppingBag className="size-[1.15rem]" strokeWidth={1.5} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose px-1 text-[0.68rem] font-medium text-paper tabular-nums"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

/** Aviso al agregar un arreglo. */
export function CartToast() {
  const { toast, setCartOpen, count } = useShop()
  const p = toast ? byId(toast.id) : undefined
  return (
    <div className="pointer-events-none fixed inset-x-4 top-20 z-[70] flex justify-end md:top-24 md:right-8 md:left-auto" aria-live="polite">
      <AnimatePresence>
        {p && (
          <motion.div
            key={toast!.n}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex w-full items-center gap-3 rounded-md bg-paper p-2.5 pr-3 shadow-[0_24px_50px_-20px_rgba(23,20,20,0.45)] ring-1 ring-ink/10 sm:w-[22rem]"
          >
            <span className="w-12 shrink-0 overflow-hidden rounded-[6px] bg-tile">
              <img src={`p/${p.id}-sm.webp`} alt="" className="aspect-[4/5] w-full object-contain" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.75rem] text-stone">Agregado a tu pedido</span>
              <span className="block truncate font-serif text-[0.98rem] leading-snug text-ink">{p.name}</span>
            </span>
            <button type="button" onClick={() => setCartOpen(true)} className="inline-flex min-h-10 shrink-0 cursor-pointer items-center rounded-sm bg-ink px-3.5 text-[0.68rem] tracking-[0.12em] text-paper uppercase transition hover:bg-rose">
              Ver pedido ({count})
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Pastilla fija abajo a la izquierda mientras hay algo en el pedido. */
export function CartPill({ visible }: { visible: boolean }) {
  const { count, subtotal, setCartOpen, cartOpen, viewing } = useShop()
  const show = visible && count > 0 && !cartOpen && !viewing
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={() => setCartOpen(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 z-40 inline-flex min-h-14 cursor-pointer items-center gap-3 rounded-full bg-ink py-2 pr-5 pl-2 text-paper shadow-[0_12px_30px_-8px_rgba(23,20,20,0.5)] ring-2 ring-paper/70 transition hover:bg-rose-deep md:bottom-6 md:left-6"
          aria-label={`Ver tu pedido: ${count} ${count === 1 ? 'arreglo' : 'arreglos'}`}
        >
          <span className="relative grid size-10 place-items-center rounded-full bg-paper/10">
            <ShoppingBag className="size-[1.1rem]" strokeWidth={1.5} />
            <span className="absolute -top-0.5 -right-0.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-rose px-1 text-[0.64rem] font-medium tabular-nums">{count}</span>
          </span>
          <span className="text-left leading-tight">
            <span className="block text-[0.72rem] text-paper/60">Tu pedido</span>
            <span className="block font-serif text-[0.98rem]">{subtotal ? precio(subtotal) : 'Por cotizar'}</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
