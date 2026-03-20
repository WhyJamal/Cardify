/**
 * Calculates position for a panel that opens BELOW the trigger element.
 * Falls back to above if not enough space below.
 */
export function calcBelowPosition(
  triggerRect: DOMRect,
  panelWidth: number,
  panelHeight: number,
  gap = 4
) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Horizontal: align left edge with trigger, clamp to viewport
  let left = triggerRect.left;
  if (left + panelWidth > vw - 8) left = vw - panelWidth - 8;
  left = Math.max(8, left);

  // Vertical: below trigger
  const top = triggerRect.bottom + gap;
  const maxHeight = vh - top - 8;

  return { left, top, maxHeight };
}

/**
 * Calculates position for a panel that opens to the SIDE of a trigger element.
 * Priority: right → left → fallback rect → best effort.
 */
export function calcSidePosition(
  triggerRect: DOMRect,
  panelWidth: number,
  panelHeight: number,
  options?: { gap?: number; fallbackRect?: DOMRect }
) {
  const { gap = 8, fallbackRect } = options ?? {};
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const spaceRight = vw - triggerRect.right - gap;
  const spaceLeft = triggerRect.left - gap;

  let left: number;
  if (spaceRight >= panelWidth) {
    left = triggerRect.right + gap;
  } else if (spaceLeft >= panelWidth) {
    left = triggerRect.left - panelWidth - gap;
  } else if (fallbackRect) {
    left = fallbackRect.left;
  } else {
    left = spaceRight >= spaceLeft
      ? triggerRect.right + gap
      : triggerRect.left - panelWidth - gap;
  }

  const top = 12; // always from viewport top
  const maxHeight = vh - top - 12;

  return { left, top, maxHeight };
}

export function calcFloatingSidePosition(
  triggerRect: DOMRect,
  panelWidth: number,
  panelHeight: number,
  options?: {
    gap?: number;
    fallbackRect?: DOMRect | null;
    estimatedHeight?: number;
    alignToViewportTop?: boolean;
  }
) {
  const { gap = 8, fallbackRect = null, estimatedHeight = panelHeight, alignToViewportTop = false } = options ?? {};
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const spaceRight = vw - triggerRect.right - gap;
  const spaceLeft = triggerRect.left - gap;

  const fitsRight = spaceRight >= panelWidth;
  const fitsLeft = spaceLeft >= panelWidth;

  let left: number;

  // Prefer a side that fully fits horizontally
  if (fitsRight) {
    left = triggerRect.right + gap;
  } else if (fitsLeft) {
    left = triggerRect.left - panelWidth - gap;
  } else if (fallbackRect && fallbackRect.width >= panelWidth + 16) {
    // Center inside fallback (create-board-panel) with small padding
    const minLeftInside = Math.max(8, fallbackRect.left + 8);
    const maxLeftInside = Math.min(vw - panelWidth - 8, fallbackRect.right - panelWidth - 8);
    const centered = fallbackRect.left + (fallbackRect.width - panelWidth) / 2;
    left = Math.min(Math.max(centered, minLeftInside), Math.max(minLeftInside, maxLeftInside));
  } else {
    // Best effort: put to the side with more space but clamp inside viewport
    if (spaceRight >= spaceLeft) {
      left = Math.min(triggerRect.right + gap, vw - panelWidth - 8);
      left = Math.max(8, left);
    } else {
      left = Math.max(8, triggerRect.left - panelWidth - gap);
    }
  }

  // Top calculation
  let top: number;
  const desiredTop = triggerRect.top;

  // If caller requests viewport-top alignment OR no side fully fits and no fallback, stick to top
  const noSideFits = !fitsRight && !fitsLeft;
  const fallbackFits = Boolean(fallbackRect && fallbackRect.width >= panelWidth + 16);
  if (alignToViewportTop || (noSideFits && !fallbackFits)) {
    top = 12;
  } else {
    // Prefer aligning to trigger top but clamp to fallback/viewport so panel doesn't overflow
    const vertTop = fallbackRect ? Math.max(12, fallbackRect.top + 8) : 12;
    const vertBottom = fallbackRect ? Math.min(vh - 12, fallbackRect.bottom - 8) : vh - 12;
    const maxTopForEstimated = Math.max(vertTop, vertBottom - estimatedHeight);
    top = Math.min(Math.max(desiredTop, vertTop), maxTopForEstimated);
  }

  // Compute usable bottom and maxHeight
  const usableBottom = fallbackRect ? Math.min(vh - 12, fallbackRect.bottom - 8) : vh - 12;
  let maxHeight = usableBottom - top - 8;

  // Safety minimal height and final clamp
  if (maxHeight < 200) maxHeight = Math.max(200, vh - top - 12);

  return { left, top, maxHeight };
}