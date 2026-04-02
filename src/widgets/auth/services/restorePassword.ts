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
