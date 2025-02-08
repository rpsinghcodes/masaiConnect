import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASS,
    },
});

const sendEmail = async (email: string, subject: string, htmlContent: string) => {
    const mailOptions = {
        from: process.env.NODE_MAILER_EMAIL,
        to: email,
        subject: subject,
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + email);
    } catch (error) {
        console.log('Error sending email: ' + error);
    }
};

export default sendEmail;
