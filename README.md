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
| **Logo Personalizado** | Sube el logo de tu organizacion |
| **Tamano de Papel** | Soporta A4 y Legal horizontal |
| **Exportacion PDF** | Descarga certificados en formato PDF de alta calidad |
| **Generacion en Lote** | Genera multiples certificados desde CSV |
| **Envio por Email** | Envia certificados automaticamente por correo con PDF adjunto |
| **API REST** | Integracion con plataformas externas |
| **Panel Admin** | Gestion y monitoreo de certificados |

### Modos de Operacion

1. **Individual**: Genera certificados uno por uno con vista previa en tiempo real
2. **Lote (CSV)**: Sube un archivo CSV para generar multiples certificados
3. **API**: Genera certificados automaticamente desde otras plataformas

---

## Arquitectura

### Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Inicio    │  │  Generador  │  │    Lote     │  │Validador│ │
│  │     /       │  │  /generate  │  │   /batch    │  │/validate│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
│         │                │                │              │       │
│         └────────────────┴────────────────┴──────────────┘       │
│                                   ▼                              │
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
│  │ /api/certificates│  │ /api/certificates│  │ /api/integration│  │
│  │    /generate    │  │   /send-email   │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    MIDDLEWARE                             │   │
│  │  • Security Headers  • Rate Limiting  • Auth Validation   │   │
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
| **Base de Datos** | Supabase (PostgreSQL) | - | Almacenamiento, Auth, RLS |
| **Email** | Resend | - | Envio de correos transaccionales |
| **Email Templates** | React Email | - | Plantillas de correo en React |
| **Validacion** | Zod | 3.x | Schema validation |
| **Formularios** | React Hook Form | 7.x | Form management |
| **PDF** | jsPDF + html2canvas | - | Generacion de PDFs |
| **ZIP** | JSZip | - | Empaquetado de multiples PDFs |
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
│   │   │   ├── batch/          # Generacion en lote (CSV)
│   │   │   │   └── page.tsx
│   │   │   ├── generate/       # Generador de certificados
│   │   │   │   └── page.tsx
│   │   │   └── validate/       # Validador de certificados
│   │   │       ├── page.tsx
│   │   │       └── [number]/
│   │   │           └── page.tsx
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
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── certificate/        # Componentes de certificados
│   │   │   ├── CertificateForm.tsx
│   │   │   ├── CertificatePreview.tsx
│   │   │   ├── CertificatePDF.tsx
│   │   │   ├── CertificateValidator.tsx
│   │   │   └── index.ts
│   │   ├── shared/
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
│   │   ├── email/              # Configuracion de email
│   │   │   ├── certificate-email.tsx  # Plantilla de email
│   │   │   ├── resend.ts       # Cliente Resend
│   │   │   └── index.ts
│   │   ├── supabase/           # Cliente Supabase
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── certificates.ts
│   │   └── utils/
│   │       └── index.ts
│   ├── types/
│   │   ├── certificate.ts      # Tipos de certificados
│   │   └── database.ts
│   └── middleware.ts
├── supabase/
│   └── migrations/
│       └── 001_initial.sql
├── .env.local.example
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

1. Ir a `/generate`
2. Completar el formulario:
   - Nombre de la organizacion (opcional)
   - Logo (opcional, PNG/JPG hasta 2MB)
   - Datos del estudiante
   - Datos del curso
   - Seleccionar plantilla
3. Click en "Generar Certificado"
4. Descargar PDF o Enviar por Email

### Generacion en Lote (CSV)

1. Ir a `/batch` o click en "Generar en lote (CSV)" desde `/generate`
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

### Tamanos de Papel

| Formato | Dimensiones | Uso Recomendado |
|---------|-------------|-----------------|
| **A4 Horizontal** | 297mm x 210mm | Estandar internacional |
| **Legal Horizontal** | 355.6mm x 215.9mm | Estados Unidos |

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

**Response:**
```json
{
  "success": true,
  "messageId": "msg_xxxxxx"
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
│ created_at          │       │ validated_at            │
└─────────────────────┘       │ validated_by_ip         │
                              │ is_valid                │
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
