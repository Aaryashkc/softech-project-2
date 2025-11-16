import Contact from '../models/contact.model.js';
import nodemailer from 'nodemailer';

// Get Contact Page Data (Public - no auth required)
export const getContact = async (req, res) => {
  try {
    // Since there should only be one Contact document, we'll get the first one
    let contact = await Contact.findOne();
    
    if (!contact) {
      return res.status(404).json({ 
        message: 'Contact page data not found. Please run seed script: npm run seed:contact' 
      });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Contact Page Data (Protected - requires auth)
export const updateContact = async (req, res) => {
  try {
    const { hero, contactInfo, additionalInfo } = req.body;

    let contact = await Contact.findOne();
    
    if (!contact) {
      // Create new if doesn't exist
      contact = new Contact({ hero, contactInfo, additionalInfo });
    } else {
      // Update existing
      if (hero) {
        contact.hero = { ...contact.hero, ...hero };
      }
      
      if (contactInfo) {
        contact.contactInfo = { ...contact.contactInfo, ...contactInfo };
      }
      
      if (additionalInfo) {
        contact.additionalInfo = { ...contact.additionalInfo, ...additionalInfo };
      }
    }

    const updatedContact = await contact.save();
    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Send Contact Email (Public - form submission)
export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create transporter (configure with your email service)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
};
