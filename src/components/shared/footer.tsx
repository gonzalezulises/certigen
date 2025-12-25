'use client';

import Link from 'next/link';
import { Award, Github } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">
              CertiGen - Sistema de Certificados Verificables
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/validate"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Validar Certificado
            </Link>
            <Link
              href="https://github.com/your-username/certigen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            {currentYear} CertiGen. MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
