# deVRL - URL Shortener

deVRL es un acortador de URLs con alias personalizados, códigos QR y un dashboard para administrar enlaces, consultar analítica y controlar su estado de publicación.

## Características

- Creación pública de enlaces desde la landing.
- Creación autenticada y administración de enlaces desde el dashboard.
- Alias personalizados con validación de URL y slug.
- Activación y desactivación de enlaces.
- Búsqueda, filtros y paginación de enlaces propios.
- Redirecciones con rate limiting.
- Registro idempotente de clics y analítica por periodos de 7, 30 y 90 días.
- Generación, copia y descarga de códigos QR.
- Theme switcher para modo oscuro y claro.
- Diseño responsive para móvil, tablet y desktop.
- GitHub Action para mantener activo el proyecto Supabase mediante una consulta real a Postgres.

## Tecnologías

[![Tecnologías](https://skillicons.dev/icons?i=nextjs,react,typescript,supabase,redis,tailwind,githubactions&theme=light)](https://skillicons.dev)

- Next.js 16 con App Router.
- React 19 y TypeScript.
- Supabase Auth, Postgres y Data API.
- Upstash Redis para rate limiting.
- Tailwind CSS 4 y componentes estilo shadcn/ui.
- React Query, React Hook Form y Zod.
- Vercel Functions para identificar la IP confiable en rate limiting.

## Requisitos

- Node.js 20 o superior.
- pnpm 11 o compatible.
- Un proyecto Supabase.
- Una instancia Redis compatible con Upstash.

## Instalación

```bash
pnpm install
```

Crea un archivo `.env` o `.env.local` con las variables necesarias:

```env
SUPABASE_URL=https://your-project.supabase.co
PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key

NEXT_PUBLIC_DOMAIN_URL=https://your-domain.example
DOMAIN_URL=https://your-domain.example

UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

`SUPABASE_SERVICE_ROLE_KEY` sólo debe existir en el entorno servidor. No debe publicarse como `NEXT_PUBLIC_*`, incluirse en el navegador ni commitearse.

## Base de datos

Las migraciones están en `supabase/migrations/` y agregan:

- Estado de publicación y contador acumulado de clics en `public.urls`.
- Eventos de clic en `public.link_click_events`.
- Funciones para resolver enlaces activos y registrar clics idempotentes.
- Analítica agregada por usuario.
- Tabla singleton `public.keepalive` para el workflow de GitHub Actions.

Para aplicar migraciones con el flujo local de Supabase:

```bash
supabase start
supabase db push
```

La tabla `public.keepalive` tiene RLS habilitado y permite únicamente `SELECT` a `anon` y `authenticated`. No expone datos de negocio.

## Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Verificación

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## APIs principales

### Crear un enlace público

```http
POST /api/public/slug
Content-Type: application/json
```

```json
{
  "url": "https://example.com/article",
  "slug": "article"
}
```

La creación pública está protegida por rate limiting y guarda el enlace sin propietario (`user_id = null`), por lo que no aparece en el dashboard de un usuario autenticado.

### Crear un enlace autenticado

```http
POST /api/slug
```

Requiere una sesión válida de Supabase Auth y asigna el enlace al usuario autenticado.

### Listar enlaces

```http
GET /api/url?page=1&limit=10&status=all&q=alias
```

`status` acepta `all`, `active` y `no_clicks`. La búsqueda se realiza sobre el slug y la URL original.

### Cambiar el estado

```http
PATCH /api/url/:linkId/status
Content-Type: application/json
```

```json
{
  "isActive": false
}
```

### Analítica

```http
GET /api/analytics?period=30d
```

`period` acepta `7d`, `30d` y `90d`. El endpoint requiere autenticación.

## GitHub Actions: Supabase keepalive

`.github/workflows/supabase-keepalive.yml` ejecuta una consulta diaria a:

```text
/rest/v1/keepalive?select=id&limit=1
```

La consulta toca una tabla real de Postgres; no depende de que la homepage sea dinámica. El workflow usa privilegios mínimos y no necesita la service role key.

Configura estos Repository Secrets en GitHub en `Settings > Secrets and variables > Actions`:

```text
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
```

El workflow también se puede ejecutar manualmente desde la pestaña **Actions**.

## Arquitectura

- `src/app/`: rutas, páginas y route handlers de Next.js.
- `src/backend/domain/`: entidades y tipos del dominio.
- `src/backend/application/`: casos de uso y puertos.
- `src/backend/infrastructure/supabase/`: adaptadores de Supabase y cliente administrativo server-only.
- `src/components/`: componentes compartidos de landing y UI.
- `src/app/dashboard/`: dashboard, hooks y componentes específicos de la funcionalidad.
- `supabase/migrations/`: cambios versionados de base de datos.

Los route handlers mantienen la separación `repository -> service` para las operaciones de persistencia y negocio.

## Seguridad

- Las operaciones del dashboard requieren Supabase Auth.
- Las tablas principales usan RLS y políticas de propiedad.
- `record_link_click` sólo puede ejecutarse con credenciales de servidor.
- Los enlaces públicos están protegidos por rate limiting.
- Las claves secretas se mantienen en variables de entorno del servidor o GitHub Secrets.