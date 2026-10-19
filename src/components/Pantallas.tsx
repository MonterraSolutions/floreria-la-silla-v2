import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// PROPUESTA B: puntos a la derecha con las pantallas de la vista; marcan en cuál vas y llevan a otra.
// Solo en compu, igual que el salto entre pantallas (ver .pantalla en index.css).
export function Pantallas() {
  const [items, setItems] = useState<HTMLElement[]>([])
  const [activa, setActiva] = useState(0)

  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('main > [data-nombre]')]
    setItems(els)
    // la activa es la que cruza la línea de en medio de la pantalla
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiva(els.indexOf(e.target as HTMLElement))),
      { rootMargin: '-50% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))

    // Un giro de rueda o un deslizamiento del trackpad = una pantalla, en esa dirección. Sin esto, un
    // deslizamiento corto regresa a la misma pantalla (el navegador ajusta a la más cercana).
    // Si la sección no cabe (Eventos), primero se baja dentro de ella y al llegar a su orilla salta.
    const grande = window.matchMedia('(min-width: 1024px) and (min-height: 640px)')
    let bloqueado = false
    let desde = 0
    let quieto = 0
    const soltar = () => {
      window.clearTimeout(quieto)
      // la inercia del trackpad sigue mandando eventos: se suelta cuando paran y ya terminó el salto
      quieto = window.setTimeout(() => (bloqueado = false), Math.max(220, 750 - (Date.now() - desde)))
    }
    const onWheel = (e: WheelEvent) => {
      if (!grande.matches || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
      // con la intro, el menú, el carrito o la ficha abiertos, la rueda es de ellos
      if (document.body.classList.contains('is-locked') || document.documentElement.classList.contains('is-modal')) return
      if (bloqueado) {
        e.preventDefault()
        soltar()
        return
      }
      if (Math.abs(e.deltaY) < 4) return
      const y = window.scrollY
      const vh = window.innerHeight
      const max = document.documentElement.scrollHeight - vh
      // dónde queda cada pantalla al llegar a ella (la última no puede subir más allá del final de la página)
      const pos = els.map((el) => Math.min(el.offsetTop, max))
      const i = pos.findLastIndex((p) => p <= y + 2)
      const actual = els[i]
      if (!actual) return
      const abajo = e.deltaY > 0
      // dentro de una sección más alta que la pantalla: scroll normal; si el giro se pasaría de su orilla, se para en ella
      const paso = Math.abs(e.deltaY)
      const orillaAbajo = Math.min(actual.offsetTop + actual.offsetHeight - vh, max)
      if (abajo && orillaAbajo - y > paso) return
      if (!abajo && y - pos[i] > paso) return
      const destino = abajo
        ? orillaAbajo - y > 2
          ? orillaAbajo
          : i + 1 < els.length
            ? pos[i + 1]
            : max
        : y > pos[i] + 2
          ? pos[i]
          : i > 0
            ? // al subir a una sección alta se llega a su final, para recorrerla hacia arriba
              Math.max(pos[i - 1], Math.min(els[i - 1].offsetTop + els[i - 1].offsetHeight - vh, max))
            : undefined
      e.preventDefault()
      if (destino === undefined || Math.abs(destino - y) < 2) return
      bloqueado = true
      desde = Date.now()
      window.scrollTo({ top: destino, behavior: 'smooth' })
      soltar()
    }
    window.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      io.disconnect()
      window.removeEventListener('wheel', onWheel)
      window.clearTimeout(quieto)
    }
  }, [])

  if (items.length < 2) return null

  return (
    <nav aria-label="Pantallas" className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 [@media(min-width:1024px)_and_(min-height:640px)]:block">
      <ul className="flex flex-col items-end gap-1">
        {items.map((el, i) => (
          <li key={el.dataset.nombre}>
            <button
              type="button"
              onClick={() => el.scrollIntoView({ behavior: 'smooth' })}
              aria-label={el.dataset.nombre}
              aria-current={i === activa ? 'true' : undefined}
              className="group flex min-h-7 cursor-pointer items-center gap-3 text-snow"
            >
              <span className="text-[0.68rem] tracking-[0.18em] uppercase opacity-0 transition-opacity group-hover:opacity-80">{el.dataset.nombre}</span>
              <span className={cn('block rounded-full bg-snow transition-all duration-300', i === activa ? 'h-6 w-1.5' : 'size-1.5 opacity-40 group-hover:opacity-80')} />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
