'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button, Alert, AlertDescription } from '@/components/ui';
import { Settings, Award, Users, BarChart3, AlertCircle, LogOut } from 'lucide-react';
import { formatShortDate, getCertificateTypeLabel } from '@/lib/utils';
import { Certificate } from '@/types/certificate';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const t = useTranslations();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    completions: 0,
    participations: 0,
  });

  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchCertificates = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        const certificatesData = (data as Certificate[]) || [];
        setCertificates(certificatesData);

        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);
        thisMonthStart.setHours(0, 0, 0, 0);

        const thisMonthCerts = certificatesData.filter(
          (c) => new Date(c.created_at) >= thisMonthStart
        );
        const completions = certificatesData.filter(
          (c) => c.certificate_type === 'completion'
        );
        const participations = certificatesData.filter(
          (c) => c.certificate_type === 'participation'
        );

        setStats({
          total: certificatesData.length,
          thisMonth: thisMonthCerts.length,
          completions: completions.length,
          participations: participations.length,
        });
      } catch (err) {
        setError(t('errors.serverError'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, [user, t]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/auth');
  };

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center" role="status" aria-label={t('common.loading')}>
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="h-8 w-8" aria-hidden="true" />
            {t('admin.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('admin.subtitle')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {t('admin.session')}: {user.email}
          </p>
        </div>
        <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {t('admin.logout')}
        </Button>
      </div>

      {error && (
        <Alert variant="error" className="mb-6" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          label={t('admin.stats.total')}
          value={stats.total}
          color="blue"
        />
        <StatCard
          icon={<BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />}
          label={t('admin.stats.thisMonth')}
          value={stats.thisMonth}
          color="green"
        />
        <StatCard
          icon={<Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
          label={t('admin.stats.completions')}
          value={stats.completions}
          color="purple"
        />
        <StatCard
          icon={<Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
          label={t('admin.stats.participations')}
          value={stats.participations}
          color="orange"
        />
      </div>

      {/* Recent Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.recent.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400" role="status">
              {t('common.loading')}
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" aria-hidden="true" />
              <p className="text-gray-500 dark:text-gray-400">{t('admin.recent.empty')}</p>
              <Button
                className="mt-4"
                onClick={() => router.push('/generate')}
              >
                {t('admin.recent.generateFirst')}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('admin.recent.number')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('admin.recent.student')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('admin.recent.course')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('admin.recent.type')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('admin.recent.date')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('admin.recent.status')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert) => (
                    <tr
                      key={cert.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-gray-900 dark:text-white">
                          {cert.certificate_number}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{cert.student_name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {cert.student_email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{cert.course_name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            cert.certificate_type === 'completion'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}
                        >
                          {getCertificateTypeLabel(cert.certificate_type)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatShortDate(cert.issue_date)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            cert.is_active
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {cert.is_active ? t('admin.recent.active') : t('admin.recent.inactive')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Integration Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t('admin.api.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('admin.api.description')}
          </p>
          <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-green-400 overflow-x-auto">
            <pre>{`POST /api/integration
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "student_name": "Student Name",
  "student_email": "email@example.com",
  "course_name": "Course Name",
  "certificate_type": "completion",
  "hours": 40,
  "grade": 95
}`}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const bgColors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${bgColors[color]}`} aria-hidden="true">{icon}</div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
