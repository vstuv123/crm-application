import nodemailer from 'nodemailer';

const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.PORT_SMTP,
        service: process.env.SERVICE,
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.MAIL,
        to: options.email,
        subject: options.subject,
        html: options.message,
    }

    transporter.sendMail(mailOptions);
}

export default sendEmail;