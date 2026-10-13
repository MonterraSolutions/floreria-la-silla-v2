import { useId } from 'react'
import { MAX_FIRMA, MAX_MENSAJE, SUGERIDOS, TARJETA_VACIA, TIPOS, type Tarjeta, type TipoTarjeta } from '@/lib/tarjeta'
import { cn } from '@/lib/utils'

/**
 * Tarjeta de una pieza. Una pregunta con lista desplegable y cada campo con su título:
 * pensado para que cualquier persona lo entienda sin explicación. compact: versión del carrito.
 * numero: «Tarjeta 1 de 2» cuando el arreglo lleva varias piezas.
 */
export function TarjetaCampos({
  value,
  onChange,
  compact = false,
  numero,
}: {
  value: Tarjeta | undefined
  onChange: (t: Tarjeta) => void
  compact?: boolean
  numero?: string
}) {
  const t = value ?? TARJETA_VACIA
  const id = useId()
  const set = (parte: Partial<Tarjeta>) => onChange({ ...t, ...parte })
  const field = cn(
    'w-full rounded-sm bg-paper text-ink ring-1 ring-ink/15 outline-none placeholder:text-stone/60 focus:ring-2 focus:ring-rose',
    compact ? 'px-3 py-2 text-[0.95rem] leading-snug' : 'px-4 py-3 text-[1rem] leading-relaxed',
  )
  const titulo = cn('block text-ink', compact ? 'mb-1 text-[0.88rem]' : 'mb-1.5 text-[0.95rem]')
  const bloque = compact ? 'mt-3' : 'mt-4'
  const elegido = SUGERIDOS.flatMap((g) => g.mensajes).includes(t.mensaje) ? t.mensaje : ''
  const quedan = MAX_MENSAJE - t.mensaje.length

  return (
    <fieldset className="min-w-0">
      {numero && <legend className={cn('font-medium tracking-[0.08em] text-rose uppercase', compact ? 'mb-1 text-[0.72rem]' : 'mb-1.5 text-[0.78rem]')}>{numero}</legend>}
      <label htmlFor={`${id}-tipo`} className={cn('block font-serif text-ink', compact ? 'mb-1.5 text-[1rem]' : 'mb-2 text-[1.2rem]')}>
        ¿Qué quieres que diga la tarjeta?
      </label>
      <select id={`${id}-tipo`} value={t.tipo} onChange={(e) => set({ tipo: e.target.value as TipoTarjeta })} className={cn(field, 'min-h-11 py-0')}>
        {TIPOS.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>

      {t.tipo === 'sugerido' && (
        <div className={bloque}>
          <label htmlFor={`${id}-s`} className={titulo}>
            Escoge el mensaje
          </label>
          <select id={`${id}-s`} value={elegido} onChange={(e) => set({ mensaje: e.target.value })} className={cn(field, 'min-h-11 py-0')}>
            <option value="" disabled>
              Toca aquí para ver los mensajes
            </option>
            {SUGERIDOS.map((g) => (
              <optgroup key={g.ocasion} label={g.ocasion}>
                {g.mensajes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}

      {(t.tipo === 'mensaje' || (t.tipo === 'sugerido' && t.mensaje)) && (
        <div className={bloque}>
          <label htmlFor={`${id}-m`} className={titulo}>
            {t.tipo === 'sugerido' ? 'Así quedará tu mensaje (lo puedes cambiar)' : 'Tu mensaje'}
          </label>
          <textarea
            id={`${id}-m`}
            rows={compact ? 2 : 3}
            maxLength={MAX_MENSAJE}
            value={t.mensaje}
            onChange={(e) => set({ mensaje: e.target.value })}
            placeholder="Ej. Feliz cumpleaños, mamá. Te quiero mucho."
            className={cn(field, 'resize-none')}
          />
          {quedan <= 40 && <p className="mt-0.5 text-[0.8rem] text-stone">Te quedan {quedan} letras</p>}
        </div>
      )}

      {t.tipo !== 'anonima' && (
        <div className={bloque}>
          <label htmlFor={`${id}-f`} className={titulo}>
            ¿De parte de quién?
          </label>
          <input id={`${id}-f`} value={t.firma} maxLength={MAX_FIRMA} onChange={(e) => set({ firma: e.target.value })} placeholder="Ej. Con cariño, Ana" autoComplete="off" className={cn(field, 'min-h-11')} />
        </div>
      )}
    </fieldset>
  )
}
