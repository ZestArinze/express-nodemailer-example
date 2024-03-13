const express = require('express');
const { sendEmail } = require('./mail');
const app = express();

const helmet = require('helmet')
app.use(helmet({
	crossOriginEmbedderPolicy: process.env.NODE_ENV !== 'development'
}))

app.use(express.json());

app.get('/', (_, res) => {
	return res.send('Silence is golden')
});

app.post('/send-email', (req, res) => {
	res.json({ message: 'Sending email in a moment...' });

	const { receipients, subject, message } = req.body;

	sendEmail({ receipients, subject, message });
});

module.exports = app;
