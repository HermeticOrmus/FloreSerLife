import { createTransporter } from "./emailTransporter";

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface SendEmailOptions {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text: string;
}

// Email service class for FloreSer branded communications
export class EmailService {
  private transporter: any;
  private defaultFrom: string;

  constructor() {
    this.defaultFrom = process.env.SMTP_USER || 'contact@floreser.life';
    this.transporter = createTransporter();
  }

  // Send a generic email
  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.log('Email transporter not configured, logging email to console:');
        console.log(`To: ${options.to}`);
        console.log(`From: ${options.from || this.defaultFrom}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Text: ${options.text}`);
        return true;
      }

      const mailOptions = {
        from: `FloreSer <${options.from || this.defaultFrom}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  // Welcome email for new users
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const template = this.getWelcomeEmailTemplate(userName);
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Survey completion thank you email
  async sendSurveyThankYou(userEmail: string, surveyCode?: string): Promise<boolean> {
    const template = this.getSurveyThankYouTemplate(surveyCode);
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Session confirmation email
  async sendSessionConfirmation(
    userEmail: string,
    sessionDetails: {
      date: string;
      time: string;
      practitionerName: string;
      clientName: string;
      isVirtual: boolean;
      meetingLink?: string;
    }
  ): Promise<boolean> {
    const template = this.getSessionConfirmationTemplate(sessionDetails);
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Session reminder email
  async sendSessionReminder(
    userEmail: string,
    sessionDetails: {
      date: string;
      time: string;
      practitionerName: string;
      clientName: string;
      isVirtual: boolean;
      meetingLink?: string;
    }
  ): Promise<boolean> {
    const template = this.getSessionReminderTemplate(sessionDetails);
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Alpha program invitation email
  async sendAlphaInvitation(userEmail: string, inviteCode?: string): Promise<boolean> {
    const template = this.getAlphaInvitationTemplate(inviteCode);
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Private methods for email templates
  private getWelcomeEmailTemplate(userName: string): EmailTemplate {
    const subject = "🌸 Welcome to FloreSer - Your Wellness Journey Begins";

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to FloreSer</title>
      <style>
        body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #2F4F4F; background-color: #F5F5DC; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #2F4F4F 0%, #D4AF37 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .content { padding: 40px 30px; }
        .cta-button { display: inline-block; background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 20px 0; }
        .footer { background: #F5F5DC; padding: 30px; text-align: center; font-size: 14px; color: #666; }
        .archetype-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .archetype { background: #F5F5DC; padding: 15px; border-radius: 8px; text-align: center; }
        .archetype-emoji { font-size: 24px; margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to FloreSer, ${userName}!</h1>
          <p>Your unique wellness journey begins here 🌸</p>
        </div>

        <div class="content">
          <p>We're thrilled to have you join our community of wellness seekers and practitioners!</p>

          <p>FloreSer is more than just a platform - it's a space where meaningful connections flourish through our unique pollinator archetype system.</p>

          <div class="archetype-grid">
            <div class="archetype">
              <div class="archetype-emoji">🐝</div>
              <strong>Bee</strong><br>
              <small>Grounding & Foundation</small>
            </div>
            <div class="archetype">
              <div class="archetype-emoji">🐦</div>
              <strong>Hummingbird</strong><br>
              <small>Spiritual Guidance</small>
            </div>
            <div class="archetype">
              <div class="archetype-emoji">🦋</div>
              <strong>Butterfly</strong><br>
              <small>Transformation</small>
            </div>
            <div class="archetype">
              <div class="archetype-emoji">🪲</div>
              <strong>Beetle</strong><br>
              <small>Deep Integration</small>
            </div>
          </div>

          <p>Ready to discover which archetype resonates with your journey?</p>

          <center>
            <a href="https://floreser.life" class="cta-button">Explore FloreSer</a>
          </center>

          <p><strong>What's next?</strong></p>
          <ul>
            <li>Complete your profile to unlock personalized recommendations</li>
            <li>Explore our verified practitioners across all archetypes</li>
            <li>Join our Community Garden for shared wisdom and resources</li>
            <li>Earn Seeds through platform engagement</li>
          </ul>
        </div>

        <div class="footer">
          <p>With gratitude,<br><strong>The FloreSer Team</strong></p>
          <p><small>This email was sent from contact@floreser.life</small></p>
        </div>
      </div>
    </body>
    </html>`;

    const text = `
Welcome to FloreSer, ${userName}!

We're thrilled to have you join our community of wellness seekers and practitioners!

FloreSer is more than just a platform - it's a space where meaningful connections flourish through our unique pollinator archetype system:

🐝 Bee - Grounding & Foundation
🐦 Hummingbird - Spiritual Guidance
🦋 Butterfly - Transformation
🪲 Beetle - Deep Integration

What's next?
- Complete your profile to unlock personalized recommendations
- Explore our verified practitioners across all archetypes
- Join our Community Garden for shared wisdom and resources
- Earn Seeds through platform engagement

Visit FloreSer: https://floreser.life

With gratitude,
The FloreSer Team
    `;

    return { subject, html, text };
  }

  private getSurveyThankYouTemplate(surveyCode?: string): EmailTemplate {
    const subject = "🙏 Thank you for helping shape FloreSer";

    const codeSection = surveyCode ? `
      <div style="background: #F5F5DC; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3 style="color: #D4AF37; margin: 0;">Your Early Access Code</h3>
        <p style="font-size: 24px; font-weight: bold; color: #2F4F4F; margin: 10px 0;">${surveyCode}</p>
        <p style="font-size: 14px; color: #666; margin: 0;">Save this code for exclusive benefits when we launch!</p>
      </div>
    ` : '';

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You - FloreSer</title>
      <style>
        body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #2F4F4F; background-color: #F5F5DC; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #2F4F4F 0%, #D4AF37 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .footer { background: #F5F5DC; padding: 30px; text-align: center; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You! 🌸</h1>
          <p>Your voice is helping shape the future of wellness connections</p>
        </div>

        <div class="content">
          <p>We're deeply grateful for your participation in our community survey. Your insights are invaluable as we build a platform that truly serves the wellness community.</p>

          ${codeSection}

          <p>Every response helps us better understand how to create meaningful connections between seekers and practitioners through our innovative archetype system.</p>

          <p><strong>Stay connected:</strong></p>
          <ul>
            <li>Follow our development progress at <a href="https://floreser.life/alpha">floreser.life/alpha</a></li>
            <li>Join our community conversations</li>
            <li>Be the first to know when we launch</li>
          </ul>

          <p>With deep appreciation,<br><strong>The FloreSer Team</strong></p>
        </div>

        <div class="footer">
          <p><small>This email was sent from contact@floreser.life</small></p>
        </div>
      </div>
    </body>
    </html>`;

    const text = `
Thank You!

We're deeply grateful for your participation in our community survey. Your insights are invaluable as we build a platform that truly serves the wellness community.

${surveyCode ? `Your Early Access Code: ${surveyCode}\nSave this code for exclusive benefits when we launch!` : ''}

Every response helps us better understand how to create meaningful connections between seekers and practitioners through our innovative archetype system.

Stay connected:
- Follow our development progress at floreser.life/alpha
- Join our community conversations
- Be the first to know when we launch

With deep appreciation,
The FloreSer Team
    `;

    return { subject, html, text };
  }

  private getSessionConfirmationTemplate(sessionDetails: any): EmailTemplate {
    const subject = `✅ Session Confirmed - ${sessionDetails.date} with ${sessionDetails.practitionerName}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Session Confirmation - FloreSer</title>
      <style>
        body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #2F4F4F; background-color: #F5F5DC; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: #D4AF37; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .session-details { background: #F5F5DC; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Session Confirmed! ✅</h1>
        </div>

        <div class="content">
          <p>Your wellness session has been confirmed. We're excited for your upcoming journey!</p>

          <div class="session-details">
            <h3>Session Details</h3>
            <p><strong>Date:</strong> ${sessionDetails.date}</p>
            <p><strong>Time:</strong> ${sessionDetails.time}</p>
            <p><strong>Practitioner:</strong> ${sessionDetails.practitionerName}</p>
            <p><strong>Format:</strong> ${sessionDetails.isVirtual ? 'Virtual Session' : 'In-Person Session'}</p>
            ${sessionDetails.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${sessionDetails.meetingLink}">${sessionDetails.meetingLink}</a></p>` : ''}
          </div>

          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Add this session to your calendar</li>
            <li>Prepare any questions or intentions for the session</li>
            <li>You'll receive a reminder email 24 hours before</li>
          </ul>
        </div>
      </div>
    </body>
    </html>`;

    const text = `Session Confirmed!

Your wellness session has been confirmed.

Session Details:
- Date: ${sessionDetails.date}
- Time: ${sessionDetails.time}
- Practitioner: ${sessionDetails.practitionerName}
- Format: ${sessionDetails.isVirtual ? 'Virtual Session' : 'In-Person Session'}
${sessionDetails.meetingLink ? `- Meeting Link: ${sessionDetails.meetingLink}` : ''}

Next Steps:
- Add this session to your calendar
- Prepare any questions or intentions for the session
- You'll receive a reminder email 24 hours before`;

    return { subject, html, text };
  }

  private getSessionReminderTemplate(sessionDetails: any): EmailTemplate {
    const subject = `⏰ Session Reminder - Tomorrow at ${sessionDetails.time}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Session Reminder - FloreSer</title>
      <style>
        body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #2F4F4F; background-color: #F5F5DC; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: #2F4F4F; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .session-details { background: #F5F5DC; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Session Reminder ⏰</h1>
        </div>

        <div class="content">
          <p>Your wellness session is scheduled for tomorrow. We're looking forward to supporting your journey!</p>

          <div class="session-details">
            <h3>Tomorrow's Session</h3>
            <p><strong>Time:</strong> ${sessionDetails.time}</p>
            <p><strong>Practitioner:</strong> ${sessionDetails.practitionerName}</p>
            <p><strong>Format:</strong> ${sessionDetails.isVirtual ? 'Virtual Session' : 'In-Person Session'}</p>
            ${sessionDetails.meetingLink ? `<p><strong>Join Here:</strong> <a href="${sessionDetails.meetingLink}">${sessionDetails.meetingLink}</a></p>` : ''}
          </div>

          <p><strong>Preparation Tips:</strong></p>
          <ul>
            <li>Set aside some quiet time before the session</li>
            <li>Have water nearby and ensure you're comfortable</li>
            <li>Reflect on your intentions for the session</li>
            ${sessionDetails.isVirtual ? '<li>Test your audio/video connection</li>' : '<li>Plan your travel time to arrive early</li>'}
          </ul>
        </div>
      </div>
    </body>
    </html>`;

    const text = `Session Reminder

Your wellness session is scheduled for tomorrow.

Tomorrow's Session:
- Time: ${sessionDetails.time}
- Practitioner: ${sessionDetails.practitionerName}
- Format: ${sessionDetails.isVirtual ? 'Virtual Session' : 'In-Person Session'}
${sessionDetails.meetingLink ? `- Join Here: ${sessionDetails.meetingLink}` : ''}

Preparation Tips:
- Set aside some quiet time before the session
- Have water nearby and ensure you're comfortable
- Reflect on your intentions for the session
${sessionDetails.isVirtual ? '- Test your audio/video connection' : '- Plan your travel time to arrive early'}`;

    return { subject, html, text };
  }

  private getAlphaInvitationTemplate(inviteCode?: string): EmailTemplate {
    const subject = "🌱 You're Invited to Shape FloreSer's Future";

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Alpha Invitation - FloreSer</title>
      <style>
        body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #2F4F4F; background-color: #F5F5DC; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #2F4F4F 0%, #D4AF37 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .cta-button { display: inline-block; background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌱 Alpha Invitation</h1>
          <p>Help us cultivate the future of wellness connections</p>
        </div>

        <div class="content">
          <p>We're excited to invite you to be part of FloreSer's founding community! As an alpha member, you'll help shape a platform that transforms how people connect with wellness practitioners.</p>

          <p><strong>What makes FloreSer special?</strong></p>
          <ul>
            <li>🐝 <strong>Unique Archetype System</strong> - Bee, Hummingbird, Butterfly, and Beetle categories for authentic matching</li>
            <li>🌱 <strong>Community Garden</strong> - Shared wisdom and resources from practitioners</li>
            <li>✨ <strong>Seeds Currency</strong> - Engage and earn rewards for participation</li>
            <li>🔬 <strong>Research-Backed</strong> - Your feedback shapes our innovative approach</li>
          </ul>

          ${inviteCode ? `
          <div style="background: #F5F5DC; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #D4AF37; margin: 0;">Your Alpha Access Code</h3>
            <p style="font-size: 24px; font-weight: bold; color: #2F4F4F; margin: 10px 0;">${inviteCode}</p>
          </div>
          ` : ''}

          <center>
            <a href="https://floreser.life/alpha" class="cta-button">Join Alpha Program</a>
          </center>

          <p>Your voice matters. Together, we're creating something meaningful for the wellness community.</p>
        </div>
      </div>
    </body>
    </html>`;

    const text = `Alpha Invitation - FloreSer

We're excited to invite you to be part of FloreSer's founding community! As an alpha member, you'll help shape a platform that transforms how people connect with wellness practitioners.

What makes FloreSer special?
- Unique Archetype System: Bee, Hummingbird, Butterfly, and Beetle categories
- Community Garden: Shared wisdom and resources from practitioners
- Seeds Currency: Engage and earn rewards for participation
- Research-Backed: Your feedback shapes our innovative approach

${inviteCode ? `Your Alpha Access Code: ${inviteCode}` : ''}

Join the Alpha Program: https://floreser.life/alpha

Your voice matters. Together, we're creating something meaningful for the wellness community.`;

    return { subject, html, text };
  }
}

export const emailService = new EmailService();