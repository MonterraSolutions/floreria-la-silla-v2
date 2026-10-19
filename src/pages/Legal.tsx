import type { ReactNode } from 'react'
import { SITE } from '@/lib/site'

// Aviso de privacidad y términos de compra. Revisados contra lo que hace el sitio el 19 oct 2026:
// sin analítica ni cookies propias; el pedido se guarda en el navegador (localStorage) y se manda por WhatsApp.
// PENDIENTE con el cliente: nombre legal del titular, si los precios incluyen IVA, sustituciones y cancelaciones.
const ACTUALIZADO = '19 de octubre de 2026'

function Documento({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <main className="bg-paper pt-28 pb-20 md:pt-36 md:pb-28">
      <article className="mx-auto max-w-3xl px-4 md:px-8">
        <h1 className="font-display text-[clamp(2.4rem,6vw,4.2rem)] leading-[1] text-ink">{titulo}</h1>
        <p className="mt-4 text-[0.9rem] text-stone">Última actualización: {ACTUALIZADO}</p>
        <div className="mt-10 space-y-10 text-[1.02rem] leading-relaxed text-ink-soft [&_a]:text-ink [&_a]:underline [&_a]:decoration-ink/25 [&_a]:underline-offset-4 [&_a:hover]:decoration-rose [&_li]:mt-1.5 [&_p+p]:mt-3 [&_ul+p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
        <p className="mt-14 border-t border-ink/10 pt-6 text-[0.95rem]">
          <a href="#inicio" className="text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-rose">
            Regresar al inicio
          </a>
        </p>
      </article>
    </main>
  )
}

function Parte({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-[1.6rem] leading-tight text-ink">{titulo}</h2>
      {children}
    </section>
  )
}

const correo = <a href={`mailto:${SITE.email}`}>{SITE.email}</a>

export function AvisoPrivacidad() {
  return (
    <Documento titulo="Aviso de privacidad">
      <Parte titulo="Quién cuida tus datos">
        <p>
          {SITE.name}, con domicilio en {SITE.address}, {SITE.city}, es responsable de los datos personales que nos compartes. Para cualquier tema
          de privacidad puedes escribirnos a {correo} o llamarnos al {SITE.phone}.
        </p>
      </Parte>

      <Parte titulo="Qué datos usamos">
        <p>Solo los que nos das para hacer tu pedido o cotizar tu evento, por WhatsApp, por teléfono o en la tienda:</p>
        <ul>
          <li>Tu nombre y tu número de teléfono o WhatsApp.</li>
          <li>El nombre de quien recibe, la dirección y la fecha de entrega.</li>
          <li>El mensaje de la tarjeta o el texto del listón y, en condolencias, la funeraria y la sala.</li>
          <li>Para eventos: tipo de evento, fecha, lugar, número de invitados y lo que necesitas.</li>
          <li>El comprobante, si pagas por transferencia.</li>
        </ul>
        <p>No te pedimos datos sensibles, como salud, religión u origen.</p>
      </Parte>

      <Parte titulo="Para qué los usamos">
        <ul>
          <li>Confirmarte disponibilidad, precio y costo de envío.</li>
          <li>Preparar tu arreglo y entregarlo donde nos digas.</li>
          <li>Recibir tu pago y aclarar cualquier duda sobre tu pedido.</li>
          <li>Cotizar y organizar las flores de tu evento.</li>
        </ul>
        <p>No vendemos tus datos ni los usamos para mandarte publicidad.</p>
      </Parte>

      <Parte titulo="Con quién los compartimos">
        <p>
          Con nadie, salvo cuando una autoridad lo pida conforme a la ley. Los mensajes que nos mandas por WhatsApp pasan por ese servicio, que tiene
          su propio aviso de privacidad.
        </p>
      </Parte>

      <Parte titulo="Lo que se guarda en tu navegador">
        <p>
          Este sitio no usa cookies propias ni herramientas para seguir lo que haces. Lo único que guarda es tu pedido (los arreglos, las tarjetas y
          los datos de entrega que escribas) en tu propio navegador, para que no se pierda si cierras la página. Esa información no nos llega hasta
          que tú mandas el pedido por WhatsApp. La borras con «Vaciar pedido» o borrando los datos del navegador.
        </p>
        <p>
          El mapa de la sección de contacto y los tipos de letra se cargan desde Google, que puede usar sus propias cookies según su política de
          privacidad.
        </p>
      </Parte>

      <Parte titulo="Tus derechos">
        <p>
          Puedes pedirnos ver los datos que tenemos tuyos, corregirlos, borrarlos u oponerte a que los usemos (derechos ARCO), y también retirar tu
          consentimiento. Escríbenos a {correo} con tu nombre, lo que quieres que hagamos y una copia de tu identificación. Te respondemos en un
          máximo de 20 días hábiles.
        </p>
      </Parte>

      <Parte titulo="Cambios a este aviso">
        <p>Si cambiamos algo, lo publicamos en esta misma página con la fecha de la última actualización.</p>
      </Parte>
    </Documento>
  )
}

export function Terminos() {
  return (
    <Documento titulo="Términos y condiciones">
      <Parte titulo="Cómo funciona tu pedido">
        <p>
          Armas tu pedido en el sitio y nos lo mandas por WhatsApp. Antes de que pagues te confirmamos la disponibilidad, el total con envío y la
          hora de entrega. Tu pedido queda apartado cuando recibimos el pago.
        </p>
      </Parte>

      <Parte titulo="Precios y pagos">
        <p>
          Los precios están en pesos mexicanos y no incluyen el envío, que depende de la colonia. Los arreglos sin precio se cotizan por WhatsApp.
          Aceptamos transferencia, efectivo o tarjeta.
        </p>
      </Parte>

      <Parte titulo="Las flores">
        <p>
          Cada arreglo se hace a mano con flor de temporada, así que puede verse un poco distinto a la foto. Si alguna flor o color no está
          disponible, te avisamos y te proponemos un cambio de estilo y valor parecidos.
        </p>
      </Parte>

      <Parte titulo="Entregas">
        <ul>
          <li>Entregamos en Monterrey y su área metropolitana.</li>
          <li>De lunes a viernes, si pides antes de las 12:00, te lo llevamos el mismo día.</li>
          <li>Para entregas en sábado, pide desde el viernes.</li>
          <li>También puedes recoger tu pedido en la tienda.</li>
        </ul>
        <p>Revisa que la dirección y el nombre de quien recibe estén completos; con datos incompletos la entrega se puede retrasar.</p>
      </Parte>

      <Parte titulo="Cambios y cancelaciones">
        <p>
          Si necesitas cambiar algo o cancelar, avísanos por WhatsApp lo antes posible. Como las flores no se pueden guardar, una vez que tu arreglo
          está hecho ya no es posible cancelarlo.
        </p>
      </Parte>

      <Parte titulo="Dudas">
        <p>
          Escríbenos al WhatsApp {SITE.whatsapp}, llámanos al {SITE.phone} o pasa a la tienda en {SITE.address}. Tu información se trata como
          dice nuestro <a href="#aviso-de-privacidad">aviso de privacidad</a>.
        </p>
      </Parte>
    </Documento>
  )
}
