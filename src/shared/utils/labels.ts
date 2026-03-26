export type BoardLabel = { id: string; color: string; name: string | null };
export type SelectedLabel = { id: string };
export type LabelWithChecked = BoardLabel & { checked: boolean };

export function mergeLabelsWithChecked(
  boardLabels: BoardLabel[],
  selectedLabels: SelectedLabel[]
): LabelWithChecked[] {
  return boardLabels.map((label) => ({
    ...label,
    checked: selectedLabels.some((selected) => selected.id === label.id),
  }));
}

export function getCheckedLabels(labels: LabelWithChecked[]) {
  return labels.filter((label) => label.checked);
}

export function shadeColor(color: string, percent: number) {
  const f = parseInt(color.slice(1),16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent*-1 : percent,
        R = f >> 16,
        G = f >> 8 & 0x00FF,
        B = f & 0x0000FF;
  return "#" + (0x1000000 + (Math.round((t-R)*p/100)+R)*0x10000 + (Math.round((t-G)*p/100)+G)*0x100 + (Math.round((t-B)*p/100)+B)).toString(16).slice(1);
}