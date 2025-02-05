import { mergeProps } from "solid-js";
import { NOTE_TEXT_AREA_LIMIT } from "../../../configuration.ts";
import { NOTE_ACCORDION, NOTE_TEXT_AREA } from "../../../features/testIds.ts";
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
import type { Testable } from "../utilities/testable.ts";
import "./note.css";

export enum NoteTheme {
  Primary = "primary",
}

export enum NoteSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

type NoteProps = {
  theme?: NoteTheme;
  size?: NoteSize;
  isDisabled?: boolean;
  title?: string;
  name?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export const Note = (props: Testable<NoteProps>) => {
  const mProps: Testable<Required<NoteProps>> = mergeProps(
    {
      theme: NoteTheme.Primary,
      size: NoteSize.Medium,
      title: "Заметка",
      name: "Note",
      isDisabled: false,
      isLoading: false,
      defaultValue: "",
      onChange: () => {},
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
      <Textarea
        theme={TextareaTheme.Secondary}
        size={textareaSize[mProps.size]}
        placeholder={"Дополнительная информация о списке"}
        name={mProps.name}
        maxLength={NOTE_TEXT_AREA_LIMIT}
        isDisabled={mProps.isDisabled}
        testId={NOTE_TEXT_AREA}
        defaultValue={mProps.defaultValue}
        onChange={mProps.onChange}
      />
    </Accordion>
  );
};
