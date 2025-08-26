// useCategoryDragSystem.ts
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ProductCategoryFormData } from "@/types/product-type";

/* =========================
   Types
========================= */
export type ChildItem = {
  id: string;
  name: string;
  order: number;
  isNew?: boolean;
};

export type Category = {
  id: string;
  name: string;
  order: number; // local visual order
  rank: number;  // rank sort (desc), then order (asc)
  children: ChildItem[];
  isExpanded: boolean;
  icon: string;
};

type DragState =
  | { type: null; draggedId: null }
  | { type: "category"; draggedId: string; startY: number; startX: number }
  | {
      type: "child";
      draggedId: string;
      draggedCategoryId: string;
      startX: number;
      startY: number;
    };

/** shape sent to backend */
export type CategoryOrderChange = { id: string; order: number };
export type ChildOrderChange = { id: string; order: number; parentId: string };

type Snapshot = {
  // top-level category order
  catOrder: Record<string, number>;
  // child order keyed by parent
  childOrder: Record<string, Record<string, number>>;
  // parent map to detect re-parenting
  parentOf: Record<string, string | null>; // null for top-level cats, categoryId for children
};

/* =========================
   Utils
========================= */
const toId = (v: unknown): string | undefined => {
  if (!v) return undefined;
  if (typeof v === "string") return v;
  try {
    const s = (v as any)?.toString?.();
    return typeof s === "string" && s ? s : undefined;
  } catch {
    return undefined;
  }
};

const toNum = (v: unknown, fallback = 0): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const n = parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
};

const normalize = (result: ProductCategoryFormData[] | undefined | null) => {
  const list: Category[] = [];
  (result ?? []).forEach((r, idx) => {
    const id = toId((r as any).id ?? (r as any)._id);
    if (!id) return;

    const name = (r as any).name ?? "Untitled";
    const rank = toNum((r as any).rank, 0);

    const children: ChildItem[] = Array.isArray((r as any).children)
      ? (r as any).children.map((ch: any, i: number) => ({
          id: String(ch?.id ?? ch?._id ?? `${id}-child-${i}`),
          name: String(ch?.name ?? `Child ${i + 1}`),
          order: typeof ch?.order === "number" ? ch.order : i,
          isNew: Boolean(ch?.isNew ?? false),
        }))
      : [];

    list.push({
      id,
      name,
      order: idx,
      rank,
      children,
      isExpanded: false,
      icon: "folder",
    });
  });
  return list;
};

/* Build a snapshot from current categories state */
const buildSnapshot = (cats: Category[]): Snapshot => {
  const catOrder: Record<string, number> = {};
  const childOrder: Record<string, Record<string, number>> = {};
  const parentOf: Record<string, string | null> = {};

  cats.forEach((c) => {
    catOrder[c.id] = c.order;
    parentOf[c.id] = null; // top-level
    if (!childOrder[c.id]) childOrder[c.id] = {};
    c.children.forEach((ch) => {
      childOrder[c.id][ch.id] = ch.order;
      parentOf[ch.id] = c.id;
    });
  });

  return { catOrder, childOrder, parentOf };
};

/* =========================
   Hook
========================= */
export function useCategoryDragSystem(
  result: ProductCategoryFormData[] | null | undefined
) {
  // Normalize from API
  const initialCategories = useMemo(() => normalize(result), [result]);

  // Editable state
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  useEffect(() => setCategories(initialCategories), [initialCategories]);

  // Drag state
  const [dragState, setDragState] = useState<DragState>({
    type: null,
    draggedId: null,
  });

  /* ---------- Snapshot + Diff ---------- */
  const initialRef = useRef<Snapshot>(buildSnapshot(initialCategories));
  useEffect(() => {
    // refresh baseline whenever result/initial changes
    initialRef.current = buildSnapshot(initialCategories);
  }, [initialCategories]);

  const getCategoryOrderChanges = useCallback((): CategoryOrderChange[] => {
    const snap = initialRef.current;
    const changes: CategoryOrderChange[] = [];
    categories.forEach((c) => {
      if (snap.catOrder[c.id] !== c.order) {
        changes.push({ id: c.id, order: c.order });
      }
    });
    return changes;
  }, [categories]);

  const getChildOrderChanges = useCallback((): ChildOrderChange[] => {
    const snap = initialRef.current;
    const changes: ChildOrderChange[] = [];

    categories.forEach((parent) => {
      parent.children.forEach((ch) => {
        const prevParent = snap.parentOf[ch.id];
        const prevOrder =
          prevParent && snap.childOrder[prevParent]
            ? snap.childOrder[prevParent][ch.id]
            : undefined;

        const parentChanged = prevParent !== parent.id;
        const orderChanged = prevOrder !== ch.order;

        if (parentChanged || orderChanged) {
          changes.push({ id: ch.id, order: ch.order, parentId: parent.id });
        }
      });
    });

    return changes;
  }, [categories]);

  const getAllOrderChanges = useCallback(() => {
    return {
      categories: getCategoryOrderChanges(),
      children: getChildOrderChanges(),
    };
  }, [getCategoryOrderChanges, getChildOrderChanges]);

  /** call after successful save to make current state the new baseline */
  const commitOrderSnapshot = useCallback(() => {
    initialRef.current = buildSnapshot(categories);
  }, [categories]);

  /* ---------- Mouse handlers ---------- */
  const onCategoryMouseDown = useCallback(
    (e: React.MouseEvent, categoryId: string) => {
      e.preventDefault();
      setDragState({
        type: "category",
        draggedId: categoryId,
        startY: e.clientY,
        startX: e.clientX,
      });
    },
    []
  );

  const onChildMouseDown = useCallback(
    (e: React.MouseEvent, childId: string, categoryId: string) => {
      e.preventDefault();
      setDragState({
        type: "child",
        draggedId: childId,
        draggedCategoryId: categoryId,
        startX: e.clientX,
        startY: e.clientY,
      });
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.draggedId) return;

      /* ----- CATEGORY DRAG ----- */
      if (dragState.type === "category") {
        const { startY, startX } = dragState;
        if (!startY || !startX) return;

        const deltaY = e.clientY - startY;
        const deltaX = e.clientX - startX;
        const threshold = 50;

        // Horizontal → make dragged child of previous, promote its children
        if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0) {
            setCategories((prev) => {
              const sorted = [...prev].sort((a, b) => a.order - b.order);
              const currentIndex = sorted.findIndex((c) => c.id === dragState.draggedId);
              if (currentIndex <= 0) return prev;

              const dragged = sorted[currentIndex];
              const target = sorted[currentIndex - 1];

              // Promote dragged's children to top-level
              const promotedChildren: Category[] = dragged.children.map((ch) => ({
                id: ch.id,
                name: ch.name,
                order: 0,
                rank: 0,
                children: [],
                isExpanded: false,
                icon: "folder",
              }));

              // Remove dragged from top-level
              const withoutDragged = prev.filter((c) => c.id !== dragged.id);

              // Add dragged as child to target + concat promoted children
              const merged = withoutDragged
                .map((c) =>
                  c.id === target.id
                    ? {
                        ...c,
                        children: [
                          ...c.children,
                          { id: dragged.id, name: dragged.name, order: c.children.length },
                        ],
                        isExpanded: true,
                      }
                    : c
                )
                .concat(promotedChildren);

              return merged.map((c, i) => ({ ...c, order: i }));
            });
          }
          // reset X anchor
          setDragState((s) => (s.type ? { ...s, startX: e.clientX } : s));
          return;
        }

        // Vertical: reorder categories
        if (Math.abs(deltaY) > threshold) {
          const direction = deltaY > 0 ? 1 : -1;

          setCategories((prev) => {
            const sorted = [...prev].sort((a, b) => a.order - b.order);
            const idx = sorted.findIndex((c) => c.id === dragState.draggedId);
            if (idx < 0) return prev;

            const newIndex = Math.min(Math.max(idx + direction, 0), sorted.length - 1);
            if (newIndex === idx) return prev;

            const copy = [...sorted];
            const [item] = copy.splice(idx, 1);
            copy.splice(newIndex, 0, item);

            return copy.map((c, i) => ({ ...c, order: i }));
          });

          // reset Y anchor
          setDragState((s) => (s.type ? { ...s, startY: e.clientY } : s));
        }
      }

      /* ----- CHILD DRAG ----- */
      if (dragState.type === "child") {
        const { draggedCategoryId, startX, startY } = dragState;
        if (!draggedCategoryId || !startX || !startY) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        const thresholdX = 80;
        const thresholdY = 50;

        // Vertical: reorder within same parent
        if (Math.abs(deltaY) > thresholdY && Math.abs(deltaY) > Math.abs(deltaX)) {
          const direction = deltaY > 0 ? 1 : -1;

          setCategories((prev) => {
            const parentIdx = prev.findIndex((c) => c.id === draggedCategoryId);
            if (parentIdx < 0) return prev;

            const parent = prev[parentIdx];
            const children = [...parent.children].sort((a, b) => a.order - b.order);
            const idx = children.findIndex((ch) => ch.id === dragState.draggedId);
            if (idx < 0) return prev;

            const newIndex = Math.min(Math.max(idx + direction, 0), children.length - 1);
            if (newIndex === idx) return prev;

            const moved = children[idx];
            children.splice(idx, 1);
            children.splice(newIndex, 0, moved);

            const reindexed = children.map((ch, i) => ({ ...ch, order: i }));

            const next = [...prev];
            next[parentIdx] = { ...parent, children: reindexed };
            return next;
          });

          // reset Y anchor
          setDragState((s) => (s.type ? { ...s, startY: e.clientY } : s));
          return;
        }

        // Horizontal: promote to top-level (←) OR move to next category (→)
        if (Math.abs(deltaX) > thresholdX) {
          setCategories((prev) => {
            const sourceIdx = prev.findIndex((c) => c.id === draggedCategoryId);
            if (sourceIdx < 0) return prev;

            const source = prev[sourceIdx];
            const child = source.children.find((ch) => ch.id === dragState.draggedId);
            if (!child) return prev;

            if (deltaX < 0) {
              // Promote child to top-level
              const asCategory: Category = {
                id: child.id,
                name: child.name,
                order: prev.length,
                rank: 0,
                children: [],
                isExpanded: false,
                icon: "folder",
              };

              const next = prev.map((c) =>
                c.id === source.id
                  ? {
                      ...c,
                      children: c.children
                        .filter((ch) => ch.id !== child.id)
                        .map((ch, i) => ({ ...ch, order: i })),
                    }
                  : c
              );

              return next.concat(asCategory).map((c, i) => ({ ...c, order: i }));
            } else {
              // Move child to next sibling category
              const sorted = [...prev].sort((a, b) => a.order - b.order);
              const currentIndex = sorted.findIndex((c) => c.id === source.id);
              const nextIndex = currentIndex + 1;
              if (nextIndex >= sorted.length) return prev;

              const target = sorted[nextIndex];

              return prev.map((c) => {
                if (c.id === source.id) {
                  return {
                    ...c,
                    children: c.children
                      .filter((ch) => ch.id !== child.id)
                      .map((ch, i) => ({ ...ch, order: i })),
                  };
                }
                if (c.id === target.id) {
                  return {
                    ...c,
                    children: [
                      ...c.children,
                      {
                        id: child.id,
                        name: child.name,
                        order: c.children.length,
                        isNew: child.isNew,
                      },
                    ],
                    isExpanded: true,
                  };
                }
                return c;
              });
            }
          });

          // reset X anchor
          setDragState((s) => (s.type ? { ...s, startX: e.clientX } : s));
        }
      }
    },
    [dragState]
  );

  const handleMouseUp = useCallback(() => {
    setDragState({ type: null, draggedId: null });
  }, []);

  // Global listeners while dragging
  useEffect(() => {
    if (!dragState.draggedId) return;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState.draggedId, handleMouseMove, handleMouseUp]);

//   /* ---------- Public helpers ---------- */
//   const addCategory = useCallback(() => {
//     setCategories((prev) => {
//       const newCategory: Category = {
//         id: Date.now().toString(),
//         name: `New Category ${prev.length + 1}`,
//         order: prev.length,
//         rank: 0,
//         children: [],
//         isExpanded: false,
//         icon: "folder",
//       };
//       return [...prev, newCategory];
//     });
//   }, []);

  const addChild = useCallback((categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId) return c;
        const newChild: ChildItem = {
          id: `${categoryId}-${Date.now()}`,
          name: `New Item ${c.children.length + 1}`,
          order: c.children.length,
        };
        return { ...c, children: [...c.children, newChild] };
      })
    );
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, isExpanded: !c.isExpanded } : c))
    );
  }, []);

  // Render order: rank desc, then order asc
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      if (b.rank !== a.rank) return b.rank - a.rank;
      return a.order - b.order;
    });
  }, [categories]);

  return {
    // state
    categories,
    sortedCategories,

    // drag bindings
    onCategoryMouseDown,
    onChildMouseDown,

    // actions
    // addCategory,
    addChild,
    toggleCategory,

    // diff utils
    getCategoryOrderChanges,
    getChildOrderChanges,
    getAllOrderChanges,
    commitOrderSnapshot,

    // optional setters
    setCategories,
    setDragState,
  };
}
