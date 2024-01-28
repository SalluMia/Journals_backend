const nodemailer = require("nodemailer");

exports.sendUserCredentialsMail = async (user,email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sallumia9090@gmail.com",
      pass: "iqbdpsqwarmowsmj",
    },
  });

  // Generate a unique token or link for the user to securely log in
  const loginLink = `https://your-website.com/login`;

  // Prepare the email content with HTML and CSS styling
  const mailOptions = {
    from: "sallumia9090@gmail.com",
    to: email,
    subject: "Subadmin Creation Mail",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <h1 style="color: #333; text-align: center;">Welcome to Journals site!</h1>
        
        <div style="background-color: #fff; border-radius: 10px; padding: 20px; margin-top: 20px;">
          <p style="color: #333;">Please click the following link to securely addup your credentials as sub-admin:</p>
          <a href="${loginLink}" style="display: block; text-align: center; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Set Your Password</a>
        </div>
        
        <p style="color: #666; text-align: center; margin-top: 20px;">Thank you for joining us!</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully");
  } catch (error) {
    console.error("Error sending mail:", error.message);
  }
};
