import { type Component } from "solid-js";
import "./accordion.css";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";

export const Accordion: Component = () => {
  return (
    <div class="accordion accordion_small">
      <button
        type="button"
        class="accordion__header accordion__header_expanded"
        aria-expanded="true"
      >
        <Icon name={IconName.Trash} size={IconSize.x12} />
        <span class="accordion__title">Гармонь</span>
      </button>
      <div class="accordion__content">Здравствуй небо в облаках</div>
    </div>
  );
};
