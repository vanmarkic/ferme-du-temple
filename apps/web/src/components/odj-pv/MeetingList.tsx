import { useState, useEffect } from 'react';
import type { Meeting } from '../../types/odj-pv';
import { getMeetings } from '../../lib/odj-pv';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Calendar, Clock, MapPin, Loader2, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MeetingListProps {
  onCreateNew: () => void;
}

type StatusConfig = {
  label: string;
  variant: 'default' | 'secondary' | 'outline';
  className: string;
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  draft: {
    label: 'Brouillon',
    variant: 'secondary',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  odj_ready: {
    label: 'ODJ',
    variant: 'secondary',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  in_progress: {
    label: 'En cours',
    variant: 'default',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  finalized: {
    label: 'Finalisé',
    variant: 'outline',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
};

export function MeetingList({ onCreateNew }: MeetingListProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMeetings();
      setMeetings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch meetings');
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const upcomingMeetings = meetings.filter((m) => new Date(m.date) >= now);
  const pastMeetings = meetings.filter((m) => new Date(m.date) < now);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return null;
    return timeStr.slice(0, 5); // HH:MM
  };

  const renderMeetingCard = (meeting: Meeting) => {
    const statusConfig = STATUS_CONFIG[meeting.status] || STATUS_CONFIG.draft;

    return (
      <a
        key={meeting.id}
        href={`/admin/odj-pv/${meeting.id}`}
        className="block transition-all hover:scale-[1.02] hover:shadow-xl"
      >
        <Card className="border-2 border-rich-black hover:border-magenta">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg md:text-xl font-bold text-rich-black flex-1">
                {meeting.title}
              </CardTitle>
              <Badge
                variant={statusConfig.variant}
                className={cn('shrink-0', statusConfig.className)}
              >
                {statusConfig.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{formatDate(meeting.date)}</span>
            </div>
            {(meeting.start_time || meeting.end_time) && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 shrink-0" />
                <span>
                  {formatTime(meeting.start_time) || '?'}
                  {' - '}
                  {formatTime(meeting.end_time) || '?'}
                </span>
              </div>
            )}
            {meeting.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate">{meeting.location}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </a>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-magenta" />
          <p className="text-gray-500">Chargement des réunions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-500">
          <p className="font-semibold mb-2">Erreur</p>
          <p className="text-sm">{error}</p>
          <Button
            onClick={fetchMeetings}
            variant="outline"
            className="mt-4"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-rich-black">
            Réunions
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {meetings.length} réunion{meetings.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={onCreateNew}
            className="bg-magenta hover:bg-magenta-dark text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle réunion
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-2 border-rich-black"
          >
            <a href="/admin/odj-pv/decisions">
              <FileText className="w-4 h-4 mr-2" />
              Historique des décisions
            </a>
          </Button>
        </div>
      </div>

      {/* Upcoming meetings */}
      {upcomingMeetings.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-rich-black mb-4">
            À venir ({upcomingMeetings.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingMeetings.map(renderMeetingCard)}
          </div>
        </section>
      )}

      {/* Past meetings */}
      {pastMeetings.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-rich-black mb-4">
            Passées ({pastMeetings.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastMeetings.map(renderMeetingCard)}
          </div>
        </section>
      )}

      {/* Empty state */}
      {meetings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Aucune réunion pour le moment</p>
          <Button
            onClick={onCreateNew}
            className="bg-magenta hover:bg-magenta-dark text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer la première réunion
          </Button>
        </div>
      )}
    </div>
  );
}
