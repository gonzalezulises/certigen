# CertiGen

Sistema de Generacion y Validacion de Certificados Digitales con codigo QR verificable.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gonzalezulises/certigen)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Demo

**Produccion:** https://certigen-sandy.vercel.app

---

## Tabla de Contenidos

- [Caracteristicas](#caracteristicas)
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
| **3 Plantillas** | Elegante, Minimalista y Corporativa |
| **Exportacion PDF** | Descarga certificados en formato PDF de alta calidad |
| **API REST** | Integracion con plataformas externas |
| **Panel Admin** | Gestion y monitoreo de certificados |

### Modos de Operacion

1. **Standalone**: Aplicacion web independiente para generar certificados manualmente
2. **Integrado**: API para generar certificados automaticamente desde otras plataformas

---

## Arquitectura

### Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Inicio    │  │  Generador  │  │  Validador  │              │
│  │     /       │  │  /generate  │  │  /validate  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Next.js App Router (React 19)                │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐          │   │
│  │  │ Components │  │   Hooks    │  │   Utils    │          │   │
│  │  └────────────┘  └────────────┘  └────────────┘          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Next.js)                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ /api/certificates│  │ /api/validate   │  │ /api/integration│  │
│  │    /generate    │  │   /[number]     │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    MIDDLEWARE                             │   │
│  │  • Security Headers  • Rate Limiting  • Auth Validation   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ PostgreSQL  │  │    Auth     │  │   Storage   │              │
│  │  Database   │  │   (JWT)     │  │   (Files)   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  Tablas: certificates, certificate_templates,                    │
│          certificate_validations, eduplatform_integration        │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de Generacion de Certificados

```
Usuario                    Frontend                    API                     Supabase
   │                          │                         │                          │
   │ 1. Completa formulario   │                         │                          │
   │────────────────────────▶│                         │                          │
   │                          │                         │                          │
   │                          │ 2. POST /api/generate   │                          │
   │                          │────────────────────────▶│                          │
   │                          │                         │                          │
   │                          │                         │ 3. Genera ID unico       │
   │                          │                         │ 4. INSERT certificate    │
   │                          │                         │────────────────────────▶│
   │                          │                         │                          │
   │                          │                         │◀────────────────────────│
   │                          │                         │ 5. Retorna certificado   │
   │                          │◀────────────────────────│                          │
   │                          │                         │                          │
   │ 6. Muestra preview + QR  │                         │                          │
   │◀────────────────────────│                         │                          │
   │                          │                         │                          │
   │ 7. Descarga PDF          │                         │                          │
   │◀────────────────────────│                         │                          │
```

### Flujo de Validacion

```
Visitante                  Frontend                    API                     Supabase
   │                          │                         │                          │
   │ 1. Escanea QR / Ingresa  │                         │                          │
   │    numero de certificado │                         │                          │
   │────────────────────────▶│                         │                          │
   │                          │                         │                          │
   │                          │ 2. GET /api/validate/X  │                          │
   │                          │────────────────────────▶│                          │
   │                          │                         │                          │
   │                          │                         │ 3. SELECT certificate    │
   │                          │                         │────────────────────────▶│
   │                          │                         │                          │
   │                          │                         │◀────────────────────────│
   │                          │                         │                          │
   │                          │                         │ 4. INSERT validation log │
   │                          │                         │────────────────────────▶│
   │                          │                         │                          │
   │                          │◀────────────────────────│                          │
   │ 5. Muestra resultado     │                         │                          │
   │◀────────────────────────│                         │                          │
```

---

## Stack Tecnologico

| Categoria | Tecnologia | Version | Proposito |
|-----------|------------|---------|-----------|
| **Framework** | Next.js | 16.x | App Router, SSR, API Routes |
| **Lenguaje** | TypeScript | 5.x | Tipado estatico |
| **Estilos** | Tailwind CSS | 4.x | Utility-first CSS |
| **Base de Datos** | Supabase (PostgreSQL) | - | Almacenamiento, Auth, RLS |
| **Validacion** | Zod | 3.x | Schema validation |
| **Formularios** | React Hook Form | 7.x | Form management |
| **PDF** | jsPDF + html2canvas | - | Generacion de PDFs |
| **QR Codes** | react-qr-code | - | Generacion de QR |
| **Iconos** | Lucide React | - | Iconografia |
| **Despliegue** | Vercel | - | Hosting, Edge Functions |

---

## Estructura del Proyecto

```
certigen/
├── public/                     # Assets estaticos
│   └── templates/              # Imagenes de plantillas
├── src/
│   ├── app/                    # App Router (Next.js 14+)
│   │   ├── (standalone)/       # Grupo de rutas standalone
│   │   │   ├── admin/          # Panel de administracion
│   │   │   │   └── page.tsx
│   │   │   ├── generate/       # Generador de certificados
│   │   │   │   └── page.tsx
│   │   │   └── validate/       # Validador de certificados
│   │   │       ├── page.tsx
│   │   │       └── [number]/   # Validacion por URL directa
│   │   │           └── page.tsx
│   │   ├── api/                # API Routes
│   │   │   ├── certificates/
│   │   │   │   ├── generate/
│   │   │   │   │   └── route.ts
│   │   │   │   └── validate/
│   │   │   │       └── [number]/
│   │   │   │           └── route.ts
│   │   │   └── integration/
│   │   │       └── route.ts
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Pagina de inicio
│   │   └── globals.css         # Estilos globales
│   ├── components/
│   │   ├── certificate/        # Componentes de certificados
│   │   │   ├── CertificateForm.tsx
│   │   │   ├── CertificatePreview.tsx
│   │   │   ├── CertificatePDF.tsx
│   │   │   ├── CertificateValidator.tsx
│   │   │   └── index.ts
│   │   ├── shared/             # Componentes compartidos
│   │   │   ├── header.tsx
│   │   │   └── footer.tsx
│   │   └── ui/                 # Componentes UI base
│   │       ├── alert.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       └── index.ts
│   ├── lib/
│   │   ├── supabase/           # Cliente Supabase
│   │   │   ├── client.ts       # Cliente browser
│   │   │   ├── server.ts       # Cliente server
│   │   │   └── certificates.ts # Funciones de certificados
│   │   └── utils/
│   │       └── index.ts        # Utilidades generales
│   ├── types/
│   │   ├── certificate.ts      # Tipos de certificados
│   │   └── database.ts         # Tipos de Supabase
│   └── middleware.ts           # Middleware de seguridad
├── supabase/
│   └── migrations/
│       └── 001_initial.sql     # Migracion inicial
├── .env.local.example          # Ejemplo de variables
├── .gitignore
├── LICENSE
├── next.config.ts
├── package.json
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## Instalacion

### Prerrequisitos

- Node.js 18.x o superior
- npm, yarn, o pnpm
- Cuenta en Supabase
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
```

### Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **Settings > API** y copiar las keys
3. Ejecutar la migracion SQL:

```bash
# Con Supabase CLI
supabase login
supabase link --project-ref tu-project-ref
supabase db push
```

O manualmente en **SQL Editor** ejecutar el contenido de `supabase/migrations/001_initial.sql`

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
│ created_at          │       │ validated_at            │
└─────────────────────┘       │ validated_by_ip         │
                              │ is_valid                │
                              │ validation_method       │
                              └─────────────────────────┘
```

### Tablas Principales

| Tabla | Descripcion |
|-------|-------------|
| `certificates` | Almacena todos los certificados generados |
| `certificate_templates` | Plantillas HTML/CSS para certificados |
| `certificate_validations` | Log de todas las validaciones realizadas |
| `eduplatform_integration` | Configuracion de integraciones externas |
| `api_keys` | Claves API para acceso programatico |

### Row Level Security (RLS)

La base de datos implementa RLS para seguridad:

- **Certificados**: Lectura publica (solo activos), escritura autenticada
- **Validaciones**: Lectura y escritura publica
- **Plantillas**: Solo lectura publica
- **Integraciones**: Solo service_role

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
  "issue_date": "2024-01-15"
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

**Response (Invalido):**
```json
{
  "is_valid": false,
  "error": "Certificado no encontrado"
}
```

### API de Integracion (Requiere Autenticacion)

```http
POST /api/integration
Authorization: Bearer {API_SECRET}
Content-Type: application/json
```

**Request:**
```json
{
  "student_name": "Juan Perez",
  "student_email": "juan@ejemplo.com",
  "course_name": "React Avanzado",
  "certificate_type": "completion",
  "hours": 40,
  "grade": 95
}
```

**Response:**
```json
{
  "success": true,
  "certificate": {
    "id": "uuid",
    "certificate_number": "CER-20240115-847362",
    "validation_url": "https://certigen.vercel.app/validate/CER-20240115-847362"
  }
}
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
| **CSRF** | Proteccion nativa de Next.js |
| **RLS** | Row Level Security en Supabase |

### Headers de Seguridad

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; ...
```

### Buenas Practicas

1. **Variables de entorno**: Nunca commitear `.env.local`
2. **API Keys**: Rotar regularmente
3. **Service Role Key**: Solo usar en servidor, nunca exponer al cliente
4. **Validacion**: Validar todos los inputs en frontend y backend

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

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_VALIDATION_BASE_URL`
- `CERTIGEN_API_SECRET`

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

### Guia de Estilo

- Usar TypeScript estricto
- Seguir convenciones de Next.js App Router
- Componentes funcionales con hooks
- Nombres en ingles para codigo, espanol para UI

---

## Licencia

MIT License - ver [LICENSE](LICENSE)

---

## Soporte

- **Issues**: [GitHub Issues](https://github.com/gonzalezulises/certigen/issues)
- **Documentacion**: Este README

---

## Changelog

### v1.0.0 (2024-12-24)
- Lanzamiento inicial
- Generacion de certificados con 3 plantillas
- Validacion por QR y numero
- API de integracion
- Panel de administracion
- Seguridad implementada (headers, rate limiting, RLS)
