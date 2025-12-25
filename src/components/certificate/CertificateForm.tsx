'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label, Select, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { certificateFormSchema, authenticatedCertificateFormSchema, CertificateFormData, TEMPLATES, TemplateStyle } from '@/types/certificate';
import { Upload, X, Image as ImageIcon, Info } from 'lucide-react';

interface CertificateFormProps {
  onSubmit: (data: CertificateFormData) => Promise<void>;
  onChange?: (data: Partial<CertificateFormData>) => void;
  onLogoChange?: (logoUrl: string | null) => void;
  selectedTemplate: TemplateStyle;
  onTemplateChange: (template: TemplateStyle) => void;
  isLoading?: boolean;
  isAuthenticated?: boolean;
}

export function CertificateForm({
  onSubmit,
  onChange,
  onLogoChange,
  selectedTemplate,
  onTemplateChange,
  isLoading = false,
  isAuthenticated = false,
}: CertificateFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CertificateFormData>({
    // Use appropriate schema based on authentication status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(isAuthenticated ? authenticatedCertificateFormSchema : certificateFormSchema) as any,
    defaultValues: {
      student_name: '',
      student_email: '',
      course_name: '',
      certificate_type: 'participation',
      instructor_name: '',
      hours: undefined,
      grade: undefined,
      issue_date: new Date().toISOString().split('T')[0],
      organization_name: '',
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

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen');
        return;
      }
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('El archivo debe ser menor a 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        setValue('logo_url', base64);
        if (onLogoChange) {
          onLogoChange(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setValue('logo_url', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onLogoChange) {
      onLogoChange(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Organization & Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Organizacion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organization_name">Nombre de la organizacion</Label>
              <Input
                id="organization_name"
                placeholder="Mi Empresa / Universidad"
                {...register('organization_name')}
              />
            </div>
            <div className="space-y-2">
              <Label>Logo (opcional)</Label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-16 h-16 object-contain border rounded bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 border-2 border-dashed rounded flex items-center justify-center bg-gray-50">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Subir logo
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 2MB</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <Label htmlFor="student_email" required={!isAuthenticated}>
                Correo electronico {isAuthenticated && <span className="text-gray-400 font-normal">(opcional)</span>}
              </Label>
              <Input
                id="student_email"
                type="email"
                placeholder="juan@ejemplo.com"
                {...register('student_email')}
                error={errors.student_email?.message}
              />
              {isAuthenticated && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Solo necesario si deseas enviar el certificado por email
                </p>
              )}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => onTemplateChange(template.id)}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left flex sm:flex-col items-center sm:items-stretch gap-3 sm:gap-0 ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-16 h-12 sm:w-full sm:aspect-video bg-gray-100 rounded flex-shrink-0 sm:mb-3 flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                  {template.id === 'elegant' && '🎨'}
                  {template.id === 'minimal' && '✨'}
                  {template.id === 'corporate' && '🏢'}
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-sm sm:text-base">{template.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 line-clamp-2">{template.description}</p>
                </div>
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
