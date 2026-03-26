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