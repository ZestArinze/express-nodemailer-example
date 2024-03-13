const express = require('express');
var cors = require('cors')
const { sendEmail } = require('./mail');
const app = express();

const helmet = require('helmet')
app.use(helmet({
	crossOriginEmbedderPolicy: process.env.NODE_ENV !== 'development'
}));

const whitelist = process.env.FRONTEND_APP_URLS.split(',');
const corsOptions = {
	origin: function (origin, callback) {
		if (!origin) { // TODO: clients suach as postman req with no origin
			return callback(null, true);
		}

		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	}
}

app.use(cors(corsOptions));

app.use(express.json());

app.get('/', (_, res) => {
	return res.send('Silence is golden')
});

app.post('/send-email', (req, res) => {
	const { name, email, subject, message } = req.body;

	// basic validation
	if (
		!email || !email.trim() ||
		!name || !name.trim() ||
		!subject || !subject.trim() ||
		!message || !message.trim()
	) {
		return res.status(400).json({ message: 'name, email, subject and message are required' });
	}

	const receipients = ` ${name} <${email}>`;

	res.json({ message: 'Sending email in a moment...' });

	sendEmail({ receipients, subject, message })
		.then(result => { })
		.catch(error => {
			// console.log(`Unable to send email to ${JSON.stringify({ receipients })}: ${JSON.stringify(error)}`)
		});
});

module.exports = app;
