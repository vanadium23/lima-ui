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
