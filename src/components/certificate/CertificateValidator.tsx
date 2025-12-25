'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Alert, AlertTitle, AlertDescription } from '@/components/ui';
import { validateCertificateSchema, ValidateCertificateData, Certificate } from '@/types/certificate';
import { formatDate, getCertificateTypeLabel } from '@/lib/utils';
import { CheckCircle2, XCircle, Search, Award, Calendar, User, GraduationCap, Clock, Trophy } from 'lucide-react';

interface ValidationResult {
  is_valid: boolean;
  certificate?: Certificate;
  validation_count?: number;
  error?: string;
}

interface CertificateValidatorProps {
  initialNumber?: string;
}

export function CertificateValidator({ initialNumber }: CertificateValidatorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidateCertificateData>({
    resolver: zodResolver(validateCertificateSchema),
    defaultValues: {
      certificate_number: initialNumber || '',
    },
  });

  const onSubmit = async (data: ValidateCertificateData) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/certificates/validate/${data.certificate_number}`);
      const validationResult = await response.json();
      setResult(validationResult);
    } catch (error) {
      setResult({
        is_valid: false,
        error: 'Error al validar el certificado. Intenta de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Certificado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="CER-20240115-123456"
                {...register('certificate_number')}
                error={errors.certificate_number?.message}
              />
            </div>
            <Button type="submit" isLoading={isLoading}>
              Validar
            </Button>
          </form>
          <p className="text-sm text-gray-500 mt-2">
            Ingresa el numero de certificado que aparece en el documento o escanea el codigo QR.
          </p>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          {result.is_valid && result.certificate ? (
            <ValidCertificateResult
              certificate={result.certificate}
              validationCount={result.validation_count || 0}
            />
          ) : (
            <InvalidCertificateResult error={result.error} />
          )}
        </>
      )}
    </div>
  );
}

function ValidCertificateResult({
  certificate,
  validationCount,
}: {
  certificate: Certificate;
  validationCount: number;
}) {
  return (
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
                  <p className="font-medium">{certificate.student_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Curso</p>
                  <p className="font-medium">{certificate.course_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-medium">
                    Certificado de {getCertificateTypeLabel(certificate.certificate_type)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Fecha de emision</p>
                  <p className="font-medium">{formatDate(certificate.issue_date)}</p>
                </div>
              </div>

              {certificate.hours && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Duracion</p>
                    <p className="font-medium">{certificate.hours} horas</p>
                  </div>
                </div>
              )}

              {certificate.grade && (
                <div className="flex items-start gap-3">
                  <Trophy className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Calificacion</p>
                    <p className="font-medium">{certificate.grade}/100</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Numero de certificado</p>
                <p className="font-mono text-sm">{certificate.certificate_number}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Validaciones</p>
                <p className="font-medium">{validationCount} veces</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InvalidCertificateResult({ error }: { error?: string }) {
  return (
    <Alert variant="error">
      <AlertTitle className="flex items-center gap-2 text-lg">
        <XCircle className="h-6 w-6" />
        Certificado No Valido
      </AlertTitle>
      <AlertDescription>
        {error || 'No se encontro un certificado con ese numero. Verifica que el numero sea correcto.'}
      </AlertDescription>
    </Alert>
  );
}
