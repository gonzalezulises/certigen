'use client';

import Link from 'next/link';
import { Award, Github, Linkedin, Globe, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6">
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
              href="https://github.com/gonzalezulises/certigen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </div>
        </div>

        {/* Author Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-sm text-gray-500">
                Desarrollado por{' '}
                <Link
                  href="https://ulises-gonzalez-site.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Ulises Gonzalez
                </Link>
              </p>
              <span className="hidden sm:inline text-gray-300">|</span>
              <Link
                href="https://rizo.ma"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                Rizo.ma
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="https://www.linkedin.com/in/ulisesgonzalez/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/gonzalezulises"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 transition-colors"
                title="GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="https://medium.com/@gonzalezulises"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 transition-colors"
                title="Medium"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            © {currentYear} Ulises Gonzalez - Rizo.ma. MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
