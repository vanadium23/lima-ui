import type { CollisionDetector, Droppable } from "@thisbeyond/solid-dnd";
import { onCleanup } from "solid-js";

import type { EditListStore, Items, ScrollContainer } from "../../../types/types.ts";

import { createDragId } from "./createDefaultItem.ts";

const SCROLL_SPEED = 10; // Base scrolling speed
const SCROLL_THRESHOLD = 100; // Pixels from edge to trigger scrolling
const MILLISECONDS_PER_FRAME = 16; // For smooth 60fps-like scrolling

type AutoScrollOptions = {
  isActive: () => boolean;
};

export function createAutoScroll(options: AutoScrollOptions) {
  let autoScrollInterval: ReturnType<typeof setInterval> | undefined;
  let scrollContainer: ScrollContainer | undefined;

  function clearAutoScrollInterval() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = undefined;
    }
  }

  function handlePointerMoveForScroll(event: MouseEvent | TouchEvent) {
    const { isActive } = options;
    if (!scrollContainer || !isActive()) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const clientY = "touches" in event ? event.touches[0]?.clientY || 0 : event.clientY;

    clearAutoScrollInterval();

    const isPointerAtTheBottom = clientY > containerRect.bottom - SCROLL_THRESHOLD;
    const isPointerAtTheTop = clientY < containerRect.top + SCROLL_THRESHOLD;

    if (isPointerAtTheTop) {
      const scrollSpeed = Math.max(1, SCROLL_SPEED * (1 - (clientY - containerRect.top) / SCROLL_THRESHOLD));

      autoScrollInterval = setInterval(() => {
        if (!scrollContainer) return;

        scrollContainer.scrollTop = Math.max(0, scrollContainer.scrollTop - scrollSpeed);
      }, MILLISECONDS_PER_FRAME);
    } else if (isPointerAtTheBottom) {
      const scrollSpeed = Math.max(1, SCROLL_SPEED * (1 - (containerRect.bottom - clientY) / SCROLL_THRESHOLD));

      autoScrollInterval = setInterval(() => {
        if (!scrollContainer) return;

        scrollContainer.scrollTop = Math.min(
          scrollContainer.scrollHeight - scrollContainer.clientHeight,
          scrollContainer.scrollTop + scrollSpeed,
        );
      }, MILLISECONDS_PER_FRAME);
    }
  }

  function startListening(scrollableParent: ScrollContainer) {
    scrollContainer = scrollableParent;
    document.addEventListener("mousemove", handlePointerMoveForScroll);
    document.addEventListener("touchmove", handlePointerMoveForScroll);
  }

  function stopListening() {
    clearAutoScrollInterval();
    scrollContainer = undefined;
    document.removeEventListener("mousemove", handlePointerMoveForScroll);
    document.removeEventListener("touchmove", handlePointerMoveForScroll);
  }

  onCleanup(() => {
    stopListening();
  });

  return {
    startListening,
    stopListening,
  };
}

type DragPoint = {
  x: number;
  y: number;
};

const distanceBetweenPoints = (firstPoint: DragPoint, secondPoint: DragPoint): number =>
  Math.sqrt((firstPoint.x - secondPoint.x) ** 2 + (firstPoint.y - secondPoint.y) ** 2);

type ScrollableCollisionDetectorCreator = (scrollContainer: ScrollContainer, store: EditListStore) => CollisionDetector;

export const createScrollableCollisionsDetector: ScrollableCollisionDetectorCreator =
  (scrollContainer, store) => (draggable, droppables) => {
    const draggableCenter = draggable.transformed.center;
    const itemsScrollCurrentPosition = scrollContainer?.scrollTop || 0;
    const scrollChange = itemsScrollCurrentPosition - store.itemsScrollStartPosition;

    let distanceToDroppable = Infinity;
    let droppable: Droppable | null = null;

    for (const droppableCandidate of droppables) {
      const nodeCenter = {
        ...droppableCandidate.layout.center,
        y: droppableCandidate.layout.y - scrollChange,
      };

      const distanceToDroppableCandidate = distanceBetweenPoints(draggableCenter, nodeCenter);

      if (distanceToDroppableCandidate < distanceToDroppable) {
        distanceToDroppable = distanceToDroppableCandidate;
        droppable = droppableCandidate;
      }
    }

    return droppable;
  };

export function convertItemsToDragItems(items: Items) {
  return items.map((item) => ({
    ...item,
    dragId: item.id || createDragId(),
    auto: false,
  }));
}
