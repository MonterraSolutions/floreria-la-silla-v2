import { Reveal } from '@/components/Reveal'

// Las cuatro secciones que pidió el cliente. Cumpleaños y Amor abren su pestaña en Arreglos.
const OCASIONES = [
  { href: '#cumpleanos', name: 'Cumpleaños', img: 'p/box-girasoles-rosas.webp', alt: 'Box de girasoles y rosas' },
  { href: '#amor', name: 'Amor', img: 'p/rosas-100-base-dorada.webp', alt: 'Cien rosas rojas en base dorada' },
  { href: '#funeraria', name: 'Condolencias', img: 'img/corona-blanca.webp', alt: 'Corona de rosas blancas' },
  { href: '#eventos', name: 'Eventos florales', img: 'img/mesa-novios.webp', alt: 'Mesa de novios decorada con flores' },
]

export function Ocasiones() {
  return (
    <section aria-label="Ocasiones" className="bg-paper py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <ul className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 lg:grid-cols-4">
          {OCASIONES.map((o, i) => (
            <li key={o.href}>
              <Reveal delay={i * 0.06}>
                <a href={o.href} className="group block">
                  <span className="block aspect-[4/5] overflow-hidden rounded-md bg-tile">
                    <img
                      src={o.img}
                      alt={o.alt}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 ease-[var(--ease-petal)] group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="mt-3 block text-center font-display text-[1.25rem] leading-tight text-ink transition-colors group-hover:text-rose md:text-[1.45rem]">
                    {o.name}
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
