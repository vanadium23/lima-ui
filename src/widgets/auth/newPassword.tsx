import { NewPasswordForm } from "./components/newPasswordForm/newPasswordForm.tsx";
import "./newPassword.css";

export const NewPassword = () => {
  return (
    <div class="newPassword">
      <div class="newPassword__form">
        <NewPasswordForm />
      </div>
    </div>
  );
};
