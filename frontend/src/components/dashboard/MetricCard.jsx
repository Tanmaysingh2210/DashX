export default function MetricCard({
  title,
  value,
  subtitle,
  accent = "accent",
  children
}) {
  return (
    <div className="bg-card border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
      <div className="text-sm text-gray-400">{title}</div>

      <div className={`text-3xl font-bold text-${accent}`}>
        {value}
      </div>

      {subtitle && (
        <div className="text-xs text-gray-500 mt-1">
          {subtitle}
        </div>
      )}

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
