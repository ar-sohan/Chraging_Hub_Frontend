export default function LoadingState({ text = "Loading..." }: { text?: string }) {
  return <div role="status" className="flex items-center gap-3 py-6 text-sm text-base-content/60">
    <span className="dui-loading dui-loading-spinner dui-loading-sm text-primary" aria-hidden="true" />
    {text}
  </div>;
}
