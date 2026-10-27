import { SocialTooltip } from '@/components/ui/social-media'
import { SOCIALS } from '@/lib/socials'
import { SITE } from '@/lib/site'

const LINKS = [
  ['#arreglos', 'Arreglos'],
  ['#eventos', 'Eventos'],
  ['#cotizar', 'Cotizar'],
  ['#quienes-somos', 'Quiénes somos'],
  ['#contacto', 'Contacto'],
]

export function Footer() {
  return (
    <footer className="bg-night text-snow">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        {/* el logo va como imagen (el mismo del menú), no escrito */}
        <div className="flex flex-col items-start gap-2.5">
          <img src="brand/logo-horizontal-blanco.png" alt="Florería La Silla" width={1536} height={491} loading="lazy" className="h-11 w-auto" />
          <p className="text-xs leading-tight text-snow/55">
            {SITE.address}, {SITE.city}
          </p>
        </div>
        <nav aria-label="Pie de página">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-snow/70">
            {LINKS.map(([h, l]) => (
              <li key={h}>
                <a href={h} className="hover:text-snow">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <SocialTooltip items={SOCIALS} tooltipPosition="top" className="justify-start gap-2 [&_a]:bg-snow/10 [&_a]:ring-snow/15 [&_svg]:text-snow" />
      </div>
      <div className="border-t border-snow/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-snow/45 sm:flex-row sm:justify-between md:px-8">
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} Florería La Silla</span>
            <a href="#aviso-de-privacidad" className="hover:text-snow">
              Aviso de privacidad
            </a>
            <a href="#terminos" className="hover:text-snow">
              Términos y condiciones
            </a>
          </span>
          <span>
            Sitio web por{' '}
            <a href="https://monterra-solutions.com" target="_blank" rel="noopener" className="underline decoration-snow/25 underline-offset-4 hover:text-snow">
              Monterra Solutions
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
