import { type Component, mergeProps, Show } from "solid-js";
import "./note.css";
import {
  Accordion,
  AccordionSize,
  AccordionTheme,
} from "../accordion/accordion.tsx";
import {
  Textarea,
  TextareaSize,
  TextareaTheme,
} from "../textarea/textarea.tsx";
import { NOTE_ACCORDION, NOTE_TEXT_AREA } from "../../../features/testIds.ts";
import { NOTE_TEXT_AREA_LIMIT } from "../../../configuration.ts";

export enum NoteTheme {
  Primary = "primary",
}

export enum NoteSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export enum NoteMode {
  Edit = "edit",
  View = "view",
}

type NoteProps = {
  theme: NoteTheme;
  isDisabled?: boolean;
  size: NoteSize;
  title: string;
  name: string;
  defaultValue?: string;
  mode: NoteMode;
};

export const Note: Component<NoteProps> = (props) => {
  const mProps: Required<NoteProps> = mergeProps(
    {
      title: "Note",
      isDisabled: false,
      isLoading: false,
      defaultValue: "",
    },
    props,
  );

  const accordionSize = {
    [NoteSize.Small]: AccordionSize.Small,
    [NoteSize.Medium]: AccordionSize.Medium,
    [NoteSize.Large]: AccordionSize.Large,
  };

  const textareaSize = {
    [NoteSize.Small]: TextareaSize.Small,
    [NoteSize.Medium]: TextareaSize.Medium,
    [NoteSize.Large]: TextareaSize.Large,
  };

  return (
    <Accordion
      theme={AccordionTheme.Primary}
      size={accordionSize[mProps.size]}
      title={mProps.title}
      isDisabled={mProps.isDisabled}
      testId={NOTE_ACCORDION}
    >
      <Show
        when={mProps.mode === NoteMode.View}
        fallback={
          <Textarea
            theme={TextareaTheme.Secondary}
            size={textareaSize[mProps.size]}
            placeholder={"Дополнительная информация о списке"}
            name={mProps.name}
            maxLength={NOTE_TEXT_AREA_LIMIT}
            isDisabled={mProps.isDisabled}
            testId={NOTE_TEXT_AREA}
            defaultValue={mProps.defaultValue}
          />
        }
      >
        <span class={`note note_${mProps.theme} note_${mProps.size}`}>
          {mProps.defaultValue}
        </span>
      </Show>
    </Accordion>
  );
};
