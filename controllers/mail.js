let debug = require('debug')('mail');
const nodemailer = require('nodemailer');
let config = require('../bin/config');


exports.sendmail1 = function(user, code){
	let transporter = nodemailer.createTransport({
	    sendmail: true,
	    newline: 'unix',
	    path: '/usr/sbin/sendmail'
	});

	// setup email data with unicode symbols
	let mailOptions = {
			from: config.mail_user,
		    to: user.username,
		    subject: 'Little Wings: Verify Code',
		    text: 'Verify Code: ' + code 
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
	    if (error) {
	        return console.log(error);
	    }
	    console.log('Message %s sent: %s', info.messageId, info.response);
	});
}

exports.sendmail = function(user, code){
	let transporter = nodemailer.createTransport({
	    service: config.mail_service,
	    auth: {
	        user: config.mail_user,
	        pass: config.mail_passwd
	    }
	});

	// setup email data with unicode symbols
	let mailOptions = {
			from: config.mail_user,
		    to: user.username,
		    subject: 'Little Wings: Verify Code',
		    text: 'Verify Code: ' + code 
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
	    if (error) {
	        return console.log(error);
	    }
	    console.log('Message %s sent: %s', info.messageId, info.response);
	});
}