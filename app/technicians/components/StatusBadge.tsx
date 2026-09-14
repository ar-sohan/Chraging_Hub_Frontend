type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const color = status === 'Approved'
    ? 'bg-green-100 text-green-800'
    : status === 'Rejected'
      ? 'bg-red-100 text-red-800'
      : 'bg-amber-100 text-amber-800';

  return <span className={`rounded-full px-3 py-1 text-sm font-semibold ${color}`}>{status}</span>;
}
