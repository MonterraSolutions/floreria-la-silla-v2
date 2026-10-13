/** Lo que va en la tarjeta de cada arreglo. */
export type TipoTarjeta = 'mensaje' | 'firma' | 'anonima' | 'sugerido'

export interface Tarjeta {
  tipo: TipoTarjeta
  mensaje: string
  firma: string
}

export const TARJETA_VACIA: Tarjeta = { tipo: 'mensaje', mensaje: '', firma: '' }
export const MAX_MENSAJE = 160
export const MAX_FIRMA = 40

export const TIPOS: { id: TipoTarjeta; label: string }[] = [
  { id: 'mensaje', label: 'Escribir mi propio mensaje' },
  { id: 'sugerido', label: 'Escoger un mensaje de la lista' },
  { id: 'firma', label: 'Solo mi nombre, sin mensaje' },
  { id: 'anonima', label: 'Tarjeta en blanco, sin mensaje ni nombre' },
]

export const SUGERIDOS: { ocasion: string; mensajes: string[] }[] = [
  {
    ocasion: 'Cumpleaños',
    mensajes: ['Feliz cumpleaños. Que este año te traiga todo lo que deseas.', 'Feliz cumpleaños. Gracias por estar siempre.'],
  },
  {
    ocasion: 'Amor',
    mensajes: ['Te amo hoy y todos los días.', 'Gracias por hacerme tan feliz.', 'Para la persona más especial de mi vida.'],
  },
  {
    ocasion: 'Aniversario',
    mensajes: ['Feliz aniversario. Por muchos años más juntos.', 'Gracias por cada día a tu lado. Feliz aniversario.'],
  },
  {
    ocasion: 'Agradecimiento',
    mensajes: ['Gracias por todo. Con mucho cariño.', 'Un pequeño detalle para darte las gracias.'],
  },
  {
    ocasion: 'Nacimiento',
    mensajes: ['Bienvenido al mundo. Muchas felicidades a toda la familia.', 'Felicidades por la llegada de su bebé.'],
  },
  {
    ocasion: 'Recuperación',
    mensajes: ['Que te recuperes pronto. Te mando un abrazo.', 'Con cariño, para que te sientas mejor muy pronto.'],
  },
  {
    ocasion: 'Felicitación',
    mensajes: ['Muchas felicidades por este logro.', 'Felicidades. Te lo mereces.'],
  },
]

function una(v: unknown): Tarjeta {
  if (typeof v === 'string') return { ...TARJETA_VACIA, mensaje: v }
  if (v && typeof v === 'object') return { ...TARJETA_VACIA, ...(v as Partial<Tarjeta>) }
  return TARJETA_VACIA
}

/** Tarjetas de un arreglo, una por pieza. Acepta lo que guardaron versiones anteriores (texto o una sola tarjeta). */
export function normalizar(v: unknown): Tarjeta[] {
  return Array.isArray(v) ? v.map(una) : [una(v)]
}

/** Lo que va en la tarjeta, para el mensaje de WhatsApp; vacío si no hay nada que decir. */
export function textoTarjeta(t: Tarjeta | undefined): string {
  if (!t) return ''
  const firma = t.firma.trim()
  const mensaje = t.mensaje.trim()
  if (t.tipo === 'anonima') return 'en blanco, sin mensaje ni nombre'
  if (t.tipo === 'firma') return firma ? `sin mensaje, solo el nombre "${firma}"` : 'sin mensaje, nombre por confirmar'
  if (!mensaje && !firma) return ''
  return [mensaje && `"${mensaje}"`, firma && `de ${firma}`].filter(Boolean).join(', ')
}

/** Hay algo que guardar (para no llenar el almacenamiento con tarjetas vacías). */
export function tieneAlgo(t: Tarjeta) {
  return t.tipo !== 'mensaje' || t.mensaje.trim() !== '' || t.firma.trim() !== ''
}
