import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { FloatingContact } from '@/components/FloatingContact'
import { Intro } from '@/components/Intro'
import { Nav } from '@/components/Nav'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { CartToast } from '@/components/shop/CartUI'
import { ProductSheet } from '@/components/shop/ProductSheet'
import { ShopProvider } from '@/lib/cart'
import { QuienesSomos } from '@/pages/QuienesSomos'
import { Arreglos } from '@/sections/Arreglos'
import { Contacto } from '@/sections/Contacto'
import { Cotizar } from '@/sections/Cotizar'
import { Eventos } from '@/sections/Eventos'
import { Footer } from '@/sections/Footer'
import { Funeraria } from '@/sections/Funeraria'
import { Hero } from '@/sections/Hero'
import { Ocasiones } from '@/sections/Ocasiones'

// Tres vistas: la portada (arreglos, funeraria y contacto), Eventos (eventos, cotizador y contacto)
// y Quiénes somos. #contacto existe en las dos primeras, así que no cambia de vista.
type Vista = 'portada' | 'eventos' | 'nosotros'

function vistaDe(hash: string, actual: Vista): Vista {
  if (hash === '#quienes-somos') return 'nosotros'
  if (hash === '#eventos' || hash === '#cotizar') return 'eventos'
  if (hash === '#contacto') {
    // con «atrás» se regresa a la vista donde estaba ese #contacto
    const guardada = (window.history.state as { vista?: Vista } | null)?.vista
    if (guardada === 'portada' || guardada === 'eventos') return guardada
    return actual === 'nosotros' ? 'portada' : actual
  }
  return 'portada'
}

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const on = () => setHash(window.location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return hash
}

export default function App() {
  const [ready, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])
  const hash = useHash()
  const [vista, setVista] = useState<Vista>(() => vistaDe(window.location.hash, 'portada'))
  if (vistaDe(hash, vista) !== vista) setVista(vistaDe(hash, vista))

  useEffect(() => {
    window.history.replaceState({ ...window.history.state, vista }, '')
  }, [vista, hash])

  // al cambiar de vista, el ancla todavía no existe cuando el navegador intenta bajar a ella
  useLayoutEffect(() => {
    const el = hash && hash !== '#quienes-somos' && hash !== '#eventos' ? document.querySelector(hash) : null
    if (el) el.scrollIntoView({ behavior: 'instant' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [vista]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ShopProvider>
      <Intro onDone={onDone} />
      <Nav solid={vista !== 'portada'} />
      {vista === 'nosotros' ? (
        <QuienesSomos />
      ) : vista === 'eventos' ? (
        <main className="bg-blush-50 pt-14 md:pt-16">
          <Eventos />
          <Cotizar />
          <Contacto />
        </main>
      ) : (
        <main>
          <Hero play={ready} />
          <Ocasiones />
          <Arreglos />
          <Funeraria />
          <Contacto />
        </main>
      )}
      <Footer />
      <FloatingContact visible={ready} />
      <CartToast />
      <ProductSheet />
      <CartDrawer />
    </ShopProvider>
  )
}
