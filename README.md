# CertiGen

<div align="center">

![CertiGen Logo](https://img.shields.io/badge/CertiGen-v3.4.0-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=for-the-badge&logo=postgresql)
![pdf-lib](https://img.shields.io/badge/pdf--lib-Server--Side-green?style=for-the-badge)

**Sistema de Generacion y Validacion de Certificados con QR**

[Demo en Vivo](https://certigen-sandy.vercel.app) | [Reportar Bug](https://github.com/gonzalezulises/certigen/issues) | [Solicitar Feature](https://github.com/gonzalezulises/certigen/issues)

</div>

---

## Novedades v3.4.0

- **Neon PostgreSQL** - Migrado de Supabase a Neon serverless PostgreSQL
- **Drizzle ORM** - ORM type-safe para consultas a la base de datos
- **Edge Compatible** - Conexion HTTP serverless compatible con edge runtime
- **Sin Autenticacion** - Operacion simplificada en modo anonimo
- **Scripts de BD** - `npm run db:push`, `db:generate`, `db:studio`

### v3.3.0
- **Security Hardening** - IDs alta entropia, rate limiting, CSP con nonce, revocacion
- **Configuracion PDF Completa** - Todas las opciones del configurador ahora se aplican al PDF
- **7 Estilos de Borde** - none, simple, double, certificate, ornate, geometric, gradient
- **4 Estilos de Esquinas** - none, simple, ornate, flourish
- **Branding Completo** - Logo, firmas (simple/dual), nombre de organizacion

---

## Demo

**Produccion:** https://certigen-sandy.vercel.app

---

## Tabla de Contenidos

- [Caracteristicas](#caracteristicas)
- [Casos de Uso](#casos-de-uso)
- [Funcionalidades](#funcionalidades)
- [Arquitectura](#arquitectura)
- [Stack Tecnologico](#stack-tecnologico)
- [Instalacion](#instalacion)
- [Configuracion](#configuracion)
- [API Reference](#api-reference)
- [Despliegue](#despliegue)
- [Configuracion Post-Despliegue](#configuracion-post-despliegue)
- [Seguridad](#seguridad)
- [Changelog](#changelog)

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
| **PDF Server-Side** | Generacion con pdf-lib para maxima compatibilidad |
| **Generacion en Lote** | Genera multiples certificados desde CSV |
| **Envio por Email** | Envia certificados automaticamente por correo con PDF adjunto |
| **API REST** | Integracion con plataformas externas |
| **9 Idiomas** | ES, EN, DE, IT, PL, RU, HU, HE (RTL), TH |
| **Modo Oscuro** | Tema claro/oscuro/sistema |
| **Accesibilidad WCAG 2.1** | Cumple estandares de accesibilidad |

---

## Casos de Uso

### 1. Instituciones Educativas
**Escenario:** Universidad o academia que necesita emitir certificados de cursos completados.

```
Flujo:
1. Instructor accede a /generate
2. Completa datos del estudiante y curso
3. Selecciona plantilla "Classic" (formal)
4. Genera certificado con numero unico
5. Estudiante recibe PDF por email
6. Empleadores validan via QR
```

**Beneficios:**
- Certificados verificables digitalmente
- Reduce fraude de credenciales
- Proceso automatizado

### 2. Empresas de Capacitacion
**Escenario:** Empresa que ofrece cursos corporativos y necesita certificar empleados.

```
Flujo:
1. RH prepara CSV con lista de participantes
2. Accede a /batch
3. Sube CSV con nombres, emails, calificaciones
4. Selecciona plantilla corporativa
5. Genera todos los certificados
6. Descarga ZIP o envia por email masivo
```

**Beneficios:**
- Generacion masiva eficiente
- Logo corporativo personalizado
- Tracking de emisiones

### 3. Organizadores de Eventos
**Escenario:** Conferencia que otorga certificados de asistencia.

```
Flujo:
1. Organizador genera certificados post-evento
2. Usa plantilla "Creative" para diseño moderno
3. Incluye horas de capacitacion
4. Asistentes reciben certificados digitales
5. Validan autenticidad escaneando QR
```

**Beneficios:**
- Certificados instantaneos
- Sin costos de impresion
- Verificacion inmediata

### 4. Plataformas E-Learning (API)
**Escenario:** LMS que necesita generar certificados automaticamente al completar cursos.

```
Flujo:
1. Estudiante completa curso en LMS
2. LMS llama a POST /api/certificates/generate
3. API retorna numero de certificado
4. LMS llama a POST /api/certificates/generate-pdf
5. PDF se envia al estudiante
6. Certificado queda registrado en BD
```

**Ejemplo de integracion:**
```javascript
// Al completar curso
const response = await fetch('https://certigen.vercel.app/api/certificates/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student_name: 'Juan Perez',
    student_email: 'juan@email.com',
    course_name: 'React Avanzado',
    certificate_type: 'completion',
    hours: 40,
    grade: 95
  })
});

const { certificate } = await response.json();
// certificate.certificate_number = "CER-20251226-123456"
```

### 5. Validacion de Terceros
**Escenario:** Empleador verifica autenticidad de certificado presentado por candidato.

```
Flujo:
1. Candidato presenta certificado PDF
2. Empleador escanea QR con celular
3. Sistema muestra datos del certificado
4. Confirma: nombre, curso, fecha, valido
5. Empleador valida credencial
```

---

## Funcionalidades

### Generacion Individual

1. **Formulario de datos:**
   - Nombre del estudiante (requerido)
   - Email del estudiante (opcional, para envio)
   - Nombre del curso (requerido)
   - Tipo de certificado (completion/participation)
   - Horas del curso
   - Calificacion (0-100)
   - Nombre del instructor
   - Fecha de emision

2. **Configurador visual:**
   - **Colores:** Primario, secundario, acento, fondo, texto, bordes
   - **Tipografia:** Fuente de titulo, cuerpo, acento, escala
   - **Bordes:** Estilo, ancho, radio, esquinas decorativas
   - **Ornamentos:** Divisores, sellos, patron de fondo
   - **Contenido:** Mostrar/ocultar elementos

3. **Salida:**
   - Vista previa en tiempo real
   - Descarga PDF
   - Envio por email

### Generacion en Lote (CSV)

**Formato CSV requerido:**
```csv
nombre,email,calificacion,horas
Juan Perez,juan@email.com,95,40
Maria Garcia,maria@email.com,88,40
Ana Lopez,ana@email.com,92,40
```

**Opciones:**
- Descarga ZIP con todos los PDFs
- Envio individual por email
- Configuracion comun para todos

### Validacion de Certificados

**Via Web:**
1. Acceder a `/validate`
2. Ingresar numero de certificado
3. Ver datos y estado de validacion

**Via QR:**
1. Escanear QR del certificado
2. Redirige a pagina de validacion
3. Muestra datos verificados

**Via API:**
```http
GET /api/certificates/validate/CER-20251226-123456
```

### Internacionalizacion

| Idioma | Codigo | Direccion |
|--------|--------|-----------|
| Espanol | `es` | LTR |
| English | `en` | LTR |
| Deutsch | `de` | LTR |
| Italiano | `it` | LTR |
| Polski | `pl` | LTR |
| Русский | `ru` | LTR |
| Magyar | `hu` | LTR |
| עברית | `he` | **RTL** |
| ไทย | `th` | LTR |

---

## Arquitectura

### Diagrama de Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Inicio    │  │  Generador  │  │    Lote     │  │Validador│ │
│  │ /[locale]   │  │  /generate  │  │   /batch    │  │/validate│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
│                                   │                              │
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
│  │ /api/certificates│  │ /api/certificates│  │ /api/certificates│ │
│  │    /generate    │  │  /generate-pdf  │  │   /send-email   │  │
│  │  (Drizzle ORM)  │  │   (pdf-lib)     │  │    (Resend)     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌─────────────────┐
│  NEON POSTGRES   │ │    UPSTASH   │ │     RESEND      │
│  ┌────────────┐  │ │    REDIS     │ │                 │
│  │ Drizzle    │  │ │              │ │ Email Delivery  │
│  │   ORM      │  │ │ Rate Limit   │ │                 │
│  └────────────┘  │ │ 10/5/20 rpm  │ │ • PDFs adjuntos │
│                  │ │              │ │ • HTML template │
│  Tablas:         │ └──────────────┘ └─────────────────┘
│  • certificates  │
│  • certificate_  │
│    validations   │
│  • certificate_  │
│    templates     │
│  • api_keys      │
└──────────────────┘
```

### Flujo de Generacion PDF

```
Usuario                    Frontend                    API
   │                          │                         │
   │ 1. Completa formulario   │                         │
   │────────────────────────▶│                         │
   │                          │ 2. POST /api/generate   │
   │                          │────────────────────────▶│
   │                          │                         │ 3. Drizzle → Neon
   │                          │◀────────────────────────│
   │                          │                         │
   │                          │ 4. POST /api/generate-pdf
   │                          │────────────────────────▶│
   │                          │                         │ 5. pdf-lib genera PDF
   │                          │                         │    + QR con qrcode
   │                          │◀────────────────────────│
   │ 6. Recibe PDF base64     │                         │
   │◀────────────────────────│                         │
   │                          │                         │
   │ 7. Descarga PDF          │                         │
```

---

## Stack Tecnologico

| Categoria | Tecnologia | Version | Proposito |
|-----------|------------|---------|-----------|
| **Framework** | Next.js | 16.1.1 | App Router, SSR, API Routes |
| **UI** | React | 19.2.3 | Interfaz de usuario |
| **Lenguaje** | TypeScript | 5.x | Tipado estatico |
| **Estilos** | Tailwind CSS | 4.x | Utility-first CSS |
| **Base de Datos** | Neon PostgreSQL | 17 | Serverless PostgreSQL |
| **ORM** | Drizzle ORM | 0.45.x | Type-safe SQL queries |
| **PDF** | pdf-lib | 1.17.1 | Generacion server-side de PDFs |
| **QR** | qrcode | 1.5.4 | Generacion de codigos QR |
| **i18n** | next-intl | 4.x | Internacionalizacion |
| **Temas** | next-themes | 0.4.x | Dark/Light mode |
| **Rate Limit** | Upstash Redis | - | Rate limiting distribuido |
| **Email** | Resend | - | Envio de correos |
| **Validacion** | Zod | 4.x | Schema validation |

---

## Instalacion

### Prerrequisitos

- Node.js 20.x o superior (recomendado usar nvm)
- npm, yarn, o pnpm
- Cuenta en Supabase
- Cuenta en Resend (para emails)

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

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Application
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_BASE_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_VALIDATION_BASE_URL=https://tu-dominio.vercel.app/validate

# API Security
CERTIGEN_API_SECRET=tu-api-secret-seguro

# Rate Limiting (opcional, recomendado)
UPSTASH_REDIS_REST_URL=https://tu-instancia.upstash.io
UPSTASH_REDIS_REST_TOKEN=tu-upstash-token

# Resend Email (opcional)
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=CertiGen <certificados@tu-dominio.com>
```

---

## API Reference

### Registrar Certificado

```http
POST /api/certificates/generate
Content-Type: application/json
```

**Request:**
```json
{
  "student_name": "Juan Perez Garcia",
  "student_email": "juan@ejemplo.com",
  "course_name": "React Avanzado",
  "certificate_type": "completion",
  "instructor_name": "Maria Rodriguez",
  "hours": 40,
  "grade": 95,
  "issue_date": "2024-12-26"
}
```

**Response:**
```json
{
  "success": true,
  "certificate": {
    "id": "uuid",
    "certificate_number": "CER-20241226-847362",
    "student_name": "Juan Perez Garcia",
    "course_name": "React Avanzado"
  },
  "persisted": true
}
```

### Generar PDF

```http
POST /api/certificates/generate-pdf
Content-Type: application/json
```

**Request:**
```json
{
  "data": {
    "certificate_number": "CER-20241226-847362",
    "student_name": "Juan Perez Garcia",
    "course_name": "React Avanzado",
    "certificate_type": "completion",
    "issue_date": "2024-12-26",
    "instructor_name": "Maria Rodriguez",
    "hours": 40,
    "grade": 95
  },
  "config": {
    "colors": {
      "primary": "#1e3a5f",
      "secondary": "#2c5282",
      "accent": "#d4af37",
      "background": "#ffffff",
      "text": "#1a1a2e",
      "textMuted": "#4a5568",
      "border": "#1e3a5f"
    },
    "border": {
      "style": "certificate",
      "width": "medium",
      "cornerStyle": "ornate",
      "padding": "normal"
    },
    "layout": {
      "orientation": "landscape",
      "paperSize": "A4",
      "qrPosition": "bottom-right",
      "qrSize": "medium",
      "signaturePosition": "center",
      "showSignatureLine": true
    },
    "content": {
      "showSubtitle": true,
      "showHours": true,
      "showGrade": true,
      "showDate": true,
      "showInstructor": true,
      "showCertificateNumber": true,
      "showQR": true,
      "headerText": "CERTIFICADO DE",
      "subtitleTemplate": "COMPLETACION"
    },
    "ornaments": {
      "dividerStyle": "ornate"
    },
    "branding": {
      "organizationName": "Mi Organizacion",
      "signatureLabel": "Director Academico"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "pdfDataUrl": "data:application/pdf;base64,JVBERi0...",
  "pdfBase64": "JVBERi0..."
}
```

### Validar Certificado

```http
GET /api/certificates/validate/{certificate_number}
```

**Response:**
```json
{
  "is_valid": true,
  "certificate": {
    "certificate_number": "CER-20241226-847362",
    "student_name": "Juan Perez Garcia",
    "course_name": "React Avanzado",
    "certificate_type": "completion",
    "issue_date": "2024-12-26T00:00:00Z"
  },
  "validation_count": 5
}
```

### Enviar por Email

```http
POST /api/certificates/send-email
Content-Type: application/json
```

**Request:**
```json
{
  "to": "juan@ejemplo.com",
  "studentName": "Juan Perez Garcia",
  "courseName": "React Avanzado",
  "certificateNumber": "CER-20241226-847362",
  "pdfBase64": "JVBERi0..."
}
```

---

## Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar a produccion
vercel --prod
```

### Variables de Entorno en Vercel

Configurar en **Project Settings > Environment Variables**:

| Variable | Requerida |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Si |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Si |
| `SUPABASE_SERVICE_ROLE_KEY` | Si |
| `NEXT_PUBLIC_APP_URL` | Si |
| `NEXT_PUBLIC_BASE_URL` | Si |
| `NEXT_PUBLIC_VALIDATION_BASE_URL` | Si |
| `CERTIGEN_API_SECRET` | Si |
| `UPSTASH_REDIS_REST_URL` | No (recomendado) |
| `UPSTASH_REDIS_REST_TOKEN` | No (recomendado) |
| `RESEND_API_KEY` | No |
| `FROM_EMAIL` | No |

---

## Estructura del Proyecto

```
certigen/
├── public/
│   └── fonts/                  # Fuentes TTF
├── src/
│   ├── app/
│   │   ├── [locale]/           # Rutas internacionalizadas
│   │   │   ├── generate/       # Generador de certificados
│   │   │   ├── batch/          # Generacion en lote
│   │   │   ├── validate/       # Validador
│   │   │   └── admin/          # Panel admin
│   │   └── api/
│   │       └── certificates/
│   │           ├── generate/       # Registrar certificado
│   │           ├── generate-pdf/   # Generar PDF (pdf-lib)
│   │           ├── send-email/     # Enviar por email
│   │           └── validate/       # Validar certificado
│   ├── components/
│   │   ├── certificate/        # Componentes de certificados
│   │   ├── configurator/       # Configurador visual
│   │   ├── shared/             # Header, Footer
│   │   └── ui/                 # Componentes UI base
│   ├── i18n/
│   │   └── messages/           # Traducciones (9 idiomas)
│   ├── lib/
│   │   ├── email/              # Configuracion Resend
│   │   ├── pdf/                # Generacion PDF
│   │   └── supabase/           # Cliente Supabase
│   └── types/                  # Tipos TypeScript
├── .env.local.example
├── package.json
└── README.md
```

---

## Scripts

```bash
npm run dev      # Desarrollo con hot reload
npm run build    # Build de produccion
npm run start    # Iniciar servidor de produccion
npm run lint     # Ejecutar ESLint
```

---

## Configuracion Post-Despliegue

### 1. Migracion Supabase (Requerido para revocacion)

Ejecuta en **Supabase Dashboard > SQL Editor**:

```sql
-- Agregar columnas de revocacion
ALTER TABLE certificates
ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS revocation_reason TEXT;

-- Indice para busquedas rapidas
CREATE INDEX IF NOT EXISTS idx_certificates_revoked_at
ON certificates(revoked_at) WHERE revoked_at IS NOT NULL;
```

### 2. Upstash Redis (Recomendado para rate limiting)

1. Crear cuenta en [https://console.upstash.com/](https://console.upstash.com/)
2. **Create Database**:
   - Nombre: `certigen-ratelimit`
   - Region: `us-east-1` (cercana a Vercel)
   - Tipo: Regional
3. Copiar credenciales REST
4. Agregar en **Vercel > Project Settings > Environment Variables**:

| Variable | Valor |
|----------|-------|
| `UPSTASH_REDIS_REST_URL` | `https://xxx.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | `AXxxxx...` |

5. Redesplegar: `vercel --prod`

### 3. Verificar Rate Limiting

```bash
# Debe retornar 429 despues de 10 requests en 1 minuto
for i in {1..12}; do
  curl -s -o /dev/null -w "%{http_code} " \
    https://certigen-sandy.vercel.app/api/certificates/validate/CER-TEST
done
```

---

## Seguridad

Para documentacion completa de seguridad, ver [SECURITY.md](SECURITY.md).

| Medida | Implementacion |
|--------|----------------|
| **IDs Alta Entropia** | ~60 bits con `crypto.randomBytes` |
| **Rate Limiting** | Upstash Redis (10/5/20 req/min) |
| **CSP con Nonce** | Script loading con nonce + strict-dynamic |
| **Revocacion** | Endpoint admin para revocar certificados |
| **Privacidad** | PII minimo en validacion, X-Robots-Tag |
| **HTTPS** | Forzado via Vercel |
| **Security Headers** | HSTS, X-Frame-Options, CSP |
| **Input Validation** | Zod schemas |
| **SQL Injection** | Prevenido por Supabase ORM |
| **XSS Protection** | CSP + sanitizacion |
| **RLS** | Row Level Security en Supabase |

---

## Changelog

### v3.3.0 (2025-12-28)
- **Security Hardening** - IDs alta entropia (~60 bits), rate limiting Upstash, CSP con nonce
- **Revocacion de certificados** - Endpoint admin para revocar certificados fraudulentos
- **Proteccion de privacidad** - PII minimo en validacion, X-Robots-Tag header
- **Configuracion PDF completa** - Todas las opciones del configurador visual se aplican al PDF generado
- **Estilos de borde** - 7 estilos: none, simple, double, certificate, ornate, geometric, gradient
- **Estilos de esquinas** - 4 estilos: none, simple, ornate, flourish
- **Branding** - Soporte para logo, firmas (simple/dual), nombre de organizacion
- **Layout configurable** - Orientacion, tamano de pagina (A4/Letter/Legal), posiciones
- **Posicion QR** - 3 posiciones (bottom-left, bottom-center, bottom-right) y 3 tamanos
- **Divisores** - 4 estilos: none, simple, ornate, dots
- **OAuth preparado** - Componentes para Google/GitHub OAuth (requiere config en Supabase)
- **Node.js 20** - Actualizado requisito minimo a Node.js 20.x
- **Auto-descarga** - PDF se descarga automaticamente en modo anonimo

### v3.2.0 (2024-12-26)
- **Generacion PDF server-side** - Migrado de `@react-pdf/renderer` a `pdf-lib` para compatibilidad con React 19
- **Solucionado error React 19** - "Cannot read properties of undefined (reading 'map')" en font encoding
- **API /api/certificates/generate-pdf** - Nuevo endpoint para generacion de PDFs
- **QR codes embebidos** - Codigos QR generados con `qrcode` e incrustados en PDF
- **Rendimiento mejorado** - PDFs generados en ~400ms server-side

### v3.1.1 (2024-12-25)
- Vista previa con QR en configurador
- Fuentes corregidas (Merriweather, RobotoSlab)
- Estilos de esquinas funcionando
- Manejo robusto de valores undefined

### v3.1.0 (2024-12-25)
- Correccion de opciones de configuracion
- Valores por defecto robustos
- Deep merge de configuracion

### v3.0.0 (2024-12-25)
- Migracion a @react-pdf/renderer
- Nuevo configurador visual
- 3 plantillas profesionales (Classic, Minimal, Creative)
- Sistema de tipografia avanzado
- Ornamentos SVG

### v2.0.0 (2024-12-25)
- Internacionalizacion completa (9 idiomas)
- Soporte RTL para Hebreo
- Sistema de temas (claro/oscuro/sistema)
- Accesibilidad WCAG 2.1 AA

### v1.2.0 (2024-12-25)
- Envio de certificados por email
- Integracion con Resend

### v1.1.0 (2024-12-25)
- Generacion en lote desde CSV
- Soporte para logo personalizado
- Descarga como ZIP

### v1.0.0 (2024-12-24)
- Lanzamiento inicial
- 3 plantillas de certificados
- Validacion por QR
- API de integracion

---

## Licencia

MIT License - ver [LICENSE](LICENSE)

---

## Soporte

- **Issues**: [GitHub Issues](https://github.com/gonzalezulises/certigen/issues)
- **Autor**: [Ulises Gonzalez](https://github.com/gonzalezulises)
