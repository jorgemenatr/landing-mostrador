# landing-mostrador

Sitio de marketing de **mostrador_**: un agente de IA que conoce el inventario de un negocio y atiende a sus clientes por WhatsApp.

Es un sitio estático: HTML, CSS y un poco de JavaScript, sin dependencias ni paso de build.

## Rutas

| Ruta | Archivo |
| --- | --- |
| `/` | `index.html` |
| `/como-funciona/` | `como-funciona/index.html` |
| `/funcionalidades/` | `funcionalidades/index.html` |
| `/casos-de-uso/` | `casos-de-uso/index.html` |
| `/preguntas-frecuentes/` | `preguntas-frecuentes/index.html` |
| `/demo/` | `demo/index.html` |
| 404 | `404.html` |

Los enlaces usan rutas absolutas (`/demo/`), así que el sitio debe servirse desde la raíz de un dominio (Netlify, Vercel, Cloudflare Pages o un dominio propio en GitHub Pages).

## Correr en local

```sh
python3 -m http.server 8000
# abre http://localhost:8000
```

## Estructura

- `assets/css/mostrador-ds.css`: componentes del design system de mostrador_ (`ms-*`), copiados sin cambios.
- `assets/css/site.css`: tokens del design system y estilos del sitio (`mw-*`): layout, secciones, animaciones y responsive.
- `assets/js/site.js`: pestañas de la demostración del inicio, pestañas de casos de uso y validación del formulario de demo.
- `design/`: el canvas de diseño del que sale este sitio (fuente de referencia, no se publica).

La navegación y el footer se repiten en cada página. Si los cambias, cámbialos en todos los `index.html` y en `404.html`.

Las conversaciones de ejemplo del inicio y de casos de uso viven en un `<script type="application/json">` dentro de cada página. El HTML ya trae el primer ejemplo, así que la página se lee bien aunque no cargue el JavaScript.

## Pendientes

- **Recepción de solicitudes de demo.** Todavía no hay un sistema que las reciba. En `demo/index.html` el formulario tiene `data-endpoint=""`. Mientras esté vacío, al enviar se muestra un aviso de que la solicitud no se envió y no se guarda nada. Cuando exista un endpoint, pon su URL en ese atributo: el script envía `nombre`, `negocio`, `correo`, `whatsapp` y `giro` como JSON por `POST` y solo muestra la confirmación si la respuesta es 2xx.
- **`/login`, `/registro`, `/privacidad` y `/terminos`.** No existen todavía; el footer no los enlaza hasta tener destinos reales.
- **Por confirmar con el producto:** formas de carga del inventario, opciones de configuración del agente y reglas de apartado.
