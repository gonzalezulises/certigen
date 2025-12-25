import Link from 'next/link';
import { Award, FileCheck, Shield, Zap, Code2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-800/50 px-4 py-2 rounded-full text-sm mb-6">
              <Shield className="h-4 w-4" />
              <span>100% Open Source - MIT License</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Certificados Digitales
              <span className="text-yellow-400"> Verificables</span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Genera certificados profesionales con codigo QR unico para validacion instantanea.
              Perfecto para cursos, talleres y programas educativos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/generate">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold gap-2">
                  <Award className="h-5 w-5" />
                  Generar Certificado
                </Button>
              </Link>
              <Link href="/validate">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                  <FileCheck className="h-5 w-5" />
                  Validar Certificado
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Caracteristicas Principales
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para crear y gestionar certificados digitales de manera profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Award className="h-8 w-8 text-blue-600" />}
              title="IDs Unicos Verificables"
              description="Cada certificado tiene un numero unico (CER-XXXXXXXX-XXXXXX) que permite validar su autenticidad en cualquier momento."
            />
            <FeatureCard
              icon={<FileCheck className="h-8 w-8 text-blue-600" />}
              title="Validacion por QR"
              description="Codigo QR integrado que permite validacion instantanea escaneando con cualquier smartphone."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-blue-600" />}
              title="Generacion Rapida"
              description="Crea certificados profesionales en segundos con nuestras plantillas prediseniadas."
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8 text-blue-600" />}
              title="Acceso Global"
              description="Los certificados se pueden validar desde cualquier lugar del mundo, en cualquier momento."
            />
            <FeatureCard
              icon={<Code2 className="h-8 w-8 text-blue-600" />}
              title="API de Integracion"
              description="Integra la generacion de certificados con tu plataforma educativa mediante nuestra API REST."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-blue-600" />}
              title="Seguro y Confiable"
              description="Sistema antifraude con registro de validaciones y posibilidad de revocar certificados."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tres simples pasos para crear certificados verificables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StepCard
              number={1}
              title="Completa el Formulario"
              description="Ingresa los datos del estudiante, curso y selecciona una plantilla."
            />
            <StepCard
              number={2}
              title="Genera el Certificado"
              description="El sistema crea un ID unico y genera el certificado con codigo QR."
            />
            <StepCard
              number={3}
              title="Descarga y Comparte"
              description="Descarga el PDF y compartelo. Cualquiera puede validarlo."
            />
          </div>

          <div className="text-center mt-12">
            <Link href="/generate">
              <Button size="lg" className="gap-2">
                <Award className="h-5 w-5" />
                Comenzar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Integracion con tu Plataforma
                </h2>
                <p className="text-gray-600 mb-6">
                  CertiGen puede integrarse facilmente con tu plataforma educativa existente.
                  Genera certificados automaticamente cuando tus estudiantes completen sus cursos.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-blue-600 rounded-full" />
                    API REST documentada
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-blue-600 rounded-full" />
                    Webhooks para automatizacion
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-blue-600 rounded-full" />
                    Componentes React reutilizables
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-blue-600 rounded-full" />
                    Soporte para multiples plantillas
                  </li>
                </ul>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 text-sm font-mono text-green-400 overflow-x-auto">
                <pre>{`// Ejemplo de integracion
const response = await fetch(
  'https://certigen.vercel.app/api/integration',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      student_name: 'Juan Perez',
      course_name: 'React Avanzado',
      certificate_type: 'completion'
    })
  }
);

const { certificate } = await response.json();
console.log(certificate.certificate_number);
// => CER-20240115-847362`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Listo para empezar?
          </h2>
          <p className="text-blue-200 mb-8 max-w-xl mx-auto">
            Genera tu primer certificado verificable en menos de un minuto. Sin registro requerido.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 gap-2">
                <Award className="h-5 w-5" />
                Generar Certificado
              </Button>
            </Link>
            <a
              href="https://github.com/gonzalezulises/certigen"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                <Code2 className="h-5 w-5" />
                Ver en GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-xl mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
