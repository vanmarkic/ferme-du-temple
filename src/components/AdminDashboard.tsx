import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { InscriptionTable, type Inscription } from './InscriptionTable';
import { InscriptionDetail } from './InscriptionDetail';
import { AdminSidebar } from './AdminSidebar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { exportToCSV, exportToTXT, extractEmailList } from '../lib/export-utils';
import { Download, FileText, Mail, LogOut, Search } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface InscriptionsResponse {
  data: Inscription[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function AdminDashboard() {
  const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery<InscriptionsResponse>({
    queryKey: ['inscriptions', page, limit, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/admin/inscriptions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch inscriptions');
      }
      return response.json();
    },
  });

  const handleRowClick = (inscription: Inscription) => {
    setSelectedInscription(inscription);
    setDetailOpen(true);
  };

  const handleExportCSV = () => {
    if (data?.data) {
      exportToCSV(data.data);
      toast({
        title: 'Export réussi',
        description: `${data.data.length} inscriptions exportées en CSV`,
      });
    }
  };

  const handleExportTXT = () => {
    if (data?.data) {
      exportToTXT(data.data);
      toast({
        title: 'Export réussi',
        description: `${data.data.length} inscriptions exportées en TXT`,
      });
    }
  };

  const handleCopyEmails = async () => {
    if (data?.data) {
      const emailList = extractEmailList(data.data, true);
      try {
        await navigator.clipboard.writeText(emailList);
        toast({
          title: 'Emails copiés',
          description: `${data.data.length} adresses email copiées dans le presse-papiers`,
        });
      } catch (err) {
        toast({
          title: 'Erreur',
          description: 'Impossible de copier dans le presse-papiers',
          variant: 'destructive',
        });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la déconnexion',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-magenta/5 to-butter-yellow/5 flex">
      <AdminSidebar currentPage="inscriptions" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg border-4 border-rich-black p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-rich-black mb-2">
                Tableau de bord - Inscriptions
              </h1>
              <p className="text-gray-600">
                {data?.pagination.total || 0} inscription(s) au total
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleExportCSV}
                variant="outline"
                disabled={!data?.data.length}
                className="border-magenta text-magenta hover:bg-magenta hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>

              <Button
                onClick={handleExportTXT}
                variant="outline"
                disabled={!data?.data.length}
                className="border-magenta text-magenta hover:bg-magenta hover:text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                TXT
              </Button>

              <Button
                onClick={handleCopyEmails}
                variant="outline"
                disabled={!data?.data.length}
                className="border-butter-yellow text-butter-yellow hover:bg-butter-yellow hover:text-rich-black"
              >
                <Mail className="w-4 h-4 mr-2" />
                Copier emails
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-rich-black text-rich-black hover:bg-rich-black hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher par nom, prénom ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg border-4 border-rich-black overflow-hidden">
          <InscriptionTable
            inscriptions={data?.data || []}
            onRowClick={handleRowClick}
            isLoading={isLoading}
            error={error?.message || null}
          />
        </div>

        {/* Detail Modal */}
        {selectedInscription && (
          <InscriptionDetail
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            inscription={selectedInscription}
          />
        )}
        </div>
      </div>
    </div>
  );
}
