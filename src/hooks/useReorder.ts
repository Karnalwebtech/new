// hooks/useReorder.ts
import { useRef } from "react";

export function moveByIndex<T>(arr: T[], from: number, to: number) {
  const copy = [...arr];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}

// For arrays of objects with _id
export function useReorder<T extends { _id: string }>(
  setOrdered: React.Dispatch<React.SetStateAction<T[]>>
) {
  const dragFrom = useRef<number | null>(null);

  const onDragStart = (idx: number) => () => {
    dragFrom.current = idx;
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragFrom.current === null || dragFrom.current === toIndex) return;
    setOrdered((prev) => moveByIndex(prev, dragFrom.current as number, toIndex));
    dragFrom.current = null;
  };

  return { onDragStart, onDragOver, onDrop };
}

// For arrays of strings
export function useStringReorder(
  setOrdered: React.Dispatch<React.SetStateAction<string[]>>
) {
  const dragFrom = useRef<number | null>(null);

  const onDragStart = (idx: number) => () => {
    dragFrom.current = idx;
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragFrom.current === null || dragFrom.current === toIndex) return;
    setOrdered((prev) => moveByIndex(prev, dragFrom.current as number, toIndex));
    dragFrom.current = null;
  };

  return { onDragStart, onDragOver, onDrop };
}