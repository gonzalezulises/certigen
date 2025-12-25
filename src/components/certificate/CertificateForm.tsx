'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label, Select, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { certificateFormSchema, CertificateFormData, TEMPLATES, TemplateStyle } from '@/types/certificate';

interface CertificateFormProps {
  onSubmit: (data: CertificateFormData) => Promise<void>;
  onChange?: (data: Partial<CertificateFormData>) => void;
  selectedTemplate: TemplateStyle;
  onTemplateChange: (template: TemplateStyle) => void;
  isLoading?: boolean;
}

export function CertificateForm({
  onSubmit,
  onChange,
  selectedTemplate,
  onTemplateChange,
  isLoading = false,
}: CertificateFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: {
      student_name: '',
      student_email: '',
      course_name: '',
      certificate_type: 'participation',
      instructor_name: '',
      hours: undefined,
      grade: undefined,
      issue_date: new Date().toISOString().split('T')[0],
    },
  });

  // Watch form values and call onChange
  React.useEffect(() => {
    const subscription = watch((value) => {
      if (onChange) {
        onChange(value as Partial<CertificateFormData>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Student Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos del Estudiante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student_name" required>Nombre completo</Label>
              <Input
                id="student_name"
                placeholder="Juan Perez Garcia"
                {...register('student_name')}
                error={errors.student_name?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student_email" required>Correo electronico</Label>
              <Input
                id="student_email"
                type="email"
                placeholder="juan@ejemplo.com"
                {...register('student_email')}
                error={errors.student_email?.message}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos del Curso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="course_name" required>Nombre del curso</Label>
            <Input
              id="course_name"
              placeholder="React Avanzado: Hooks y Patrones"
              {...register('course_name')}
              error={errors.course_name?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="certificate_type" required>Tipo de certificado</Label>
              <Select
                id="certificate_type"
                {...register('certificate_type')}
                error={errors.certificate_type?.message}
              >
                <option value="participation">Participacion</option>
                <option value="completion">Aprobacion</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Horas del curso</Label>
              <Input
                id="hours"
                type="number"
                min="1"
                placeholder="40"
                {...register('hours', { valueAsNumber: true })}
                error={errors.hours?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Calificacion (0-100)</Label>
              <Input
                id="grade"
                type="number"
                min="0"
                max="100"
                placeholder="85"
                {...register('grade', { valueAsNumber: true })}
                error={errors.grade?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instructor_name">Nombre del instructor</Label>
              <Input
                id="instructor_name"
                placeholder="Maria Rodriguez"
                {...register('instructor_name')}
                error={errors.instructor_name?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue_date" required>Fecha de emision</Label>
              <Input
                id="issue_date"
                type="date"
                {...register('issue_date')}
                error={errors.issue_date?.message}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Plantilla del Certificado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => onTemplateChange(template.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400 text-sm">
                  Vista previa
                </div>
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="submit" isLoading={isLoading} size="lg">
          Generar Certificado
        </Button>
      </div>
    </form>
  );
}
