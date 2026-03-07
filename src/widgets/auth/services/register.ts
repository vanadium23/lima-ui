import { BACKEND_URL_USERS } from "../../../../utilities/addresses.ts";

export type Account = {
  email: string;
  password: string;
  passwordConfirmation?: string;
};

export async function registerNewAccount(
  data: Account,
  backendURL = import.meta.env.PUBLIC_API_URL,
): Promise<undefined> {
  const response = await fetch(backendURL + BACKEND_URL_USERS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }

  return await response.json();
}

export async function loginToAccount(data: Account, isMockFailure: boolean): Promise<boolean> {
  const response = new Promise<boolean>((resolve, reject) => {
    setTimeout(() => {
      if (isMockFailure) {
        reject("Network response was not ok ");
      } else {
        console.log("You was successfully logged in:", data);
        resolve(true);
      }
    }, 3000);
  });

  return await response;
}

export async function requestPasswordRestore(email: string, isMockFailure: boolean): Promise<boolean> {
  const response = new Promise<boolean>((resolve, reject) => {
    setTimeout(() => {
      if (isMockFailure) {
        reject("Network response was not ok ");
      } else {
        console.log("Request for password restoration was send to:", email);
        resolve(true);
      }
    }, 3000);
  });

  return await response;
}

export async function requestPasswordChange(password: string, token: string, isMockFailure: boolean): Promise<boolean> {
  const response = new Promise<boolean>((resolve, reject) => {
    setTimeout(() => {
      if (isMockFailure) {
        reject("Network response was not ok ");
      } else {
        console.log(`Request for set password: ${password}. Token: ${token}`);
        resolve(true);
      }
    }, 3000);
  });

  return await response;
}
