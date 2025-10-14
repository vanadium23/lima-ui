export function soften<T>(act: () => T | Promise<T>, time = 500): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const result = await act();

        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, time);
  });
}
