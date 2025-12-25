# CertiGen

<div align="center">

![CertiGen Logo](https://img.shields.io/badge/CertiGen-v3.1.1-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![React PDF](https://img.shields.io/badge/@react--pdf/renderer-4.x-red?style=for-the-badge)

**Sistema de Generacion y Validacion de Certificados con QR**

[Demo en Vivo](https://certigen-sandy.vercel.app) · [Reportar Bug](https://github.com/gonzalezulises/certigen/issues) · [Solicitar Feature](https://github.com/gonzalezulises/certigen/issues)

</div>

---

## Novedades v3.1.1

- **Vista previa con QR** - El configurador ahora muestra el codigo QR en la vista previa
- **Fuentes corregidas** - Reemplazadas fuentes corruptas (Merriweather, RobotoSlab)
- **Estilos de esquinas** - Todos los estilos (none, simple, ornate, flourish) funcionan correctamente
- **Configuracion robusta** - Manejo seguro de valores undefined en toda la configuracion
- **9 Idiomas** - ES, EN, DE, IT, PL, RU, HU, HE (RTL), TH

---

## Demo

**Produccion:** https://certigen-sandy.vercel.app

---

## Tabla de Contenidos

- [Caracteristicas](#caracteristicas)
- [Configurador de Plantillas](#configurador-de-plantillas)
- [Internacionalizacion](#internacionalizacion)
- [Tema y Accesibilidad](#tema-y-accesibilidad)
- [Arquitectura](#arquitectura)
- [Stack Tecnologico](#stack-tecnologico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalacion](#instalacion)
- [Configuracion](#configuracion)
- [Base de Datos](#base-de-datos)
- [API Reference](#api-reference)
- [Seguridad](#seguridad)
- [Despliegue](#despliegue)
- [Contribuir](#contribuir)

---

## Caracteristicas

### Funcionalidades Principales

| Funcionalidad | Descripcion |
|---------------|-------------|
| **Generacion de Certificados** | Crea certificados con ID unico formato `CER-YYYYMMDD-XXXXXX` |
| **Codigos QR** | Cada certificado incluye QR para validacion instantanea |
| **Validacion Publica** | Cualquiera puede verificar autenticidad via web o QR |
| **3 Plantillas Configurables** | Classic, Minimal y Creative con personalizacion completa |
| **Configurador Visual** | Ajusta colores, tipografia, bordes, ornamentos en tiempo real |
| **Logo Personalizado** | Sube el logo de tu organizacion |
| **Tamano de Papel** | Soporta A4, Letter y Legal horizontal |
| **PDF Vectorial** | Generacion con @react-pdf/renderer para maxima calidad |
| **Generacion en Lote** | Genera multiples certificados desde CSV |
| **Envio por Email** | Envia certificados automaticamente por correo con PDF adjunto |
| **API REST** | Integracion con plataformas externas |
| **Panel Admin** | Gestion y monitoreo de certificados |
| **9 Idiomas** | Soporte multilingue completo |
| **Modo Oscuro** | Tema claro/oscuro/sistema |
| **Accesibilidad WCAG 2.1** | Cumple estandares de accesibilidad |

### Modos de Operacion

1. **Individual**: Genera certificados uno por uno con vista previa en tiempo real
2. **Lote (CSV)**: Sube un archivo CSV para generar multiples certificados
3. **API**: Genera certificados automaticamente desde otras plataformas

---

## Configurador de Plantillas

CertiGen incluye un potente configurador visual que permite personalizar cada aspecto del certificado.

### Plantillas Disponibles

| Plantilla | Descripcion | Caracteristicas |
|-----------|-------------|-----------------|
| **Classic** | Diseño tradicional y elegante | Bordes ornamentados, sello, esquinas decorativas |
| **Minimal** | Diseño limpio y moderno | Espaciado generoso, tipografia prominente |
| **Creative** | Diseño artistico y dinamico | Patrones de fondo, flourishes, estilo script |

### Opciones de Personalizacion

#### Colores
- Color primario (titulo)
- Color secundario (curso)
- Color de acento (divisores, ornamentos)
- Color de fondo
- Color de texto
- Color de bordes

#### Tipografia
- Fuente de titulo (Serif, Sans, Script, Slab, Display)
- Fuente de cuerpo
- Fuente de acento (nombre del estudiante)
- Peso de fuentes
- Transformacion de texto (mayusculas, normal)
- Escala (compacta, normal, espaciosa)

#### Bordes y Layout
- Estilo de borde (ninguno, solido, doble, ornamentado)
- Ancho del borde
- Radio de esquinas
- Padding
- Orientacion (horizontal, vertical)
- Tamano de papel (A4, Letter, Legal)

#### Ornamentos
- Divisores (simple, elegante, ornamentado)
- Sello oficial (clasico, moderno, cinta)
- Patron de fondo (ninguno, marca de agua)
- Esquinas decorativas

#### Contenido
- Texto del encabezado
- Subtitulo personalizado
- Mostrar/ocultar elementos (fecha, horas, calificacion, instructor, QR, numero)
- Nombre de organizacion

### Sistema de PDF Vectorial

CertiGen utiliza `@react-pdf/renderer` para generar PDFs de alta calidad:

```
Caracteristicas del Motor PDF:
├── Renderizado 100% vectorial
├── Fuentes embebidas (Inter, Merriweather, Great Vibes, Roboto Slab)
├── Codigo QR integrado en el documento
├── Soporte para orientacion landscape/portrait
├── Tamanos de papel: A4, Letter, Legal
└── Ornamentos y sellos renderizados con SVG
```

---

## Internacionalizacion

CertiGen soporta **9 idiomas** con deteccion automatica del navegador:

| Idioma | Codigo | Direccion |
|--------|--------|-----------|
| English | `en` | LTR |
| Deutsch (German) | `de` | LTR |
| Polski (Polish) | `pl` | LTR |
| Русский (Russian) | `ru` | LTR |
| Espanol | `es` | LTR |
| עברית (Hebrew) | `he` | **RTL** |
| Magyar (Hungarian) | `hu` | LTR |
| Italiano | `it` | LTR |
| ไทย (Thai) | `th` | LTR |

### Caracteristicas i18n

- **Deteccion automatica**: El idioma se detecta del navegador del usuario
- **URLs localizadas**: Cada idioma tiene su propio prefijo de URL (`/en/`, `/es/`, `/he/`)
- **Soporte RTL**: Hebreo se muestra correctamente de derecha a izquierda
- **Fuentes especiales**: Noto Sans Thai y Noto Sans Hebrew para mejor legibilidad
- **Selector de idioma**: Cambio de idioma en tiempo real desde cualquier pagina

---

## Tema y Accesibilidad

### Sistema de Temas

CertiGen incluye un sistema completo de temas:

| Modo | Descripcion |
|------|-------------|
| **Claro** | Tema predeterminado con colores claros |
| **Oscuro** | Tema oscuro para reducir fatiga visual |
| **Sistema** | Sigue la preferencia del sistema operativo |

### Accesibilidad (WCAG 2.1 AA)

| Caracteristica | Implementacion |
|----------------|----------------|
| **Skip Link** | Enlace para saltar al contenido principal |
| **ARIA Labels** | Etiquetas descriptivas en todos los elementos interactivos |
| **Navegacion por teclado** | Soporte completo para Tab, Enter, Escape |
| **Contraste de colores** | Cumple ratio minimo de 4.5:1 |
| **Focus visible** | Indicadores claros de foco para navegacion |
| **Reduccion de movimiento** | Respeta `prefers-reduced-motion` |
| **Semantica HTML** | Uso correcto de landmarks (`main`, `nav`, `header`, `footer`) |
| **Roles ARIA** | `role="navigation"`, `aria-current="page"`, `aria-expanded` |

---

## Arquitectura

### Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Inicio    │  │  Generador  │  │    Lote     │  │Validador│ │
│  │ /[locale]   │  │  /generate  │  │   /batch    │  │/validate│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
│         │                │                │              │       │
│         └────────────────┴────────────────┴──────────────┘       │
│                                   ▼                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Next.js 16 App Router (React 19)             │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐          │   │
│  │  │ next-intl  │  │next-themes │  │   WCAG     │          │   │
│  │  │    i18n    │  │ Dark Mode  │  │Accessibility│         │   │
│  │  └────────────┘  └────────────┘  └────────────┘          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Next.js)                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ /api/certificates│  │ /api/certificates│  │ /api/integration│  │
│  │    /generate    │  │   /send-email   │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    MIDDLEWARE                             │   │
│  │  • Security Headers  • Rate Limiting  • i18n Routing      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│        SUPABASE         │     │         RESEND          │
│  ┌─────────────┐        │     │                         │
│  │ PostgreSQL  │        │     │   Email Delivery API    │
│  │  Database   │        │     │                         │
│  └─────────────┘        │     │  • Certificados PDF     │
│                         │     │  • Plantilla HTML       │
│  Tablas:                │     │                         │
│  • certificates         │     └─────────────────────────┘
│  • certificate_templates│
│  • certificate_validations
└─────────────────────────┘
```

### Flujo de Generacion y Envio

```
Usuario                    Frontend                    API                     Supabase/Resend
   │                          │                         │                          │
   │ 1. Completa formulario   │                         │                          │
   │    + sube logo (opcional)│                         │                          │
   │────────────────────────▶│                         │                          │
   │                          │                         │                          │
   │                          │ 2. POST /api/generate   │                          │
   │                          │────────────────────────▶│                          │
   │                          │                         │ 3. INSERT certificate    │
   │                          │                         │────────────────────────▶ │ (Supabase)
   │                          │                         │◀────────────────────────│
   │                          │◀────────────────────────│                          │
   │                          │                         │                          │
   │ 4. Muestra preview + QR  │                         │                          │
   │◀────────────────────────│                         │                          │
   │                          │                         │                          │
   │ 5. Click "Enviar Email"  │                         │                          │
   │────────────────────────▶│                         │                          │
   │                          │ 6. POST /api/send-email │                          │
   │                          │────────────────────────▶│                          │
   │                          │                         │ 7. Send email + PDF      │
   │                          │                         │────────────────────────▶ │ (Resend)
   │                          │                         │◀────────────────────────│
   │                          │◀────────────────────────│                          │
   │ 8. Confirmacion          │                         │                          │
   │◀────────────────────────│                         │                          │
```

---

## Stack Tecnologico

| Categoria | Tecnologia | Version | Proposito |
|-----------|------------|---------|-----------|
| **Framework** | Next.js | 16.x | App Router, SSR, API Routes |
| **Lenguaje** | TypeScript | 5.x | Tipado estatico |
| **Estilos** | Tailwind CSS | 4.x | Utility-first CSS |
| **i18n** | next-intl | 4.x | Internacionalizacion |
| **Temas** | next-themes | 0.4.x | Dark/Light mode |
| **Base de Datos** | Supabase (PostgreSQL) | - | Almacenamiento, Auth, RLS |
| **Email** | Resend | - | Envio de correos transaccionales |
| **Email Templates** | React Email | - | Plantillas de correo en React |
| **Validacion** | Zod | 3.x | Schema validation |
| **Formularios** | React Hook Form | 7.x | Form management |
| **PDF** | @react-pdf/renderer | 4.x | Generacion vectorial de PDFs |
| **QR Codes** | qrcode | 1.x | Generacion de QR codes |
| **ZIP** | JSZip | - | Empaquetado de multiples PDFs |
| **Iconos** | Lucide React | - | Iconografia |
| **Despliegue** | Vercel | - | Hosting, Edge Functions |

---

## Estructura del Proyecto

```
certigen/
├── public/                     # Assets estaticos
│   └── templates/              # Imagenes de plantillas
├── src/
│   ├── app/                    # App Router (Next.js 16+)
│   │   ├── [locale]/           # Rutas internacionalizadas
│   │   │   ├── layout.tsx      # Layout con i18n + temas
│   │   │   ├── page.tsx        # Home page
│   │   │   ├── admin/          # Panel de administracion
│   │   │   │   ├── page.tsx
│   │   │   │   └── auth/
│   │   │   │       └── page.tsx
│   │   │   ├── batch/          # Generacion en lote (CSV)
│   │   │   │   └── page.tsx
│   │   │   ├── generate/       # Generador de certificados
│   │   │   │   └── page.tsx
│   │   │   └── validate/       # Validador de certificados
│   │   │       └── page.tsx
│   │   ├── api/                # API Routes
│   │   │   ├── certificates/
│   │   │   │   ├── generate/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── send-email/
│   │   │   │   │   └── route.ts
│   │   │   │   └── validate/
│   │   │   │       └── [number]/
│   │   │   │           └── route.ts
│   │   │   └── integration/
│   │   │       └── route.ts
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Redirect to default locale
│   │   └── globals.css         # CSS variables + themes
│   ├── components/
│   │   ├── certificate/        # Componentes de certificados
│   │   │   ├── CertificateForm.tsx
│   │   │   ├── CertificatePreview.tsx
│   │   │   ├── CertificatePDF.tsx
│   │   │   ├── CertificateValidator.tsx
│   │   │   └── index.ts
│   │   ├── providers/
│   │   │   └── Providers.tsx   # ThemeProvider + AuthProvider
│   │   ├── shared/
│   │   │   ├── header.tsx      # Header con LanguageSelector + ThemeToggle
│   │   │   └── footer.tsx
│   │   └── ui/                 # Componentes UI base
│   │       ├── alert.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── LanguageSelector.tsx
│   │       ├── ThemeToggle.tsx
│   │       └── index.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── i18n/                   # Internacionalizacion
│   │   ├── config.ts           # Configuracion de locales
│   │   ├── request.ts          # next-intl server config
│   │   └── messages/           # Traducciones
│   │       ├── en.json
│   │       ├── de.json
│   │       ├── pl.json
│   │       ├── ru.json
│   │       ├── es.json
│   │       ├── he.json
│   │       ├── hu.json
│   │       ├── it.json
│   │       └── th.json
│   ├── lib/
│   │   ├── email/              # Configuracion de email
│   │   │   ├── certificate-email.tsx
│   │   │   ├── resend.ts
│   │   │   └── index.ts
│   │   ├── supabase/           # Cliente Supabase
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── certificates.ts
│   │   └── utils/
│   │       └── index.ts
│   ├── types/
│   │   ├── certificate.ts
│   │   └── database.ts
│   └── middleware.ts           # i18n + Security middleware
├── supabase/
│   └── migrations/
│       └── 001_initial.sql
├── .env.local.example
├── .gitignore
├── LICENSE
├── next.config.ts
├── package.json
├── README.md
└── tsconfig.json
```

---

## Instalacion

### Prerrequisitos

- Node.js 18.x o superior
- npm, yarn, o pnpm
- Cuenta en Supabase
- Cuenta en Resend (para emails)
- Cuenta en Vercel (para despliegue)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/gonzalezulises/certigen.git
cd certigen

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales

# 4. Ejecutar en desarrollo
npm run dev
```

---

## Configuracion

### Variables de Entorno

Crear archivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Application
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_VALIDATION_BASE_URL=https://tu-dominio.vercel.app/validate

# API Security
CERTIGEN_API_SECRET=tu-api-secret-seguro

# Resend Email (opcional - requerido para envio de emails)
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=CertiGen <onboarding@resend.dev>
```

### Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **Settings > API** y copiar las keys
3. Ejecutar la migracion SQL en **SQL Editor**

### Configurar Resend (para emails)

1. Crear cuenta en [resend.com](https://resend.com)
2. Obtener API key desde el dashboard
3. Agregar `RESEND_API_KEY` a las variables de entorno
4. (Opcional) Verificar dominio propio para usar email personalizado

**Nota:** Sin verificar dominio, usa `onboarding@resend.dev` como remitente.

---

## Uso

### Generacion Individual

1. Ir a `/{locale}/generate` (ej: `/en/generate`, `/es/generate`)
2. Completar el formulario:
   - Nombre de la organizacion (opcional)
   - Logo (opcional, PNG/JPG hasta 2MB)
   - Datos del estudiante
   - Datos del curso
   - Seleccionar plantilla
3. Click en "Generar Certificado"
4. Descargar PDF o Enviar por Email

### Generacion en Lote (CSV)

1. Ir a `/{locale}/batch` o click en "Generar en lote (CSV)" desde `/generate`
2. Preparar archivo CSV con columnas:
   ```csv
   nombre,email,calificacion,horas
   Juan Perez,juan@email.com,95,40
   Maria Garcia,maria@email.com,88,40
   Ana Lopez,ana@email.com,92,40
   ```
3. Subir el archivo CSV
4. Configurar datos comunes (curso, instructor, plantilla, logo)
5. Click en "Generar Certificados"
6. Descargar ZIP con todos los PDFs o Enviar por Email

### Cambiar Idioma

- Usar el selector de idioma en el header (icono de globo)
- La URL cambiara automaticamente al nuevo idioma
- Todas las traducciones se actualizan en tiempo real

### Cambiar Tema

- Usar el boton de tema en el header (icono de sol/luna)
- Cicla entre: Claro → Oscuro → Sistema
- La preferencia se guarda en el navegador

---

## API Reference

### Generar Certificado

```http
POST /api/certificates/generate
Content-Type: application/json
```

**Request Body:**
```json
{
  "student_name": "Juan Perez Garcia",
  "student_email": "juan@ejemplo.com",
  "course_name": "React Avanzado",
  "certificate_type": "completion",
  "instructor_name": "Maria Rodriguez",
  "hours": 40,
  "grade": 95,
  "issue_date": "2024-01-15",
  "organization_name": "Mi Empresa"
}
```

**Response:**
```json
{
  "success": true,
  "certificate": {
    "id": "uuid",
    "certificate_number": "CER-20240115-847362",
    "student_name": "Juan Perez Garcia",
    "course_name": "React Avanzado",
    "qr_code_url": "https://certigen.vercel.app/validate/CER-20240115-847362"
  }
}
```

### Enviar Certificado por Email

```http
POST /api/certificates/send-email
Content-Type: application/json
```

**Request Body:**
```json
{
  "to": "juan@ejemplo.com",
  "studentName": "Juan Perez Garcia",
  "courseName": "React Avanzado",
  "certificateNumber": "CER-20240115-847362",
  "certificateType": "completion",
  "issueDate": "2024-01-15",
  "organizationName": "Mi Empresa",
  "instructorName": "Maria Rodriguez",
  "hours": 40,
  "grade": 95,
  "pdfBase64": "JVBERi0xLjQK..."
}
```

### Validar Certificado

```http
GET /api/certificates/validate/{certificate_number}
```

**Response (Valido):**
```json
{
  "is_valid": true,
  "certificate": {
    "certificate_number": "CER-20240115-847362",
    "student_name": "Juan Perez Garcia",
    "course_name": "React Avanzado",
    "certificate_type": "completion",
    "issue_date": "2024-01-15T00:00:00Z"
  },
  "validation_count": 5
}
```

### API de Integracion (Requiere Autenticacion)

```http
POST /api/integration
Authorization: Bearer {API_SECRET}
Content-Type: application/json
```

---

## Base de Datos

### Esquema ER

```
┌─────────────────────┐       ┌─────────────────────────┐
│    certificates     │       │  certificate_templates  │
├─────────────────────┤       ├─────────────────────────┤
│ id (PK)             │       │ id (PK)                 │
│ certificate_number  │◀──────│ name                    │
│ student_name        │       │ html_template           │
│ student_email       │       │ css_styles              │
│ course_name         │       │ is_default              │
│ certificate_type    │       └─────────────────────────┘
│ issue_date          │
│ instructor_name     │       ┌─────────────────────────┐
│ hours               │       │ certificate_validations │
│ grade               │       ├─────────────────────────┤
│ qr_code_url         │       │ id (PK)                 │
│ is_active           │◀──────│ certificate_id (FK)     │
│ user_id             │       │ validated_at            │
│ created_at          │       │ validated_by_ip         │
└─────────────────────┘       │ is_valid                │
                              │ validation_method       │
                              └─────────────────────────┘
```

---

## Seguridad

### Medidas Implementadas

| Medida | Implementacion |
|--------|----------------|
| **HTTPS** | Forzado via Vercel + HSTS header |
| **Security Headers** | X-Frame-Options, CSP, X-Content-Type-Options |
| **Rate Limiting** | 60 requests/minuto por IP en API |
| **API Authentication** | Bearer token para endpoints de integracion |
| **Input Validation** | Zod schemas en todos los endpoints |
| **SQL Injection** | Prevenido por Supabase ORM |
| **XSS Protection** | CSP + sanitizacion de inputs |
| **RLS** | Row Level Security en Supabase |

---

## Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel --prod
```

### Variables de Entorno en Vercel

Configurar en **Project Settings > Environment Variables**:

| Variable | Requerida | Descripcion |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Si | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Si | Anon key de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Si | Service role key de Supabase |
| `NEXT_PUBLIC_APP_URL` | Si | URL de la aplicacion |
| `NEXT_PUBLIC_VALIDATION_BASE_URL` | Si | URL base para validacion |
| `CERTIGEN_API_SECRET` | Si | Secret para API de integracion |
| `RESEND_API_KEY` | No | API key de Resend (para emails) |
| `FROM_EMAIL` | No | Email remitente |

---

## Scripts Disponibles

```bash
npm run dev      # Desarrollo con hot reload
npm run build    # Build de produccion
npm run start    # Iniciar servidor de produccion
npm run lint     # Ejecutar ESLint
```

---

## Contribuir

1. Fork el repositorio
2. Crear rama de feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

---

## Licencia

MIT License - ver [LICENSE](LICENSE)

---

## Soporte

- **Issues**: [GitHub Issues](https://github.com/gonzalezulises/certigen/issues)
- **Documentacion**: Este README

---

## Changelog

### v3.1.1 (2024-12-25)
- **Fuentes corregidas** - Reemplazadas Merriweather y RobotoSlab que estaban corruptas (eran HTML en lugar de TTF)
- **QR en vista previa** - El configurador ahora muestra el codigo QR y numero de certificado en el preview
- **Error fontStyle italic** - Eliminado uso de italic en template creative (Sans no tiene variante italic)
- **Error borderRadius undefined** - Añadido manejo robusto para valores de radius no definidos
- **Estilos de esquinas** - Los templates classic y creative ahora manejan todos los estilos (none, simple, ornate, flourish)
- **Optional chaining** - Añadido a todos los accesos de config en el preview para evitar errores

### v3.1.0 (2024-12-25)
- **Correccion de opciones de configuracion** - Las opciones de colores, bordes y tipografia ahora se aplican correctamente al PDF
- **Valores por defecto robustos** - Todas las variables de diseño tienen valores por defecto para evitar errores
- **Nuevo tagline** - "Sistema de Generacion y Validacion de Certificados con QR" en 9 idiomas
- **Mejora en merge de configuracion** - Deep merge que filtra valores undefined
- **Templates actualizados** - Classic, Minimal y Creative con defaults locales

### v3.0.0 (2024-12-25)
- **Migracion a @react-pdf/renderer** - Generacion de PDFs 100% vectoriales
- **Nuevo configurador visual** - Personaliza cada aspecto del certificado en tiempo real
- **3 plantillas profesionales**:
  - **Classic**: Diseño tradicional con bordes ornamentados y sello
  - **Minimal**: Diseño limpio y moderno con espaciado generoso
  - **Creative**: Diseño artistico con patrones y flourishes
- **Sistema de tipografia avanzado** - 5 familias de fuentes embebidas
- **Ornamentos SVG** - Sellos, divisores y esquinas decorativas vectoriales
- **Configuracion completa**:
  - 7 colores personalizables
  - 5 fuentes para diferentes elementos
  - Bordes con 4 estilos y esquinas opcionales
  - Ornamentos con opacidad ajustable
  - Layout flexible (3 tamanos de papel, 2 orientaciones)
- **Schema TypeScript** - Tipos estrictos para toda la configuracion
- **Generacion de QR mejorada** - QR codes con colores personalizables

### v2.0.0 (2024-12-25)
- **Internacionalizacion completa** con 9 idiomas (EN, DE, PL, RU, ES, HE, HU, IT, TH)
- **Soporte RTL** para Hebreo
- **Sistema de temas** con modo claro/oscuro/sistema
- **Accesibilidad WCAG 2.1 AA**:
  - Skip link para navegacion por teclado
  - ARIA labels y roles
  - Focus visible mejorado
  - Soporte para `prefers-reduced-motion`
- **Selector de idioma** con banderas y nombres nativos
- **Toggle de tema** con ciclo claro/oscuro/sistema
- Fuentes especiales para Thai y Hebreo
- Header y Footer con soporte completo de i18n y dark mode
- Todas las paginas migradas a routing `[locale]`

### v1.2.0 (2024-12-25)
- Envio de certificados por email con PDF adjunto
- Envio masivo de emails en generacion por lote
- Integracion con Resend para delivery de emails
- Plantilla de email profesional con React Email

### v1.1.0 (2024-12-25)
- Generacion en lote desde archivos CSV
- Soporte para logo personalizado
- Seleccion de tamano de papel (A4/Legal)
- Descarga de multiples certificados como ZIP
- Mejoras en responsive design

### v1.0.0 (2024-12-24)
- Lanzamiento inicial
- Generacion de certificados con 3 plantillas
- Validacion por QR y numero
- API de integracion
- Panel de administracion
- Seguridad implementada (headers, rate limiting, RLS)
