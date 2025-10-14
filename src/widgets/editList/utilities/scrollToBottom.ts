import type { ScrollContainer } from "../../../types/types.ts";

export const scroller: { scrollContainer: ScrollContainer; scrollToBottom: () => void } = {
  scrollContainer: undefined,
  scrollToBottom: function () {
    requestAnimationFrame(() => {
      if (this.scrollContainer) {
        this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
      }
    });
  },
};
