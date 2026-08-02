/** Decorative divider: dot — line — dot (Drift-inspired, KARYA cognac) */
export function SectionDivider({ className = '', light = false }) {
  const color = light ? 'bg-[#9E6B4C]/50' : 'bg-[#D9C4AA]'

  return (
    <div
      className={`flex w-full items-center gap-0.5 py-2 ${className}`.trim()}
      aria-hidden
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${color}`} />
      <span className={`h-[1.5px] min-w-0 flex-1 ${color}`} />
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${color}`} />
    </div>
  )
}
