import type {Component} from 'solid-js';
import './basicInput.css'

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
    return (
        <div class="input" classList={{input_error: props.isError, input_disabled: props.isDisabled}}>
            <input type={props.type} class="input__inner" disabled={props.isDisabled} maxlength={props.maxLength}
                   placeholder={props.placeholder} required={props.isRequired} readonly={props.isReadonly}/>
        </div>
    );
}
