/**
 * Export utilities for inscription data
 * Provides functions to export inscriptions to CSV, TXT, and email list formats
 */

export interface Inscription {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  motivation: string;
  besoins_specifiques?: string | null;
  infos_prioritaires?: string | null;
  created_at?: string | Date;
  updated_at?: string | Date;
}

/**
 * Escapes special characters in CSV fields
 * Handles quotes, commas, and newlines according to RFC 4180
 */
function escapeCsvField(field: string | null | undefined): string {
  if (field === null || field === undefined) {
    return '';
  }

  const value = String(field);

  // If field contains comma, quote, or newline, wrap it in quotes and escape internal quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

/**
 * Escapes special characters in TXT (tab-separated) fields
 * Replaces tabs and newlines with spaces
 */
function escapeTxtField(field: string | null | undefined): string {
  if (field === null || field === undefined) {
    return '';
  }

  return String(field)
    .replace(/\t/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ');
}

/**
 * Formats a date to French locale string
 */
function formatDate(date: string | Date | undefined): string {
  if (!date) {
    return '';
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(date);
  }
}

/**
 * Exports inscriptions to CSV format and triggers browser download
 * @param inscriptions - Array of inscription objects
 * @param filename - Optional filename (defaults to inscriptions-YYYY-MM-DD.csv)
 */
export function exportToCSV(inscriptions: Inscription[], filename?: string): void {
  const headers = [
    'Prénom',
    'Nom',
    'Email',
    'Téléphone',
    'Motivation',
    'Besoins spécifiques',
    'Infos prioritaires',
    "Date d'inscription",
  ];

  const csvRows = [
    headers.map(escapeCsvField).join(','),
    ...inscriptions.map((inscription) =>
      [
        inscription.prenom,
        inscription.nom,
        inscription.email,
        inscription.telephone,
        inscription.motivation,
        inscription.besoins_specifiques,
        inscription.infos_prioritaires,
        formatDate(inscription.created_at),
      ]
        .map(escapeCsvField)
        .join(',')
    ),
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });

  const defaultFilename = `inscriptions-${new Date().toISOString().split('T')[0]}.csv`;
  downloadBlob(blob, filename || defaultFilename);
}

/**
 * Exports inscriptions to TXT format (tab-separated) and triggers browser download
 * @param inscriptions - Array of inscription objects
 * @param filename - Optional filename (defaults to inscriptions-YYYY-MM-DD.txt)
 */
export function exportToTXT(inscriptions: Inscription[], filename?: string): void {
  const headers = [
    'Prénom',
    'Nom',
    'Email',
    'Téléphone',
    'Motivation',
    'Besoins spécifiques',
    'Infos prioritaires',
    "Date d'inscription",
  ];

  const txtRows = [
    headers.join('\t'),
    ...inscriptions.map((inscription) =>
      [
        inscription.prenom,
        inscription.nom,
        inscription.email,
        inscription.telephone,
        inscription.motivation,
        inscription.besoins_specifiques,
        inscription.infos_prioritaires,
        formatDate(inscription.created_at),
      ]
        .map(escapeTxtField)
        .join('\t')
    ),
  ];

  const txtContent = txtRows.join('\n');
  const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });

  const defaultFilename = `inscriptions-${new Date().toISOString().split('T')[0]}.txt`;
  downloadBlob(blob, filename || defaultFilename);
}

/**
 * Extracts and formats email list from inscriptions
 * Returns comma-separated list of emails ready for email "To" field
 * @param inscriptions - Array of inscription objects
 * @param includeNames - If true, formats as "Prénom Nom <email@example.com>"
 * @returns Comma-separated email list
 */
export function extractEmailList(inscriptions: Inscription[], includeNames = false): string {
  const emails = inscriptions
    .filter((inscription) => inscription.email && inscription.email.trim() !== '')
    .map((inscription) => {
      if (includeNames && inscription.prenom && inscription.nom) {
        return `${inscription.prenom} ${inscription.nom} <${inscription.email}>`;
      }
      return inscription.email;
    });

  return emails.join(', ');
}

/**
 * Exports email list to TXT file and triggers browser download
 * @param inscriptions - Array of inscription objects
 * @param includeNames - If true, formats as "Prénom Nom <email@example.com>"
 * @param filename - Optional filename (defaults to emails-YYYY-MM-DD.txt)
 */
export function exportEmailList(
  inscriptions: Inscription[],
  includeNames = false,
  filename?: string
): void {
  const emailList = extractEmailList(inscriptions, includeNames);
  const blob = new Blob([emailList], { type: 'text/plain;charset=utf-8;' });

  const defaultFilename = `emails-${new Date().toISOString().split('T')[0]}.txt`;
  downloadBlob(blob, filename || defaultFilename);
}

/**
 * Helper function to trigger browser download of a blob
 * @param blob - The blob to download
 * @param filename - The filename for the download
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
