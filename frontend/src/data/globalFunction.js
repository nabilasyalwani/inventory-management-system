export default function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "" : date.toLocaleDateString("id-ID");
}
