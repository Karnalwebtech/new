import { useRef } from "react";

export function moveByIndex<T>(arr: T[], from: number, to: number) {
  const copy = [...arr];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}

export function moveIdToIndex<T extends { _id: string }>(arr: T[], id: string, to: number) {
  const from = arr.findIndex((x) => x._id === id);
  if (from === -1 || to < 0 || to >= arr.length) return arr;
  return moveByIndex(arr, from, to);
}

export function useReorder<T extends { _id: string }>(
  setOrdered: React.Dispatch<React.SetStateAction<T[]>>
) {
  const dragFrom = useRef<number | null>(null);

  // Drag + Drop
  const onDragStart = (idx: number) => () => {
    dragFrom.current = idx;
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    // console.log(toIndex)
    if (dragFrom.current === null || dragFrom.current === toIndex) return;
    setOrdered((prev) => moveByIndex(prev, dragFrom.current as number, toIndex));
    dragFrom.current = null;
  };

  // Click reorder helpers
  const moveUp = (id: string) =>
    setOrdered((prev) => {
      const i = prev.findIndex((x) => x._id === id);
      if (i <= 0) return prev;
      return moveByIndex(prev, i, i - 1);
    });

  const moveDown = (id: string) =>
    setOrdered((prev) => {
      const i = prev.findIndex((x) => x._id === id);
      if (i === -1 || i >= prev.length - 1) return prev;
      return moveByIndex(prev, i, i + 1);
    });

  const moveTop = (id: string) => setOrdered((prev) => moveIdToIndex(prev, id, 0));

  const moveBottom = (id: string) =>
    setOrdered((prev) => moveIdToIndex(prev, id, prev.length - 1));

  return {
    onDragStart,
    onDragOver,
    onDrop,
    moveUp,
    moveDown,
    moveTop,
    moveBottom,
  };
}
