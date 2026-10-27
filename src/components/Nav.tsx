import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Menu, X } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons'
import { CartButton } from '@/components/shop/CartUI'
import { SocialTooltip } from '@/components/ui/social-media'
import { SOCIALS } from '@/lib/socials'
import { SITE, wa } from '@/lib/site'
import { cn } from '@/lib/utils'

type Link = { href: string; label: string; children?: { href: string; label: string }[] }

const LINKS: Link[] = [
  {
    href: '#arreglos',
    label: 'Arreglos',
    children: [
      { href: '#arreglos', label: 'Arreglos ocasionales' },
      { href: '#funeraria', label: 'Arreglos de condolencias' },
    ],
  },
  { href: '#eventos', label: 'Eventos' },
  { href: '#cotizar', label: 'Cotizar' },
  { href: '#quienes-somos', label: 'Quiénes somos' },
  { href: '#contacto', label: 'Contacto' },
]

// En celular, todo al mismo nivel: renglones parejos en lugar de títulos grandes con subtemas.
const MENU_CELULAR = [
  { href: '#arreglos', label: 'Arreglos ocasionales' },
  { href: '#funeraria', label: 'Condolencias' },
  { href: '#eventos', label: 'Eventos' },
  { href: '#cotizar', label: 'Cotizar evento' },
  { href: '#quienes-somos', label: 'Quiénes somos' },
  { href: '#contacto', label: 'Contacto' },
]

/** solid: menú claro desde arriba (páginas sin foto de portada). */
export function Nav({ solid = false }: { solid?: boolean }) {
  const [bajo, setScrolled] = useState(false)
  const scrolled = solid || bajo
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('is-locked', open)
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-500',
        scrolled ? 'bg-paper/95 py-2.5 text-ink shadow-[0_1px_0_rgba(23,20,20,0.06)]' : 'py-4 text-paper md:py-5',
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 md:px-8" aria-label="Principal">
        {/* logo horizontal armado con las piezas del logo oficial (la rosa y las letras tal cual, sin el recuadro) */}
        <a href="#inicio" className="flex items-center" aria-label="Florería La Silla, inicio">
          <img src={scrolled ? 'brand/logo-horizontal-negro.png' : 'brand/logo-horizontal-blanco.png'} alt="" width={1536} height={491} className="h-12 w-auto object-contain object-left md:h-14" />
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href} className="group/item relative">
              <a href={l.href} className="group relative text-[0.82rem] font-normal tracking-[0.14em] uppercase opacity-85 transition hover:opacity-100">
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </a>
              {l.children && (
                <div className="invisible absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 transition group-focus-within/item:visible group-focus-within/item:opacity-100 group-hover/item:visible group-hover/item:opacity-100">
                  <ul className="min-w-56 rounded-sm bg-paper py-2 text-ink shadow-[0_18px_40px_-16px_rgba(23,20,20,0.35)] ring-1 ring-ink/5">
                    {l.children.map((c) => (
                      <li key={c.href}>
                        <a href={c.href} className="block px-5 py-2.5 text-[0.95rem] whitespace-nowrap transition-colors hover:bg-blush-50 hover:text-rose">
                          {c.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <CartButton className={scrolled ? 'ring-ink/15' : 'ring-paper/40 hover:bg-paper hover:text-ink'} />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn('grid size-11 cursor-pointer place-items-center rounded-full ring-1 lg:hidden', scrolled ? 'ring-ink/15' : 'ring-paper/40')}
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-paper px-5 pt-3.5 pb-8 text-ink lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
          >
            <div className="flex items-center justify-between">
              <a href="#inicio" onClick={() => setOpen(false)} className="flex items-center" aria-label="Florería La Silla, inicio">
                <img src="brand/logo-horizontal-negro.png" alt="" width={1536} height={491} className="h-12 w-auto" />
              </a>
              <button type="button" onClick={() => setOpen(false)} className="grid size-11 cursor-pointer place-items-center rounded-full ring-1 ring-ink/15" aria-label="Cerrar menú">
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            <ul className="mt-8 border-t border-ink/10">
              {MENU_CELULAR.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-ink/10"
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="group flex min-h-14 items-center justify-between gap-4 font-display text-[1.45rem] leading-none transition-colors active:text-rose">
                    {l.label}
                    <ChevronRight className="size-5 shrink-0 text-stone transition-transform group-active:translate-x-0.5" strokeWidth={1.5} />
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-auto flex flex-col gap-5 pt-10"
            >
              <a
                href={wa()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-13 items-center justify-center gap-2.5 rounded-sm bg-ink text-[0.78rem] tracking-[0.16em] text-paper uppercase transition hover:bg-rose"
              >
                <WhatsAppIcon className="size-5" />
                Pedir por WhatsApp
              </a>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.88rem]">
                <a href={SITE.phoneHref} className="text-stone">
                  {SITE.phone}
                </a>
              </div>
              <SocialTooltip items={SOCIALS} tooltipPosition="top" className="justify-start" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
