import nodemailer from "nodemailer";

const host = process.env.BREVO_SMTP_HOST!;
const port = Number(process.env.BREVO_SMTP_PORT || 587);
const user = process.env.BREVO_SMTP_USER!;
const pass = process.env.BREVO_SMTP_PASS!;
const from = process.env.BREVO_FROM_EMAIL!;

export async function sendEmail(to: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587/2525
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
}
