import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { byId, type Producto } from '@/lib/catalogo'

export interface Linea {
  product: Producto
  qty: number
}

interface Shop {
  lines: Linea[]
  count: number
  /** Suma de lo que tiene precio. */
  subtotal: number
  /** Hay arreglos con precio por confirmar. */
  porConfirmar: boolean
  qtyOf: (id: string) => number
  add: (id: string, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  /** Ficha del arreglo abierta. */
  viewing: string | null
  view: (id: string | null) => void
  /** Último agregado, para el aviso. */
  toast: { id: string; n: number } | null
}

const Ctx = createContext<Shop | null>(null)
const KEY = 'lasilla-pedido-v2'

function load(): Record<string, number> {
  try {
    const raw = localStorage.getItem(KEY)
    const data = raw ? (JSON.parse(raw) as Record<string, number>) : {}
    return Object.fromEntries(Object.entries(data).filter(([id, q]) => byId(id) && q > 0))
  } catch {
    return {}
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, number>>(load)
  const [cartOpen, setCartOpen] = useState(false)
  const [viewing, setViewing] = useState<string | null>(null)
  const [toast, setToast] = useState<Shop['toast']>(null)
  const toastTimer = useRef<number>(0)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* modo privado: el pedido vive solo en esta visita */
    }
  }, [items])

  const add = useCallback((id: string, qty = 1) => {
    setItems((s) => ({ ...s, [id]: Math.min(20, (s[id] ?? 0) + qty) }))
    setToast((t) => ({ id, n: (t?.n ?? 0) + 1 }))
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3600)
  }, [])

  const setQty = useCallback((id: string, qty: number) => {
    setItems((s) => {
      const next = { ...s }
      if (qty <= 0) delete next[id]
      else next[id] = Math.min(20, qty)
      return next
    })
  }, [])

  const remove = useCallback((id: string) => setQty(id, 0), [setQty])
  const clear = useCallback(() => setItems({}), [])

  const openCart = useCallback((v: boolean) => {
    if (v) {
      setViewing(null)
      setToast(null)
    }
    setCartOpen(v)
  }, [])

  const view = useCallback((id: string | null) => {
    if (id) setToast(null)
    setViewing(id)
  }, [])

  // la página no se mueve detrás. Va en <html>: si va en <body>, body se vuelve el contenedor
  // de scroll y la barra lateral (sticky) brinca.
  useEffect(() => {
    document.documentElement.classList.toggle('is-modal', cartOpen || viewing !== null)
  }, [cartOpen, viewing])

  const value = useMemo<Shop>(() => {
    const lines = Object.entries(items).flatMap(([id, qty]) => {
      const product = byId(id)
      return product ? [{ product, qty }] : []
    })
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + (l.product.price ?? 0) * l.qty, 0),
      porConfirmar: lines.some((l) => l.product.price === null),
      qtyOf: (id) => items[id] ?? 0,
      add,
      setQty,
      remove,
      clear,
      cartOpen,
      setCartOpen: openCart,
      viewing,
      view,
      toast,
    }
  }, [items, add, setQty, remove, clear, cartOpen, openCart, viewing, view, toast])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useShop() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useShop fuera de ShopProvider')
  return s
}
