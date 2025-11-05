import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Mail, Phone, User, Users, Heart, FileText } from 'lucide-react';

interface Inscription {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  motivation: string;
  besoins_specifiques?: string | null;
  infos_prioritaires?: string | null;
  created_at: string;
}

interface InscriptionDetailProps {
  open: boolean;
  onClose: () => void;
  inscription: Inscription | null;
}

export function InscriptionDetail({ open, onClose, inscription }: InscriptionDetailProps) {
  if (!inscription) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader className="border-b-4 border-magenta pb-6">
          <DialogTitle className="text-3xl font-bold text-rich-black uppercase tracking-wider flex items-center gap-3">
            <Heart className="w-8 h-8 text-magenta" />
            Détails de l'inscription
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Header Info - Candidate Name */}
          <div className="bg-magenta/5 border-l-4 border-magenta p-6 rounded-r-lg">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-magenta" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Candidat
              </h3>
            </div>
            <p className="text-2xl font-bold text-rich-black">
              {inscription.prenom} {inscription.nom}
            </p>
          </div>

          {/* Contact Information Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-magenta" />
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Email
                </label>
              </div>
              <a
                href={`mailto:${inscription.email}`}
                className="block px-4 py-3 bg-background border-2 border-rich-black/20 rounded text-base text-rich-black hover:border-magenta transition-colors"
              >
                {inscription.email}
              </a>
            </div>

            {/* Telephone */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-magenta" />
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Téléphone
                </label>
              </div>
              <a
                href={`tel:${inscription.telephone}`}
                className="block px-4 py-3 bg-background border-2 border-rich-black/20 rounded text-base text-rich-black hover:border-magenta transition-colors"
              >
                {inscription.telephone}
              </a>
            </div>
          </div>

          {/* Date d'inscription */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-magenta" />
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Date d'inscription
              </label>
            </div>
            <div className="px-4 py-3 bg-butter-yellow/10 border-2 border-butter-yellow/30 rounded text-base text-rich-black">
              {formatDate(inscription.created_at)}
            </div>
          </div>

          {/* Motivation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-magenta" />
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Motivation
              </label>
            </div>
            <div className="px-6 py-4 bg-magenta/5 border-l-4 border-magenta rounded-r text-base text-rich-black leading-relaxed whitespace-pre-wrap">
              {inscription.motivation}
            </div>
          </div>

          {/* Informations prioritaires */}
          {inscription.infos_prioritaires && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-magenta" />
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Informations prioritaires
                </label>
              </div>
              <div className="px-6 py-4 bg-butter-yellow/10 border-l-4 border-butter-yellow rounded-r text-base text-rich-black leading-relaxed whitespace-pre-wrap">
                {inscription.infos_prioritaires}
              </div>
            </div>
          )}

          {/* Besoins spécifiques */}
          {inscription.besoins_specifiques && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-magenta" />
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Besoins spécifiques
                </label>
              </div>
              <div className="px-6 py-4 bg-nature-beige/20 border-l-4 border-nature-brown rounded-r text-base text-rich-black leading-relaxed whitespace-pre-wrap">
                {inscription.besoins_specifiques}
              </div>
            </div>
          )}

          {/* Footer with ID (for reference) */}
          <div className="pt-6 border-t-2 border-rich-black/10">
            <p className="text-xs text-muted-foreground text-center">
              ID: {inscription.id}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
