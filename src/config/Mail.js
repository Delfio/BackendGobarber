export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default:{
    from: 'Delfio Francisco <noreply@gobarber.com'
  }
} //Amazon SES
  // Mailgun
  // Sparkpost
  // Mailtrap (DEV) - vamos usar esse