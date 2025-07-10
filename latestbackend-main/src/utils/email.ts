import nodemailer from "nodemailer"

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string
  subject: string
  text: string
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // false for STARTTLS, true if using port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // ✅ useful for dev or self-signed certs
      },
    })

    const mailOptions = {
      from: `"MuslimInfluencers.io" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Email sent to:", to)
    console.log("📧 Message ID:", info.messageId)
    console.log("📨 Server response:", info.response)
  } catch (err: any) {
    console.error("❌ Failed to send email:", err.message)
    throw new Error("Email service failed")
  }
}
