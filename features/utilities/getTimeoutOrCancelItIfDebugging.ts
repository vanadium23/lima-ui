export function getTimeoutOrCancelItIfDebugging(milliseconds: number) {
  return process.env.PWDEBUG === "1" ? -1 : milliseconds;
}
