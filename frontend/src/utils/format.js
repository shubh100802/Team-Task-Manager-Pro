export function formatDate(value) {
  if (!value) return "No due date";
  return new Date(value).toLocaleDateString();
}

export function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function sentenceCase(value) {
  return value
    ?.toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
