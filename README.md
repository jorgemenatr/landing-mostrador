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

## Publicar en Netlify

`netlify.toml` ya trae la configuración: publica la raíz del repo, sin build, y devuelve 404 en `/design/`, `/README.md` y `/netlify.toml`.

1. En Netlify: **Add new site → Import an existing project → GitHub**, elige este repo y la rama `main`. Deja vacío el comando de build.
2. En **Forms**, activa la detección de formularios (*Enable form detection*) y vuelve a publicar.
3. Las solicitudes de demo llegan a **Forms → demo**. Desde ahí puedes activar avisos por correo.

El formulario de `/demo/` usa Netlify Forms (`data-netlify="true"`, con un campo trampa `bot-field` contra spam). `site.js` lo envía con `fetch` y solo muestra la confirmación si Netlify responde 2xx. Si el envío falla (por ejemplo, en local con `python3 -m http.server`), muestra un aviso de error.

## Pendientes

- **`/login`, `/registro`, `/privacidad` y `/terminos`.** No existen todavía; el footer no los enlaza hasta tener destinos reales.
- **Por confirmar con el producto:** formas de carga del inventario, opciones de configuración del agente y reglas de apartado.
