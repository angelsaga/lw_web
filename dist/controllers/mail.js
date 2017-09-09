"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
let debug = require('debug')('mail');
let config = require('../../bin/config');
class Mail1 {
    constructor() { }
    static sendmail(user, code) {
        let transporter = nodemailer.createTransport({
            service: config.mail_service,
            auth: {
                user: config.mail_user,
                pass: config.mail_passwd
            }
        });
        let mailOptions = {
            from: config.mail_user,
            to: user.username,
            subject: 'Little Wings: Verify Code',
            text: 'Verify Code: ' + code
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }
    sendmail1(user, code) {
        let transporter = nodemailer.createTransport({
            host: '127.0.0.1',
            port: 25,
            auth: {
                user: 'root',
                pass: 'Sangbe!123'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let mailOptions = {
            from: config.mail_user,
            to: user.username,
            subject: 'Little Wings: Verify Code',
            text: 'Verify Code: ' + code
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }
}
exports.Mail1 = Mail1;
