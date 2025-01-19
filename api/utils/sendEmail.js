// Import nodemailer
import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Axistay" <${process.env.EMAIL_USER}>`, // Custom sender name
      to,
      subject,
      text,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

export default sendEmail;
