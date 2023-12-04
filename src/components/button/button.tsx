import type {Component} from 'solid-js';
import {mergeProps} from "solid-js";
import './button.css'

type ButtonProps = {
    isDisabled?: boolean;
    ariaLabel?: string;
    text: string;
    theme?: "primary" | "secondary" | "dangerous";
    size?: "small" | "medium" | "large";
    isLoading?: boolean;
}
export const Button: Component<ButtonProps> = (props) => {
    const mProps = mergeProps({theme: "primary", size: "small", isDisabled: false, isLoading: false}, props)

    return (
        <button type="button" class={`button button_${mProps.theme} button_${mProps.size}`}
                classList={{button_disabled: mProps.isDisabled, button_loading: mProps.isLoading}}
                disabled={mProps.isDisabled}
                aria-disabled={props.isLoading}
                aria-label={mProps.ariaLabel}>{mProps.text}</button>
    );
}

