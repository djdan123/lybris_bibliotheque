export default function StatCard({
  title,
  value,
  subtitle,
  color
}) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 border-l-4 ${color}`}
    >
      <h3 className="text-xs text-gray-500 uppercase">
        {title}
      </h3>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        {subtitle}
      </p>
    </div>
  );
}