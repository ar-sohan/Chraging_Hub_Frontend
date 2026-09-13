export default function BatteryIndicator({ percentage, label }: { percentage: number; label: string }) {
  const value = Math.max(0, Math.min(100, percentage));
  return (
    <div className="battery-display" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="battery-shell">
        <div className="battery-fill" style={{ width: value + "%" }} />
        <span className="battery-value">{value}%</span>
      </div>
      <span className="battery-terminal" aria-hidden="true" />
    </div>
  );
}
