// Arreglos de la tienda. Precios: catálogo "10 de Mayo 2026" que mandó el cliente (todos + envío).
// Los que tienen price: null son las fotos de la versión 1 (Instagram y su sitio viejo): se cotizan por WhatsApp.
// Fotos sin fondo en public/p/, todas en el mismo lienzo 4:5 (ver scripts del scratchpad: export.py).

/** Tipo de arreglo (así viene el catálogo del cliente). */
export type TipoId = 'rosas' | 'box' | 'jarrones' | 'especiales'

// PROPUESTA B: la tienda se navega por ocasión en lugar de por tipo. Un arreglo puede estar en varias;
// cada lista va en el orden en que se muestra.
export type CategoriaId = 'amor' | 'cumple' | 'aniversario' | 'nacimiento' | 'gracias'

export interface Categoria {
  id: CategoriaId
  name: string
  /** Título de la fila. */
  title: string
}

export const CATEGORIAS: Categoria[] = [
  { id: 'amor', name: 'Amor', title: 'Amor' },
  { id: 'cumple', name: 'Cumpleaños', title: 'Cumpleaños' },
  { id: 'aniversario', name: 'Aniversario', title: 'Aniversario' },
  { id: 'nacimiento', name: 'Nacimiento', title: 'Nacimiento' },
  { id: 'gracias', name: 'Agradecimiento', title: 'Agradecimiento' },
]

const POR_CATEGORIA: Record<CategoriaId, string[]> = {
  amor: [
    'rosas-12', 'rosas-24', 'box-18-rosas', 'rosas-50', 'cilindro-30-rosas', 'rosas-vino-tinto', 'bowl-rosas-orquideas', 'tulipanes-12',
    'box-mixto-100-rosas', 'rosas-100-base-dorada', 'bouquet-100-rosas', 'rosas-200-base-dorada', 'canasta-250-rosas',
  ],
  cumple: [
    'box-girasoles-rosas', 'bloom-box', 'box-gerberas-lisianthus', 'rosas-lisianthus-12', 'tulipanes-20', 'box-rosas-gerberas-chico',
    'surtido-jarron', 'cilindro-girasoles', 'caja-rosas-surtida', 'tulipanes', 'tulipanes-50', 'vino-blanco-caja', 'esfera-plata',
  ],
  aniversario: [
    'rosas-50-orquidea', 'rosas-100-base-dorada', 'cilindro-30-rosas', 'caja-rosas-orquideas', 'rosas-vino-tinto', 'rosas-24',
    'surtido-especial', 'bowl-rosas-orquideas', 'jarron-negro-anturios', 'rosas-200-base-dorada',
  ],
  nacimiento: [
    'box-rosas-gerberas-chico', 'tulipanes-12', 'bowl-hortensias', 'surtido-jarron', 'box-gerberas-lisianthus', 'tulipanes',
    'orquidea-phalaenopsis-rosas',
  ],
  gracias: [
    'orquidea-phalaenopsis-rosas', 'jarron-lirios', 'surtido-especial', 'bowl-hortensias', 'esfera-plata', 'cilindro-girasoles',
    'rosas-lisianthus-12', 'jarron-negro-anturios', 'caja-rosas-orquideas',
  ],
}

export interface Producto {
  id: string
  name: string
  cat: TipoId | 'funeraria'
  /** Pesos MXN, sin envío. null = precio por confirmar. */
  price: number | null
  desc: string
  /** Ruta de la foto sin extensión, si no vive en public/p/ (las de funeraria tienen fondo). */
  img?: string
}

export const PRODUCTOS: Producto[] = [
  // ---------- rosas ----------
  { id: 'rosas-12', name: '12 Rosas', cat: 'rosas', price: 890, desc: 'Una docena de rosas rojas con astromelia blanca, en florero La Silla con listón.' },
  { id: 'rosas-24', name: '24 Rosas', cat: 'rosas', price: 1690, desc: 'Dos docenas de rosas rojas con astromelia blanca, en florero alto.' },
  { id: 'rosas-lisianthus-12', name: '12 Rosas y Lisianthus', cat: 'rosas', price: 1290, desc: 'Rosas rojas con lisianthus y clavel en tonos durazno y amarillo, en florero rosa.' },
  { id: 'rosas-50', name: '50 Rosas', cat: 'rosas', price: 2690, desc: 'Cincuenta rosas rojas en domo con astromelia, en florero de cristal.' },
  { id: 'rosas-50-orquidea', name: '50 Rosas con Orquídea', cat: 'rosas', price: 3290, desc: 'Cincuenta rosas rojas y astromelia con una vara de orquídea phalaenopsis.' },
  { id: 'cilindro-30-rosas', name: 'Cilindro 30 Rosas', cat: 'rosas', price: 2090, desc: 'Treinta rosas rojas acomodadas a ras del cilindro, con una orquídea al centro y listón dorado.' },
  { id: 'box-mixto-100-rosas', name: 'Box Mixto 100 Rosas', cat: 'rosas', price: 4590, desc: 'Cien rosas rojas y durazno en domo, sobre caja rosa con moño.' },
  { id: 'rosas-100-base-dorada', name: '100 Rosas Base Dorada', cat: 'rosas', price: 4790, desc: 'Cien rosas rojas con lisianthus rosa y eucalipto, en base dorada.' },
  { id: 'rosas-200-base-dorada', name: '200 Rosas Base Dorada', cat: 'rosas', price: 9450, desc: 'Doscientas rosas rojas en un domo completo, sobre base dorada con listón.' },
  { id: 'canasta-250-rosas', name: 'Canasta 250 Rosas', cat: 'rosas', price: 12990, desc: 'Doscientas cincuenta rosas rojas en canasta de mimbre, con dos varas de orquídea y listón rosa.' },
  { id: 'bouquet-100-rosas', name: 'Bouquet de 100 Rosas', cat: 'rosas', price: null, desc: 'Cien rosas rojas en ramo, envuelto con listón de yute.' },

  // ---------- box ----------
  { id: 'box-rosas-gerberas-chico', name: 'Box Rosas y Gerberas', cat: 'box', price: 1290, desc: 'Rosas rosas, gerberas fucsia y crisantemo en caja cuadrada azul. Tamaño chico.' },
  { id: 'box-18-rosas', name: 'Box 18 Rosas', cat: 'box', price: 1790, desc: 'Dieciocho rosas rojas con clavel y crisantemo rosa, en caja redonda.' },
  { id: 'box-gerberas-lisianthus', name: 'Box Gerberas y Lisianthus', cat: 'box', price: 1890, desc: 'Gerberas fucsia con lisianthus rosa y blanco y limonium, en caja rosa.' },
  { id: 'box-girasoles-rosas', name: 'Box Girasoles y Rosas', cat: 'box', price: 2390, desc: 'Girasoles y rosas rosas con limonium amarillo, en caja redonda.' },
  { id: 'bloom-box', name: 'Bloom Box', cat: 'box', price: 4690, desc: 'Tulipán, rosa, hortensia, crisantemo y orquídea: una caja grande llena de color.' },
  { id: 'caja-rosas-orquideas', name: 'Caja de Rosas y Orquídea', cat: 'box', price: null, desc: 'Planta de orquídea phalaenopsis sobre rosas y clavel, en caja redonda.' },
  { id: 'caja-rosas-surtida', name: 'Caja de Rosas Surtida', cat: 'box', price: null, desc: 'Rosas rojas, amarillas y rosas en caja negra.' },
  { id: 'rosas-vino-tinto', name: 'Rosas con Vino Tinto', cat: 'box', price: null, desc: 'Caja con una docena de rosas rojas y botella de vino tinto.' },
  { id: 'vino-blanco-caja', name: 'Flores con Vino Blanco', cat: 'box', price: null, desc: 'Rosas, clavel y delfinio en caja, con botella de vino blanco.' },

  // ---------- jarrones ----------
  { id: 'tulipanes-12', name: '12 Tulipanes', cat: 'jarrones', price: 1290, desc: 'Doce tulipanes rosas en florero blanco con listón.' },
  { id: 'tulipanes-20', name: '20 Tulipanes', cat: 'jarrones', price: 2290, desc: 'Veinte tulipanes amarillos y rosas con crisantemo, en florero alto.' },
  { id: 'tulipanes-50', name: '50 Tulipanes', cat: 'jarrones', price: 4790, desc: 'Cincuenta tulipanes de colores en florero blanco.' },
  { id: 'surtido-jarron', name: 'Surtido en Jarrón', cat: 'jarrones', price: 1990, desc: 'Hortensia azul, lilis, gerberas y clavel en jarrón blanco.' },
  { id: 'tulipanes', name: 'Jarrón de Tulipanes', cat: 'jarrones', price: null, desc: 'Tulipán amarillo con flor de cera, en jarrón de cristal.' },
  { id: 'jarron-lirios', name: 'Jarrón de Lirios', cat: 'jarrones', price: null, desc: 'Lirios, rosas, orquídeas y perritos en jarrón de cristal.' },
  { id: 'cilindro-girasoles', name: 'Cilindro con Girasoles', cat: 'jarrones', price: null, desc: 'Girasoles con varas naturales en cilindro de cristal.' },
  { id: 'jarron-negro-anturios', name: 'Cilindro Negro de Temporada', cat: 'jarrones', price: null, desc: 'Anturios, tulipanes y hortensia en cilindro negro.' },

  // ---------- especiales ----------
  { id: 'orquidea-phalaenopsis-rosas', name: 'Orquídea Phalaenopsis y Rosas', cat: 'especiales', price: 2290, desc: 'Planta de orquídea phalaenopsis con rosas, clavel y crisantemo, en caja. La orquídea se queda viva.' },
  { id: 'surtido-especial', name: 'Surtido Especial', cat: 'especiales', price: 4590, desc: 'Variedad de flor con orquídea cymbidium y tulipanes, en arreglo alto.' },
  { id: 'bowl-rosas-orquideas', name: 'Bowl de Rosas y Orquídeas', cat: 'especiales', price: null, desc: 'Rosas rojas y rosas con orquídea blanca, en bowl.' },
  { id: 'bowl-hortensias', name: 'Bowl de Hortensias', cat: 'especiales', price: null, desc: 'Hortensia rosa, lila y blanca en pecera de cristal.' },
  { id: 'esfera-plata', name: 'Esfera Plata', cat: 'especiales', price: null, desc: 'Rosa fucsia, agapando y orquídea en esfera plateada.' },
]

// Coronas y arreglos de condolencias: llevan listón en lugar de tarjeta. Sin precio publicado: se cotizan.
export const FUNERARIA: Producto[] = [
  { id: 'corona-blanca', img: 'img/corona-blanca', name: 'Corona blanca', cat: 'funeraria', price: null, desc: 'Rosas blancas con centro de hortensia' },
  { id: 'corona-rosas-rojas', img: 'img/corona-rosas-rojas', name: 'Corona de rosas rojas', cat: 'funeraria', price: null, desc: 'Rosa roja sobre follaje de palma' },
  { id: 'cruz-rosas', img: 'img/cruz-rosas', name: 'Cruz de rosas blancas', cat: 'funeraria', price: null, desc: 'Rosas, lilis y orquídea, en tripié' },
  { id: 'tripie-rosas-blancas', img: 'img/tripie-rosas-blancas', name: 'Tripié de rosas blancas', cat: 'funeraria', price: null, desc: 'Rosas y perritos blancos' },
  { id: 'condolencia-liston', img: 'img/condolencia-liston', name: 'Arreglo con listón', cat: 'funeraria', price: null, desc: 'Tulipán, lili y nube, con dedicatoria' },
  { id: 'blanco-con-fruta', img: 'img/blanco-con-fruta', name: 'Arreglo blanco con fruta', cat: 'funeraria', price: null, desc: 'Para llevar a casa de la familia' },
]

export const byId = (id: string) => PRODUCTOS.find((p) => p.id === id) ?? FUNERARIA.find((p) => p.id === id)

/** Arreglos de una ocasión, en el orden de su lista. */
export const deCategoria = (id: CategoriaId) => POR_CATEGORIA[id].map((x) => PRODUCTOS.find((p) => p.id === x)!)

/** La ocasión principal de un arreglo (la primera lista donde aparece). */
export const categoriaDe = (p: Producto) => CATEGORIAS.find((c) => POR_CATEGORIA[c.id].includes(p.id))

export const esFuneraria = (p: Producto) => p.cat === 'funeraria'

/** Foto del arreglo; chica para miniaturas. */
/** Subirlo cada vez que cambien fotos (el navegador y el CDN guardan las anteriores una semana). */
const FOTOS_V = 2
export const foto = (p: Producto, chica = false) => `${p.img ?? `p/${p.id}`}${chica ? '-sm' : ''}.webp?v=${FOTOS_V}`

const mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
/** $1,790 */
export const precio = (n: number) => mxn.format(n).replace('MX', '')

export const MUNICIPIOS = ['Monterrey', 'San Pedro Garza García', 'San Nicolás', 'Guadalupe', 'Apodaca', 'Santa Catarina', 'Escobedo', 'García', 'Juárez', 'Santiago']
