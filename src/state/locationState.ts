import { createSignal } from "solid-js";

export const [location, setLocation] = createSignal(window.location.pathname);
export const [urlHash, setUrlHash] = createSignal(window.location.hash);
