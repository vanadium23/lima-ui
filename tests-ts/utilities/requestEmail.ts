// utilities.request-email, ported: MailSlurper UI API probing,
// including the donor's polling (slow CI runners may index mail slower
// than the next step executes).
import { request } from "../support/http.ts";
import { is } from "../support/world.ts";

export const MAILSLURPER_API_URL = "http://localhost:8085";
const MAIL_ENDPOINT = "/mail";
const CLEAR_MESSAGES_ENDPOINT = "/message";
const EMAIL_WAIT_TIMEOUT_MS = 10_000;
const EMAIL_POLL_INTERVAL_MS = 500;

type MailItem = Record<string, unknown>;
type EmailFinder = (
  emails: MailItem[],
  emailAddress: string,
) => MailItem | undefined;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Gets every email received by the MailSlurper API (single attempt).
export const requestReceivedEmailsOnce = async (): Promise<MailItem[]> => {
  const response = await request("GET", `${MAILSLURPER_API_URL}${MAIL_ENDPOINT}`);
  if (response.status !== 200) {
    throw new Error(
      `Failed to retrieve emails from MailSlurper: HTTP ${response.status}, body: ${response.text}`,
    );
  }
  return (response.body as { mailItems?: MailItem[] } | null)?.mailItems ?? [];
};

// Polls the API with retry tolerance: transport blips (ECONNRESET —
// the MailSlurper HTTP API drops connections under load, seen in CI)
// are "not yet", not a step failure — the deadline fails the read.
export const requestReceivedEmails = async (): Promise<MailItem[]> => {
  const deadline = Date.now() + EMAIL_WAIT_TIMEOUT_MS;
  for (;;) {
    try {
      return await requestReceivedEmailsOnce();
    } catch (error) {
      if (Date.now() >= deadline) {
        throw error;
      }
      await sleep(EMAIL_POLL_INTERVAL_MS);
    }
  }
};

// Filters the emails sent to the given email address.
export const findEmailsForAddress = (
  emails: MailItem[],
  emailAddress: string,
): MailItem[] =>
  emails.filter((email) =>
    ((email.toAddresses as string[] | undefined) ?? []).includes(emailAddress),
  );

// Finds the first email for the address whose subject satisfies the
// predicate.
const findEmailBySubjectPredicate = (
  emails: MailItem[],
  emailAddress: string,
  subjectPredicate: (subject: string) => boolean,
): MailItem | undefined =>
  findEmailsForAddress(emails, emailAddress).find((email) =>
    subjectPredicate((email.subject as string | undefined) ?? ""),
  );

const registrationSubjectPredicate = (subject: string): boolean =>
  /welcome/i.test(subject) ||
  subject.includes("добро пожаловать") ||
  subject.includes("Добро пожаловать");

// Finds the registration confirmation email for the address.
export const findRegistrationEmail = (
  emails: MailItem[],
  emailAddress: string,
): MailItem | undefined =>
  findEmailBySubjectPredicate(emails, emailAddress, registrationSubjectPredicate);

const passwordResetSubjectPredicate = (subject: string): boolean =>
  /восстановление пароля/iu.test(subject) || /password reset/i.test(subject);

// Finds the password reset email for the address.
export const findPasswordResetEmail = (
  emails: MailItem[],
  emailAddress: string,
): MailItem | undefined =>
  findEmailBySubjectPredicate(emails, emailAddress, passwordResetSubjectPredicate);

// Polls the MailSlurper API until an email satisfying the predicate
// arrives or the timeout expires.
const waitForEmail = async (
  emailAddress: string,
  findEmail: EmailFinder,
): Promise<MailItem | undefined> => {
  const deadline = Date.now() + EMAIL_WAIT_TIMEOUT_MS;
  for (;;) {
    const emails = await requestReceivedEmails();
    const found = findEmail(emails, emailAddress);
    if (found !== undefined) {
      return found;
    }
    if (Date.now() >= deadline) {
      return undefined;
    }
    await sleep(EMAIL_POLL_INTERVAL_MS);
  }
};

// Asserts an email satisfying the predicate was received and returns it.
const checkEmailReceived = async (
  emailAddress: string,
  findEmail: EmailFinder,
  description: string,
): Promise<MailItem> => {
  const foundEmail = await waitForEmail(emailAddress, findEmail);
  const receivedEmails = await requestReceivedEmails();
  is(
    foundEmail !== undefined,
    `Expected to find ${description} for ${emailAddress}, but none was found. Emails received: ${receivedEmails.length}`,
  );
  return foundEmail as MailItem;
};

// Asserts the registration confirmation email was received for the
// address and returns it.
export const checkRegistrationEmailReceived = (
  emailAddress: string,
): Promise<MailItem> =>
  checkEmailReceived(emailAddress, findRegistrationEmail, "registration email");

// Asserts the password reset email was received for the address.
export const checkPasswordResetEmailReceived = (
  emailAddress: string,
): Promise<MailItem> =>
  checkEmailReceived(emailAddress, findPasswordResetEmail, "password reset email");

// Extracts a token matching the pattern from the email body, probing
// the several body fields MailSlurper may provide.
export const extractTokenFromEmailByPattern = (
  email: MailItem,
  pattern: RegExp,
): string | undefined => {
  const bodyFields = [email.body, email.TextBody, email.HTMLBody, email.content];
  const body = bodyFields.find((field) => field !== undefined && field !== null);
  if (body === undefined) {
    return undefined;
  }
  return (body as string).match(pattern)?.[1];
};

// Extracts the registration confirmation token (rgt_<base64url>).
export const extractTokenFromEmail = (email: MailItem): string | undefined =>
  extractTokenFromEmailByPattern(email, /(rgt_[a-zA-Z0-9_-]+)/);

// Extracts the password reset token (rst_<base64url>).
export const extractResetTokenFromEmail = (email: MailItem): string | undefined =>
  extractTokenFromEmailByPattern(email, /(rst_[a-zA-Z0-9_-]+)/);

// Deletes every email from MailSlurper.
export const clearEmails = async (): Promise<void> => {
  const deadline = Date.now() + EMAIL_WAIT_TIMEOUT_MS;
  for (;;) {
    try {
      await request("DELETE", `${MAILSLURPER_API_URL}${CLEAR_MESSAGES_ENDPOINT}`);
      return;
    } catch {
      // DELETE /message has no failure path that matters for the
      // scenarios; transport blips get the same retry budget as reads.
      if (Date.now() >= deadline) {
        return;
      }
      await sleep(EMAIL_POLL_INTERVAL_MS);
    }
  }
};

// Asserts NO password reset email was received for the address.
export const checkNoPasswordResetEmail = async (
  emailAddress: string,
): Promise<void> => {
  const emails = await requestReceivedEmails();
  const foundEmail = findPasswordResetEmail(emails, emailAddress);
  is(
    foundEmail === undefined,
    `Ожидалось отсутствие письма сброса пароля для ${emailAddress}, но письмо найдено. Получено писем: ${emails.length}`,
  );
};
