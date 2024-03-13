const nodemailer = require('nodemailer');

const mailTransport = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	secure: false, // TODO: upgrade later with STARTTLS
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD,
	},
});

const sendEmail = async ({ receipients, subject, message }) => {
	try {
		const info = await mailTransport.sendMail({
			from: process.env.MAIL_SENDER_DEFAULT, // sender address
			to: receipients, // list of receivers
			subject: subject, // Subject line
			text: message, // plain text body
		});

		return info;
	} catch (error) {
		console.log(`Unable to send email to ${JSON.stringify({receipients})}`)
	}
}

module.exports = { sendEmail};