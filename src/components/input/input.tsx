import type {Component} from 'solid-js';
import './input.css'
import clsx from "clsx";

type InputProps = {
    isError: boolean;
    isDisabled: boolean;
    placeholder: string;
    maxLength: number;
    isReadonly: boolean;
    isRequired: boolean;
    type: "text" | "password";
}

export const BasicInput: Component<InputProps> = (props) => {
    const inputClass = clsx("input", {input_error: props.isError, input_disabled: props.isDisabled});

    return (
        <div class={inputClass}>
            <input type={props.type} class="input__inner" disabled={props.isDisabled} maxlength={props.maxLength}
                   placeholder={props.placeholder} required={props.isRequired} readonly={props.isReadonly}/>
        </div>
    );
}
