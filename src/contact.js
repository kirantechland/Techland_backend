// API endpoint for contact form submissions
// Place this in your backend or create a serverless function

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Option 1: Send email using nodemailer (recommended)
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // Your email
        pass: process.env.SMTP_PASS, // Your email password or app password
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "info@techland.com", // Your receiving email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #163198; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">New Contact Form Submission</h2>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 8px 8px;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <p style="margin: 0 0 10px 0; color: #666;"><strong style="color: #163198;">Name:</strong></p>
              <p style="margin: 0; font-size: 16px;">${name}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <p style="margin: 0 0 10px 0; color: #666;"><strong style="color: #163198;">Email:</strong></p>
              <p style="margin: 0; font-size: 16px;">${email}</p>
            </div>
            
            ${
              phone
                ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <p style="margin: 0 0 10px 0; color: #666;"><strong style="color: #163198;">Phone:</strong></p>
              <p style="margin: 0; font-size: 16px;">${phone}</p>
            </div>
            `
                : ""
            }
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <p style="margin: 0 0 10px 0; color: #666;"><strong style="color: #163198;">Message:</strong></p>
              <p style="margin: 0; font-size: 16px; line-height: 1.6;">${message}</p>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>This email was sent from your website contact form</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Option 2: Save to database (if needed)
    // await saveToDatabase({ name, email, phone, message });

    return res.status(200).json({
      message: "Message sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
}
