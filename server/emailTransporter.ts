// Email transporter configuration for FloreSer
// Note: Install nodemailer when ready for production email sending

export function createTransporter() {
  // Check if email configuration is available
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('Email configuration not found. Emails will be logged to console instead.');
    return null;
  }

  // Mock transporter for development (replace with nodemailer when ready)
  const mockTransporter = {
    sendMail: async (mailOptions: any) => {
      console.log('📧 EMAIL SENT (Mock):');
      console.log(`From: ${mailOptions.from}`);
      console.log(`To: ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Text: ${mailOptions.text}`);
      console.log('---');
      return { messageId: 'mock-' + Date.now() };
    },
    verify: (callback: any) => {
      console.log('Email transporter ready (mock mode)');
      callback(null, true);
    }
  };

  return mockTransporter;

  // When ready for production, uncomment and install nodemailer:
  /*
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransporter({
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

  transporter.verify((error: any, success: any) => {
    if (error) {
      console.error('Email transporter verification failed:', error);
    } else {
      console.log('Email server is ready to send messages');
    }
  });

  return transporter;
  */
}