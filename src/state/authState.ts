import { createRoot, createSignal } from "solid-js";

export const authState = createRoot(() => {
  const [isAuthorized, setIsAuthorized] = createSignal(true);

  const login = () => setIsAuthorized(true);
  const logout = () => setIsAuthorized(false);

  return {
    isAuthorized,
    login,
    logout,
  };
});
