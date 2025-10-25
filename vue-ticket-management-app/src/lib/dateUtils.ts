export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // If less than a minute ago
  if (diffInSeconds < 60) {
    return 'just now';
  }

  // If less than an hour ago
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  // If less than 24 hours ago
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  // If less than 7 days ago
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  // For older dates, use a more detailed format
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getDetailedDateTime(date: string | Date): string {
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}