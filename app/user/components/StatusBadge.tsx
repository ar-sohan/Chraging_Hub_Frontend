const styles: Record<string, string> = {
  pending_payment: "dui-badge-warning", pending: "dui-badge-warning",
  confirmed: "dui-badge-success", paid: "dui-badge-success",
  cancelled: "dui-badge-neutral", completed: "dui-badge-info",
  failed: "dui-badge-error", refunded: "dui-badge-info",
};
export default function StatusBadge({ status }: { status: string }) {
  return <span className={"dui-badge dui-badge-soft whitespace-nowrap text-xs capitalize " + (styles[status] || "dui-badge-neutral")}>
    {status.replaceAll("_", " ")}
  </span>;
}
