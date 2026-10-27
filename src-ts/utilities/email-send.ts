// SMTP email sending. Mirrors src/auth/utilities/email_send.clj:
// nodemailer transport from SMTP_* env, the shared HTML template from
// resources/email/template/index.html with {placeholder} substitution,
// registration (rgt_) and password-reset (rst_) letters. The suite only
// asserts the subject predicates and the token link in the body.
import { readFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";

// Repo root layout: src-ts/utilities/email-send.ts → ../../resources.
const EMAIL_TEMPLATE_PATH = path.join(
  import.meta.dirname ?? ".",
  "..",
  "..",
  "resources",
  "email",
  "template",
  "index.html",
);

interface EmailTemplateValues {
  preheader: string;
  mainText: string;
  buttonLink: string;
  buttonText: string;
}

// render-email: sequential {placeholder} replacement, user-agreement /
// unsubscribe links derived from the client address.
const renderEmail = (
  template: string,
  baseUrl: string,
  values: EmailTemplateValues,
): string =>
  template
    .replaceAll("{preheader}", values.preheader)
    .replaceAll("{main-text}", values.mainText)
    .replaceAll("{button-link}", values.buttonLink)
    .replaceAll("{button-text}", values.buttonText)
    .replaceAll("{user-agreement}", `${baseUrl}/user-agreement`)
    .replaceAll(
      "{unsubscribe-from-mailing-list}",
      `${baseUrl}/unsubscribe-from-mailing-list`,
    );

export interface EmailDependencies {
  smtpHost: string;
  smtpPort: number;
  smtpFrom: string;
  clientAddress: string;
}

interface SendOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const sendEmail = async (
  dependencies: EmailDependencies,
  options: SendOptions,
): Promise<void> => {
  const transport = nodemailer.createTransport({
    host: dependencies.smtpHost,
    port: dependencies.smtpPort,
    secure: false,
    // MailSlurper accepts unauthenticated local submissions, same as
    // the postal config the Clojure side uses.
    tls: { rejectUnauthorized: false },
  });
  try {
    await transport.sendMail({
      from: dependencies.smtpFrom,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    // email_send.clj: postal returns a result map instead of throwing —
    // the donor logs the failure and still answers 200 (email is a
    // side effect, never a 500). Mirror: swallow + log.
    console.error(`Failed to send email to ${options.to}:`, error);
  } finally {
    transport.close();
  }
};

const sendTemplatedEmail = async (
  dependencies: EmailDependencies,
  options: SendOptions & { template: EmailTemplateValues },
): Promise<void> => {
  const template = await readFile(EMAIL_TEMPLATE_PATH, "utf8");
  await sendEmail(dependencies, {
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: renderEmail(template, dependencies.clientAddress, options.template),
  });
};

// send-registration-email: welcome subject, /auth?token=<rgt_…> link.
export const sendRegistrationEmail = async (
  dependencies: EmailDependencies,
  userEmail: string,
  token: string,
): Promise<void> => {
  const baseUrl = dependencies.clientAddress;
  await sendTemplatedEmail(dependencies, {
    to: userEmail,
    subject: "Добро пожаловать в Lima - Подтвердите вашу почту",
    text: `Добро пожаловать в Lima!\n\n` +
      `Для подтверждения почты перейдите по ссылке:\n` +
      `${baseUrl}/lists?token=${token}`,
    html: "",
    template: {
      preheader: "Подтвердите email и начните пользоваться Lima",
      mainText:
        "Добро пожаловать в Lima! Для подтверждения вашей электронной почты, " +
        "пожалуйста, нажмите на кнопку ниже." +
        "<br><br>Если вы не запрашивали это письмо, никаких действий не требуется.",
      buttonLink: `${baseUrl}/auth?token=${token}`,
      buttonText: "Подтвердить почту",
    },
  });
};

// send-password-reset-email: reset subject, /auth/reset-password?token=
// <rst_…> link (email_send.clj verbatim texts).
export const sendPasswordResetEmail = async (
  dependencies: EmailDependencies,
  userEmail: string,
  token: string,
): Promise<void> => {
  const baseUrl = dependencies.clientAddress;
  await sendTemplatedEmail(dependencies, {
    to: userEmail,
    subject: "Восстановление пароля Lima",
    text: `Восстановление пароля Lima\n\n` +
      `Для восстановления пароля перейдите по ссылке:\n` +
      `${baseUrl}/auth/reset-password?token=${token}`,
    html: "",
    template: {
      preheader: "Восстановление пароля",
      mainText:
        "Здравствуйте! Мы получили запрос на восстановление пароля для " +
        "вашей учетной записи в Lima. Чтобы установить новый пароль, " +
        "пожалуйста, нажмите на кнопку ниже." +
        "<br><br>Если вы не отправляли этот запрос, никаких действий не требуется.",
      buttonLink: `${baseUrl}/auth/reset-password?token=${token}`,
      buttonText: "Восстановить пароль",
    },
  });
};
