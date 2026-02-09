import { For } from "solid-js"; // DOC Импортируйте ваш компонент кнопки
import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Grid } from "../../storybook/grid.tsx";

import { Button, ButtonComponentType, ButtonSize, ButtonTheme, ButtonType } from "./button.tsx";

// DOC Базовые настройки сторис, панели управления
const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["test"],
  argTypes: {
    // DOC Базовые
    children: {
      type: { name: "string", required: true },
      control: { type: "text" },
      description: "Содержимое компонента",
      table: {
        type: {
          summary: "JSX | string",
        },
      },
    },

    // DOC Внешний вид
    theme: {
      type: { name: "string" },
      control: {
        type: "select",
      },
      options: Object.values(ButtonTheme),
      description: "Визуальная тема компонента",
      table: {
        defaultValue: { summary: "primary", detail: "Задано по умолчанию в mergeProps" },
        category: "Внешний вид",
        type: {
          summary: "enum",
          detail: "Например ButtonTheme.Primary",
        },
      },
    },
    size: {
      control: { type: "select" },
      options: Object.values(ButtonSize),
      description: "Размер компонента",
      table: {
        defaultValue: { summary: "medium", detail: "Задано по умолчанию в mergeProps" },
        category: "Внешний вид",
        type: {
          summary: "enum",
          detail: "Например ButtonSize.Medium",
        },
      },
    },

    // DOC Состояния
    disabled: {
      control: { type: "boolean" },
      if: { arg: "loading", truthy: false },
      description: "Полная блокировка кнопки",
      table: {
        defaultValue: { summary: "false", detail: "Задано по умолчанию в mergeProps" },
        category: "Состояния",
      },
    },
    loading: {
      control: { type: "boolean" },
      if: { arg: "disabled", truthy: false },
      description:
        "Частичная блокировка, клик блокируется, кнопка остается фокусируемой и появляется Loader. Это состояние не предусмотрено для ссылок",
      table: {
        defaultValue: { summary: "false", detail: "Задано по умолчанию в mergeProps" },
        category: "Состояния",
      },
    },

    // DOC Специализированные

    componentType: {
      type: { name: "string" },
      control: { type: "select" },
      options: Object.values(ButtonComponentType),
      description: "Тип компонента Кнопка или Ссылка",
      table: {
        defaultValue: { summary: "button", detail: "Задано по умолчанию в mergeProps." },
        category: "Специализированные",
        type: {
          summary: "enum",
          detail: "Например ComponentTypeComponentName.ComponentType",
        },
      },
    },
    type: {
      type: { name: "string" },
      if: { arg: "componentType", eq: "button" },
      control: { type: "select" },
      options: Object.values(ButtonType),
      description: "Тип кнопки указываемый в HTML атрибуте type",
      table: {
        defaultValue: { summary: "button", detail: "Задано по умолчанию в mergeProps." },
        category: "Специализированные",
        type: {
          summary: "enum",
          detail: "Например ComponentNameType.ComponentType",
        },
      },
    },
    href: {
      type: { name: "string", required: true },
      control: { type: "text" },
      if: { arg: "componentType", eq: "link" },
      description: "URL, используется только с типом `Ссылка`",
      table: {
        type: {
          summary: "string",
        },
        category: "Специализированные",
      },
    },
    openInNewTab: {
      control: { type: "boolean" },
      if: { arg: "componentType", eq: "link" },
      description: "Добавляет атрибут target _blank и используется только с типом Ссылка",
      table: {
        defaultValue: { summary: "false", detail: "Задано по умолчанию в mergeProps" },
        category: "Специализированные",
      },
    },
    // DOC Действия
    handleClick: {
      type: { name: "function", required: true },
      if: { arg: "componentType", eq: "button" },
      action: "clicked",
      description: "Обработчик клика.",
      table: {
        category: "Действия",
      },
    },
    // DOC Тестирование
    testId: {
      type: { name: "string", required: true },
      control: { type: "text" },
      description: "Этот вид ID используется для идентификации элемента тестами",
      table: {
        category: "Тестирование",
      },
    },
    testSubId: {
      type: { name: "string" },
      control: { type: "text" },
      description:
        "Этот вид ID используется для идентификации конкретного элемента тестами при множественного рендере, например когда компоненты рендерятся циклом",
      table: {
        category: "Тестирование",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    theme: ButtonTheme.Primary,
    size: ButtonSize.Medium,
    children: "Кнопка",
    disabled: false,
    loading: false,
    type: ButtonType.Button,
    componentType: ButtonComponentType.Button,
    openInNewTab: false,
    href: "",
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "10px", "flex-wrap": "wrap", "flex-direction": "column" }}>
      <For each={Object.values(ButtonTheme)}>
        {(theme) => (
          <div style={{ display: "flex", gap: "10px", "flex-wrap": "wrap", "align-items": "center" }}>
            <span style={{ "min-width": "100px", "font-weight": "bold" }}>{theme}:</span>
            <For each={Object.values(ButtonSize)}>
              {(size) => (
                <Button {...args} theme={theme} size={size}>
                  Text
                </Button>
              )}
            </For>
          </div>
        )}
      </For>
      <Grid>{() => <Button testId={"123"}>Test</Button>}</Grid>
    </div>
  ),
  args: {
    disabled: false,
    loading: false,
    testId: "testID",
  },
};
