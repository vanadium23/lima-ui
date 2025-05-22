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

import "./note.css";

export enum NoteTheme {
  Primary = "primary",
}

export enum NoteSize {
  Medium = "medium",
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

export const Note = (props: NoteProps) => {
  const mProps: Required<NoteProps> = mergeProps(
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
    [NoteSize.Medium]: AccordionSize.Medium,
  };

  const textareaSize = {
    [NoteSize.Medium]: TextareaSize.Medium,
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
