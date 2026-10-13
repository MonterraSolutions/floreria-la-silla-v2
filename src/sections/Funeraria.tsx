import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal } from '@/components/Reveal'
import { ThumbnailGallery } from '@/components/ui/thumbnail-gallery'
import { useShop } from '@/lib/cart'
import { FUNERARIA, foto } from '@/lib/catalogo'

const PIEZAS = FUNERARIA

const field =
  'min-h-12 w-full rounded-xl bg-ink px-4 text-[1rem] text-paper ring-1 ring-paper/15 outline-none placeholder:text-paper/35 focus:ring-paper/60'

export function Funeraria() {
  const { add, qtyOf, listones, setListon, sala, setSala, setCartOpen } = useShop()
  const [piezaId, setPiezaId] = useState(PIEZAS[0].id)
  const pieza = PIEZAS.find((p) => p.id === piezaId)!
  const ids = { texto: useId(), lugar: useId(), pieza: useId() }
  // el texto que escribes es el del listón de la siguiente pieza que vas a agregar
  const enPedido = qtyOf(piezaId)
  const texto = listones[piezaId]?.[enPedido] ?? ''

  return (
    <section id="funeraria" className="scroll-mt-16 bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02]">Coronas y arreglos de condolencias</h2>
          </Reveal>
        </div>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* galería de piezas: la que se ve es la que va en el listón */}
          <Reveal className="min-w-0">
            <ThumbnailGallery
              items={PIEZAS.map((p) => ({ src: foto(p), thumb: foto(p, true), alt: `${p.name}: ${p.desc.toLowerCase()}`, name: p.name }))}
              index={Math.max(0, PIEZAS.findIndex((p) => p.id === piezaId))}
              onChange={(i) => setPiezaId(PIEZAS[i].id)}
            />
          </Reveal>

          {/* gadget: escribe el listón */}
          <Reveal delay={0.1}>
            <div className="rounded-md bg-ink-soft/60 p-5 ring-1 ring-paper/10 sm:p-7">
              <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-md bg-[radial-gradient(ellipse_at_center,#2b2424_0%,#171414_75%)]" aria-hidden="true">
                <motion.span key={piezaId} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="absolute top-4 text-[0.68rem] tracking-[0.3em] text-paper/45 uppercase">
                  {pieza.name}
                </motion.span>
                {/* listón de satín nacarado: banda al frente, puntas dobladas por detrás */}
                <div className="liston mt-4 w-[78%]">
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

              <p className="mt-6 text-[0.95rem] text-paper/70">Escoge la pieza, escribe el texto del listón y agrégala a tu pedido.</p>

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
                  <span className="mt-1 block text-right text-xs text-paper/40">{texto.length}/60</span>
                </div>
                <label htmlFor={ids.lugar} className="sr-only">
                  Funeraria y sala
                </label>
                <input id={ids.lugar} value={sala} onChange={(e) => setSala(e.target.value)} placeholder="Funeraria y sala" className={field} />
                <button
                  type="button"
                  onClick={() => add(piezaId)}
                  className="mt-1 inline-flex min-h-12 cursor-pointer items-center justify-center gap-2.5 rounded-sm bg-paper px-7 text-[0.95rem] font-normal text-ink transition hover:bg-[#e4dfd8]"
                >
                  Agregar al pedido
                </button>
                {enPedido > 0 && (
                  <button type="button" onClick={() => setCartOpen(true)} className="cursor-pointer text-center text-[0.88rem] text-paper/70 underline decoration-paper/25 underline-offset-4 hover:text-paper">
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
