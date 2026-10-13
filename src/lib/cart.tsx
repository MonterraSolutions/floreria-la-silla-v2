import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { byId, type Producto } from '@/lib/catalogo'
import { TARJETA_VACIA, normalizar, tieneAlgo, type Tarjeta } from '@/lib/tarjeta'

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
  /** Último nombre que escribió el cliente (cotizador o pedido), para no pedírselo dos veces. */
  nombre: string
  setNombre: (v: string) => void
  /** Tarjetas de cada arreglo, una por pieza: si llevas 2, son 2 tarjetas. */
  tarjetas: Record<string, Tarjeta[]>
  setTarjeta: (id: string, i: number, t: Tarjeta) => void
  /** Texto del listón de cada pieza de funeraria (una por pieza, como las tarjetas). */
  listones: Record<string, string[]>
  setListon: (id: string, i: number, texto: string) => void
  /** Funeraria y sala a donde va lo de condolencias. */
  sala: string
  setSala: (v: string) => void
}

const Ctx = createContext<Shop | null>(null)
const KEY = 'lasilla-pedido-v2'
const KEY_TARJETAS = 'lasilla-tarjetas-v2'
const KEY_LISTONES = 'lasilla-listones-v2'

function load(): Record<string, number> {
  try {
    const raw = localStorage.getItem(KEY)
    const data = raw ? (JSON.parse(raw) as Record<string, number>) : {}
    return Object.fromEntries(Object.entries(data).filter(([id, q]) => byId(id) && q > 0))
  } catch {
    return {}
  }
}

function loadTarjetas(): Record<string, Tarjeta[]> {
  try {
    const data = JSON.parse(localStorage.getItem(KEY_TARJETAS) ?? '{}') as Record<string, unknown>
    return Object.fromEntries(Object.entries(data).map(([id, t]) => [id, normalizar(t)]))
  } catch {
    return {}
  }
}

function loadListones(): { listones: Record<string, string[]>; sala: string } {
  try {
    const d = JSON.parse(localStorage.getItem(KEY_LISTONES) ?? '{}') as { listones?: Record<string, string[]>; sala?: string }
    return { listones: d.listones ?? {}, sala: d.sala ?? '' }
  } catch {
    return { listones: {}, sala: '' }
  }
}

function loadNombre(): string {
  try {
    return (JSON.parse(localStorage.getItem('lasilla-entrega-v2') ?? '{}') as { nombre?: string }).nombre ?? ''
  } catch {
    return ''
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, number>>(load)
  const [cartOpen, setCartOpen] = useState(false)
  const [viewing, setViewing] = useState<string | null>(null)
  const [toast, setToast] = useState<Shop['toast']>(null)
  const [nombre, setNombreRaw] = useState(loadNombre)
  const [tarjetas, setTarjetas] = useState<Record<string, Tarjeta[]>>(loadTarjetas)
  const setTarjeta = useCallback(
    (id: string, i: number, t: Tarjeta) =>
      setTarjetas((s) => {
        const lista = [...(s[id] ?? [])]
        lista[i] = t
        return { ...s, [id]: Array.from(lista, (x) => x ?? TARJETA_VACIA) }
      }),
    [],
  )
  // Un campo vacío no borra el nombre compartido: así el otro formulario conserva el suyo.
  const setNombre = useCallback((v: string) => v.trim() && setNombreRaw(v.trim()), [])
  const [listones, setListones] = useState(() => loadListones().listones)
  const [sala, setSala] = useState(() => loadListones().sala)
  const setListon = useCallback(
    (id: string, i: number, texto: string) =>
      setListones((s) => {
        const lista = [...(s[id] ?? [])]
        lista[i] = texto
        return { ...s, [id]: Array.from(lista, (x) => x ?? '') }
      }),
    [],
  )
  const toastTimer = useRef<number>(0)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* modo privado: el pedido vive solo en esta visita */
    }
  }, [items])

  // solo se guardan las tarjetas de lo que sigue en el pedido
  useEffect(() => {
    try {
      const vivas = Object.fromEntries(
        Object.entries(tarjetas)
          .filter(([id, l]) => items[id] && l.some(tieneAlgo))
          .map(([id, l]) => [id, l.slice(0, items[id])]),
      )
      localStorage.setItem(KEY_TARJETAS, JSON.stringify(vivas))
    } catch {
      /* modo privado */
    }
  }, [tarjetas, items])

  useEffect(() => {
    try {
      const vivos = Object.fromEntries(Object.entries(listones).filter(([id, l]) => items[id] && l.some((t) => t.trim())).map(([id, l]) => [id, l.slice(0, items[id])]))
      localStorage.setItem(KEY_LISTONES, JSON.stringify({ listones: vivos, sala }))
    } catch {
      /* modo privado */
    }
  }, [listones, sala, items])

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
  const clear = useCallback(() => {
    setItems({})
    setTarjetas({})
    setListones({})
  }, [])

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
      nombre,
      setNombre,
      tarjetas,
      setTarjeta,
      listones,
      setListon,
      sala,
      setSala,
    }
  }, [items, add, setQty, remove, clear, cartOpen, openCart, viewing, view, toast, nombre, setNombre, tarjetas, setTarjeta, listones, setListon, sala])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useShop() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useShop fuera de ShopProvider')
  return s
}
