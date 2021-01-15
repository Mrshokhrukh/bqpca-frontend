// utils/formatText.js
export function formatText(text) {
  if (!text) return '';

  // Convert snake_case or kebab-case to title case
  return text
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
