export type NewAccount = {
  email: string;
  password: string;
};

export async function registerNewAccount(data: NewAccount, isMockFailure: boolean): Promise<boolean> {
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
