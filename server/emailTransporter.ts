import nodemailer from "nodemailer";

export function createTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('SMTP not configured — emails will be logged to console.');
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort || '587'),
    secure: parseInt(smtpPort || '587') === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP verification failed:', error.message);
    } else {
      console.log('SMTP ready to send emails');
    }
  });

  return transporter;
}
