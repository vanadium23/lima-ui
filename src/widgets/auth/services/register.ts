export type Account = {
  email: string;
  password: string;
};

export async function registerNewAccount(data: Account, isMockFailure: boolean): Promise<boolean> {
  const response = new Promise<boolean>((resolve, reject) => {
    setTimeout(() => {
      if (isMockFailure) {
        reject("Network response was not ok ");
      } else {
        console.log("New acc was registered:", data);
        resolve(true);
      }
    }, 3000);
  });

  return await response;
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
