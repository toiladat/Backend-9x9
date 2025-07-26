
import nodeMailer from 'nodemailer'

const sendVerificationEmail = (to, subject, htmlContent) => {

  const adminEmail = process.env.SEND_MAI_EMAILL
  const adminPassword = process.env.SEND_MAIL_PASSWORD
  const mailHost = 'smtp.gmail.com'
  const mailPort = 465

  const transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: true, // nếu dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
    auth: {
      user: adminEmail,
      pass: adminPassword
    }
  })

  const options = {
    from: adminEmail,
    to: to,
    subject: subject,
    html: htmlContent
  }

  // Trả về Promise
  return transporter.sendMail(options)
}

export default sendVerificationEmail