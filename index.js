const express = require('express');
var cors = require('cors')
const { sendEmail } = require('./mail');
const app = express();

const helmet = require('helmet')
app.use(helmet({
	crossOriginEmbedderPolicy: process.env.NODE_ENV !== 'development'
}));

const whitelist = [process.env.FRONTEND_APP_URL];
const corsOptions = {
	origin: function (origin, callback) {
		if (process.env.NODE_ENV === 'development') {
			return callback(null, true)
		}

		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true)
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
	const { name, email } = req.body;

	const receipients = ` ${name} <${email}>`;
	const subject = `Welcome to our website`;
	const message = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus mollitia nam, quo exercitationem cumque dolor molestias quis ipsam voluptatum sunt obcaecati explicabo eveniet quaerat corrupti similique optio, ratione ad at!`

	res.json({ message: 'Sending email in a moment...' });

	sendEmail({ receipients, subject, message })
		.then(result => {})
		.catch(error => console.log(`Unable to send email to ${JSON.stringify({ receipients })}`));
});

module.exports = app;
