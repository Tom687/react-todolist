const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const moment = require('moment');
// new Email(user, url).sendWelcome();

// TODO : Ajuster les fonctions (sendWelcome() …), les templates et le constructeur selon infos nécessaires
module.exports = class Email {
	constructor(user, url, event) {
		this.to = user.email;
		this.firstName = user.name.split(' ')[0];
		this.url = url;
		this.event = event;
		this.from = `Espagnol chez toi - Calendar <${process.env.EMAIL_FROM}>`;
	}
	
	createNewTransport() {
		// Different transporter if PROD or DEV
		if (process.env.NODE_ENV === 'production') {
			// Use Sendgrid : TODO
			return 1;
		}
		
		// If in DEV
		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD
			}
		});
	}
	
	// Function to send the actual email based on given email template
	async send(template, subject) {
		// TODO : Séparer la logique event ? Car tous les emails n'auront pas d'event ?
		moment.locale('fr');
		const event_start = moment(this.event.start).format('dddd Do MMMM YYYY [de] HH:mm');
		const event_end = moment(this.event.end).format('HH:mm');
		const event_date = `${event_start} à ${event_end}`;
		
		// Render HTML based on a pug template
		const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
			firstName: this.firstName,
			url: this.url,
			subject,
			event_date
		});
		
		// Define email options
		const emailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText.fromString(html)
		};
		
		// Create a transport and send email
		await this.createNewTransport().sendMail(emailOptions);
	}
	
	async sendWelcome() {
		await this.send('welcome', 'Bienvenue sur Espagnol Chez Toi !');
	}
	
	async sendPasswordReset() {
		await this.send('passwordReset', 'Réinisialisez votre mot de passe - Espagnol Chez Toi');
	}
};