import { useStoreStatus } from '@/hooks/use-store-status'
import { cn } from '@/lib/utils'

/** Si la tienda está abierta, dicho como lo diría alguien de la tienda: sin pastilla ni puntito. */
export function StatusPill({ className, withDelivery = false }: { className?: string; withDelivery?: boolean }) {
  const s = useStoreStatus()
  return (
    <span className={cn('inline-flex flex-col gap-1 text-[0.9rem] text-ink', className)}>
      <span>{s.label}</span>
      {withDelivery && <span className="text-stone">{s.delivery}</span>}
    </span>
  )
}
