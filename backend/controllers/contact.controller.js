
import nodemailer from 'nodemailer';

export const sendContactEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="background: linear-gradient(135deg, #DC2525 0%, #FF8282 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 300;">New Contact Form Submission</h1>
        </div>
        
        <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="background:white; padding: 25px; border-radius: 6px; margin-bottom: 20px;">
            <h2 style="color: #DC2525; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">Contact Information</h2>

            <div style="margin-bottom: 15px;">
              <strong style="color: #495057; display: inline-block; width: 80px;">Name:</strong>
              <span style="color: #495057; font-weight: 500;">${name}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #495057; display: inline-block; width: 80px;">Email:</strong>
              <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #495057; display: inline-block; width: 80px;">Subject:</strong>
              <span style="color: #6c757d;">${subject}</span>
            </div>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 6px;">
            <h3 style="color: #DC2525; margin-top: 0; font-size: 16px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">Message</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 4px; border-left: 4px solid #DC2525; font-size: 14px; line-height: 1.7;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #FFF7F1; border-radius: 4px; border-left: 4px solid #DC2525;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              <strong>📧 Quick Actions:</strong> 
              <a href="mailto:${email}?subject=Re: ${subject}" style="color: #007bff; text-decoration: none; margin-left: 10px;">Reply to ${name}</a>
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding: 15px; color: #6c757d; font-size: 12px;">
          <p style="margin: 0;">This email was sent from your website contact form</p>
          <p style="margin: 5px 0 0 0;">Received on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email, 
      subject: `🔔 New Contact: ${subject}`,
      html: htmlContent,
      text: `New Contact Form Submission\n\nFrom: ${name} <${email}>\nSubject: ${subject}\n\nMessage:\n${message}\n\nReceived: ${new Date().toLocaleString()}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email sending error:', err);
    res.status(500).json({ success: false, message: 'Email failed to send' });
  }
};