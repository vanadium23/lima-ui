import type { Preview } from "storybook-solidjs-vite";
import "normalize.css/normalize.css";
import "../src/layouts/main.css";

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
      disableSaveFromUI: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
