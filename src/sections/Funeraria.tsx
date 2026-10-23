import { useId, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { ThumbnailGallery } from '@/components/ui/thumbnail-gallery'
import { useShop } from '@/lib/cart'
import { FUNERARIA, foto } from '@/lib/catalogo'

const PIEZAS = FUNERARIA

const field =
  'min-h-12 w-full rounded-xl bg-night px-4 text-[1rem] text-snow ring-1 ring-snow/15 outline-none placeholder:text-snow/35 focus:ring-snow/60'

export function Funeraria() {
  const { add, qtyOf, listones, setListon, sala, setSala, setCartOpen } = useShop()
  const [piezaId, setPiezaId] = useState(PIEZAS[0].id)
  const ids = { texto: useId(), lugar: useId(), pieza: useId() }
  // el texto que escribes es el del listón de la siguiente pieza que vas a agregar
  const enPedido = qtyOf(piezaId)
  const texto = listones[piezaId]?.[enPedido] ?? ''

  return (
    <section id="funeraria" className="scroll-mt-16 bg-night text-snow">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="flex flex-col gap-6">
          <Reveal>
            <h2 className="font-display text-[clamp(2.4rem,4.3vw,4rem)] leading-[1.02] lg:whitespace-nowrap">Coronas y arreglos de condolencias</h2>
          </Reveal>
          {/* regresa a la tienda (Condolencias es una de sus categorías) */}
          <a
            href="#arreglos"
            className="group inline-flex min-h-11 shrink-0 items-center gap-2 self-start text-[0.75rem] font-medium tracking-[0.16em] text-snow/70 uppercase transition-colors hover:text-snow"
          >
            <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" strokeWidth={1.5} />
            Ver arreglos ocasionales
          </a>
        </div>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          {/* galería de piezas: la que se ve es la que va en el listón */}
          <Reveal className="min-w-0">
            <ThumbnailGallery
              items={PIEZAS.map((p) => ({ src: foto(p), thumb: foto(p, true), alt: `${p.name}: ${p.desc.toLowerCase()}`, name: p.name }))}
              index={Math.max(0, PIEZAS.findIndex((p) => p.id === piezaId))}
              onChange={(i) => setPiezaId(PIEZAS[i].id)}
            />
          </Reveal>

          {/* gadget: escribe el listón; en compu mide lo mismo que la foto (46px = pie con el nombre de la pieza) */}
          <Reveal delay={0.1} className="lg:relative lg:self-stretch">
            <div className="rounded-md bg-night-soft/60 flex flex-col p-5 ring-1 ring-snow/10 sm:p-7 lg:absolute lg:inset-x-0 lg:top-0 lg:bottom-[46px]">
              <div className="relative flex h-40 items-center justify-center overflow-hidden lg:h-auto lg:min-h-24 lg:flex-1" aria-hidden="true">
                {/* listón de satín nacarado: banda al frente, puntas dobladas por detrás */}
                <div className="liston w-[78%]">
                  <span className="liston-cola liston-cola-izq" />
                  <span className="liston-pliegue liston-pliegue-izq" />
                  <span className="liston-cola liston-cola-der" />
                  <span className="liston-pliegue liston-pliegue-der" />
                  <div className="liston-banda px-6 py-4 text-center">
                    <span className="liston-brillo" />
                    <span className="liston-texto relative block font-serif text-[clamp(1.1rem,2.2vw,1.45rem)] leading-snug break-words italic">
                      {texto || 'Con cariño, familia García Treviño'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-[0.95rem] text-snow/70">Escoge la pieza, escribe el texto del listón y agrégala a tu pedido.</p>

              <div className="mt-5 grid gap-4">
                <label htmlFor={ids.pieza} className="sr-only">
                  Arreglo
                </label>
                <select id={ids.pieza} value={piezaId} onChange={(e) => setPiezaId(e.target.value)} className={field}>
                  {PIEZAS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div>
                  <label htmlFor={ids.texto} className="sr-only">
                    Texto del listón
                  </label>
                  <input
                    id={ids.texto}
                    value={texto}
                    maxLength={60}
                    onChange={(e) => setListon(piezaId, enPedido, e.target.value)}
                    placeholder="Texto del listón"
                    className={field}
                  />
                  <span className="mt-1 block text-right text-xs text-snow/40">{texto.length}/60</span>
                </div>
                <label htmlFor={ids.lugar} className="sr-only">
                  Funeraria y sala
                </label>
                <input id={ids.lugar} value={sala} onChange={(e) => setSala(e.target.value)} placeholder="Funeraria y sala" className={field} />
                <button
                  type="button"
                  onClick={() => add(piezaId)}
                  className="mt-1 inline-flex min-h-12 cursor-pointer items-center justify-center gap-2.5 rounded-sm bg-snow px-7 text-[0.95rem] font-normal text-night transition hover:bg-[#e4dfd8]"
                >
                  Agregar al pedido
                </button>
                {enPedido > 0 && (
                  <button type="button" onClick={() => setCartOpen(true)} className="cursor-pointer text-center text-[0.88rem] text-snow/70 underline decoration-snow/25 underline-offset-4 hover:text-snow">
                    Ya llevas {enPedido} en tu pedido · Ver pedido
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
