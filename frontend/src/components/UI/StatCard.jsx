export default function StatCard({ title, value, color='primary' }) {
  const colorMap = { primary: 'bg-blue-500', success: 'bg-green-500', accent: 'bg-orange-500' };
  return (
    <div className="bg-white shadow rounded p-4">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className={`mt-2 text-2xl font-bold ${colorMap[color]} bg-clip-text text-transparent`}>
        {value}
      </div>
    </div>
  );
}
