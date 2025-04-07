import type { CollisionDetector, Droppable } from "@thisbeyond/solid-dnd";
import { onCleanup } from "solid-js";

import type { EditListStore, ScrollContainer } from "../types";

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

  function handleMouseMoveForScroll(event: MouseEvent) {
    const { isActive } = options;
    if (!scrollContainer || !isActive()) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const mouseY = event.clientY;

    clearAutoScrollInterval();

    const isMouseAtTheBottom = mouseY > containerRect.bottom - SCROLL_THRESHOLD;
    const isMouseAtTheTop = mouseY < containerRect.top + SCROLL_THRESHOLD;

    if (isMouseAtTheTop) {
      const scrollSpeed = Math.max(
        1,
        SCROLL_SPEED * (1 - (mouseY - containerRect.top) / SCROLL_THRESHOLD),
      );

      autoScrollInterval = setInterval(() => {
        if (!scrollContainer) return;

        scrollContainer.scrollTop = Math.max(
          0,
          scrollContainer.scrollTop - scrollSpeed,
        );
      }, MILLISECONDS_PER_FRAME);
    } else if (isMouseAtTheBottom) {
      const scrollSpeed = Math.max(
        1,
        SCROLL_SPEED * (1 - (containerRect.bottom - mouseY) / SCROLL_THRESHOLD),
      );

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
    document.addEventListener("mousemove", handleMouseMoveForScroll);
  }

  function stopListening() {
    clearAutoScrollInterval();
    scrollContainer = undefined;
    document.removeEventListener("mousemove", handleMouseMoveForScroll);
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

const distanceBetweenPoints = (
  firstPoint: DragPoint,
  secondPoint: DragPoint,
): number =>
  Math.sqrt(
    (firstPoint.x - secondPoint.x) ** 2 + (firstPoint.y - secondPoint.y) ** 2,
  );

type ScrollableCollisionDetectorCreator = (
  scrollContainer: ScrollContainer,
  store: EditListStore,
) => CollisionDetector;

export const createScrollableCollisionsDetector: ScrollableCollisionDetectorCreator =
  (scrollContainer, store) => (draggable, droppables) => {
    const draggableCenter = draggable.transformed.center;
    const itemsScrollCurrentPosition = scrollContainer?.scrollTop || 0;
    const scrollChange =
      itemsScrollCurrentPosition - store.itemsScrollStartPosition;

    let distanceToDroppable = Infinity;
    let droppable: Droppable | null = null;

    droppables.forEach((droppableCandidate) => {
      const nodeCenter = {
        ...droppableCandidate.layout.center,
        y: droppableCandidate.layout.y - scrollChange,
      };

      const distanceToDroppableCandidate = distanceBetweenPoints(
        draggableCenter,
        nodeCenter,
      );

      if (distanceToDroppableCandidate < distanceToDroppable) {
        distanceToDroppable = distanceToDroppableCandidate;
        droppable = droppableCandidate;
      }
    });

    return droppable;
  };
