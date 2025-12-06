export function Progress({ value, max = 100 }) {
  return (
    <div className="relative w-full bg-gray-300 rounded-full h-3 overflow-hidden">
      <div
        className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500"
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  );
}
