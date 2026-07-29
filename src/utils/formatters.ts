export function formatDateBR(dateString: string | undefined): string {
  if (!dateString) return '';
  // Assuming date is in YYYY-MM-DD
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}
