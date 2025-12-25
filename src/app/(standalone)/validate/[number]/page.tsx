'use client';

import React, { useEffect, useState, use } from 'react';
import { CertificateValidator } from '@/components/certificate';
import { FileCheck, Loader2 } from 'lucide-react';
import { Certificate } from '@/types/certificate';
import { Alert, AlertTitle, AlertDescription, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatDate, getCertificateTypeLabel } from '@/lib/utils';
import { CheckCircle2, XCircle, User, GraduationCap, Award, Calendar, Clock, Trophy } from 'lucide-react';

interface ValidationResult {
  is_valid: boolean;
  certificate?: Certificate;
  validation_count?: number;
  error?: string;
}

export default function ValidateNumberPage({ params }: { params: Promise<{ number: string }> }) {
  const resolvedParams = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<ValidationResult | null>(null);

  useEffect(() => {
    const validateCertificate = async () => {
      try {
        const response = await fetch(`/api/certificates/validate/${resolvedParams.number}`);
        const validationResult = await response.json();
        setResult(validationResult);
      } catch (error) {
        setResult({
          is_valid: false,
          error: 'Error al validar el certificado.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    validateCertificate();
  }, [resolvedParams.number]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600">Validando certificado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <FileCheck className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Resultado de Validacion</h1>
          <p className="text-gray-600 mt-2 font-mono">{resolvedParams.number}</p>
        </div>

        {result && (
          <>
            {result.is_valid && result.certificate ? (
              <div className="space-y-4">
                <Alert variant="success">
                  <AlertTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle2 className="h-6 w-6" />
                    Certificado Valido
                  </AlertTitle>
                  <AlertDescription>
                    Este certificado es autentico y esta registrado en nuestro sistema.
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      Detalles del Certificado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <User className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Estudiante</p>
                            <p className="font-medium">{result.certificate.student_name}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <GraduationCap className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Curso</p>
                            <p className="font-medium">{result.certificate.course_name}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Award className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Tipo</p>
                            <p className="font-medium">
                              Certificado de {getCertificateTypeLabel(result.certificate.certificate_type)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Fecha de emision</p>
                            <p className="font-medium">{formatDate(result.certificate.issue_date)}</p>
                          </div>
                        </div>

                        {result.certificate.hours && (
                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Duracion</p>
                              <p className="font-medium">{result.certificate.hours} horas</p>
                            </div>
                          </div>
                        )}

                        {result.certificate.grade && (
                          <div className="flex items-start gap-3">
                            <Trophy className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Calificacion</p>
                              <p className="font-medium">{result.certificate.grade}/100</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Numero de certificado</p>
                          <p className="font-mono text-sm">{result.certificate.certificate_number}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Validaciones</p>
                          <p className="font-medium">{result.validation_count} veces</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Alert variant="error">
                <AlertTitle className="flex items-center gap-2 text-lg">
                  <XCircle className="h-6 w-6" />
                  Certificado No Valido
                </AlertTitle>
                <AlertDescription>
                  {result.error || 'No se encontro un certificado con ese numero. Verifica que el numero sea correcto.'}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {/* Search for another certificate */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Validar otro certificado</h2>
          <CertificateValidator />
        </div>
      </div>
    </div>
  );
}
