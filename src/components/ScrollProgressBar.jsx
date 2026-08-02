export function ScrollProgressBar({ progress }) {
  return (
    <div
      className="scroll-progress"
      style={{ transform: `scaleX(${progress})` }}
      aria-hidden="true"
    />
  )
}
