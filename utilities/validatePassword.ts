export function validatePassword(pass: string): boolean {
  const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~]{8,}$/;

  return passRegex.test(pass);
}
