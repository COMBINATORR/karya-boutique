/**
 * Top reading progress line.
 * Fills from left to right as the user scrolls down the page.
 */
export function ScrollProgressBar({ progress = 0 }) {
  return (
    <div className="scroll-progress-wrap" aria-hidden="true">
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
