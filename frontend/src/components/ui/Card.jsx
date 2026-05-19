export default function Card({ children, className = "" }) {
  return <div className={`page-shell shadow-panel ${className}`}>{children}</div>;
}
