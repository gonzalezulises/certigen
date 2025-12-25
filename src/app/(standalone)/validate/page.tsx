'use client';

import React from 'react';
import { CertificateValidator } from '@/components/certificate';
import { FileCheck, QrCode, Hash, Shield } from 'lucide-react';

export default function ValidatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <FileCheck className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Validar Certificado</h1>
          <p className="text-gray-600 mt-2">
            Verifica la autenticidad de un certificado ingresando su numero o escaneando el codigo QR.
          </p>
        </div>

        <CertificateValidator />

        {/* How it works */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Como validar tu certificado
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                <QrCode className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="font-medium mb-2">Escanea el QR</h3>
              <p className="text-sm text-gray-500">
                Usa la camara de tu telefono para escanear el codigo QR del certificado.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                <Hash className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="font-medium mb-2">Ingresa el numero</h3>
              <p className="text-sm text-gray-500">
                Escribe el numero de certificado (ej: CER-20240115-123456) en el campo de busqueda.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                <Shield className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="font-medium mb-2">Verifica</h3>
              <p className="text-sm text-gray-500">
                Obtendras los detalles del certificado si es valido, o una alerta si no se encuentra.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
