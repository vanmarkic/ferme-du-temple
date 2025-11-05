import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2, AlertCircle } from 'lucide-react';

// Type matching the database schema
export interface Inscription {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  motivation: string;
  besoins_specifiques: string | null;
  infos_prioritaires: string | null;
  created_at: string;
}

type SortField = 'prenom' | 'nom' | 'email' | 'telephone' | 'created_at';
type SortDirection = 'asc' | 'desc';

interface InscriptionTableProps {
  inscriptions: Inscription[];
  onRowClick: (inscription: Inscription) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const InscriptionTable = ({
  inscriptions,
  onRowClick,
  isLoading = false,
  error = null,
}: InscriptionTableProps) => {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Sort inscriptions
  const sortedInscriptions = useMemo(() => {
    const sorted = [...inscriptions].sort((a, b) => {
      let aValue: string | number = a[sortField] || '';
      let bValue: string | number = b[sortField] || '';

      // Handle date sorting
      if (sortField === 'created_at') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      } else {
        // Convert to lowercase for case-insensitive string sorting
        aValue = (aValue as string).toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [inscriptions, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedInscriptions.length / pageSize);
  const paginatedInscriptions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedInscriptions.slice(start, end);
  }, [sortedInscriptions, currentPage, pageSize]);

  // Format date in French locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Render sort icon for column header
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-magenta" />
    ) : (
      <ChevronDown className="w-4 h-4 text-magenta" />
    );
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="w-12 h-12 text-magenta animate-spin" />
        <p className="text-lg text-muted-foreground">Chargement des inscriptions...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-12 h-12" />
          <div>
            <p className="text-xl font-bold">Erreur</p>
            <p className="text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (inscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <p className="text-xl text-muted-foreground">Aucune inscription trouvée</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Afficher:</span>
          <div className="flex gap-2">
            {[10, 20, 50].map((size) => (
              <Button
                key={size}
                variant={pageSize === size ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageSizeChange(size)}
                className={
                  pageSize === size
                    ? 'bg-magenta hover:bg-magenta/90 text-white'
                    : 'border-rich-black'
                }
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {sortedInscriptions.length} inscription{sortedInscriptions.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div className="border-4 border-rich-black overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-butter-yellow border-b-4 border-rich-black">
            <tr>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('prenom')}
                  className="flex items-center gap-2 font-bold uppercase tracking-wider hover:text-magenta transition-colors"
                >
                  Prénom
                  {renderSortIcon('prenom')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('nom')}
                  className="flex items-center gap-2 font-bold uppercase tracking-wider hover:text-magenta transition-colors"
                >
                  Nom
                  {renderSortIcon('nom')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('email')}
                  className="flex items-center gap-2 font-bold uppercase tracking-wider hover:text-magenta transition-colors"
                >
                  Email
                  {renderSortIcon('email')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('telephone')}
                  className="flex items-center gap-2 font-bold uppercase tracking-wider hover:text-magenta transition-colors"
                >
                  Téléphone
                  {renderSortIcon('telephone')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('created_at')}
                  className="flex items-center gap-2 font-bold uppercase tracking-wider hover:text-magenta transition-colors"
                >
                  Date d'inscription
                  {renderSortIcon('created_at')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-background">
            {paginatedInscriptions.map((inscription, index) => (
              <tr
                key={inscription.id}
                onClick={() => onRowClick(inscription)}
                className={`
                  cursor-pointer transition-colors border-b-2 border-rich-black/20
                  hover:bg-magenta/10
                  ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                `}
              >
                <td className="p-4 font-medium">{inscription.prenom}</td>
                <td className="p-4 font-medium">{inscription.nom}</td>
                <td className="p-4 text-muted-foreground">{inscription.email}</td>
                <td className="p-4 text-muted-foreground">{inscription.telephone}</td>
                <td className="p-4 text-muted-foreground">{formatDate(inscription.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="border-2 border-rich-black disabled:opacity-50"
          >
            Précédent
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage && page === currentPage - 2) {
                return <span key={page} className="px-2">...</span>;
              }
              if (!showPage && page === currentPage + 2) {
                return <span key={page} className="px-2">...</span>;
              }
              if (!showPage) {
                return null;
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={
                    currentPage === page
                      ? 'bg-magenta hover:bg-magenta/90 text-white min-w-[40px]'
                      : 'border-2 border-rich-black min-w-[40px]'
                  }
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="border-2 border-rich-black disabled:opacity-50"
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
};
