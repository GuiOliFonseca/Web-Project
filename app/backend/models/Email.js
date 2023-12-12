require('dotenv').config();
const Message = require('../utils/Message');
const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL
    },
    secure: true
});

console.log(process.env.USER_EMAIL, process.env.PASS_EMAIL)

let mailOptions = {
    from: 'iStones <no-reply@istonesapp.com.br>'
};

let readHTML = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) throw err;
        else callback(null, html);
    });
};

class Email {

    static confirmAccount(name, email, token) {
        mailOptions = {
            to: email,
            from: 'iStones <no-reply@istonesapp.com.br>',
            subject: 'Confirmação de Conta - iStones'
        }

        readHTML(__dirname + '/../email/confirmation.html', function (err, html) {

            try {
                let template = handlebars.compile(html);
                let replacements = {
                    nome: name,
                    link: 'https://istonesapp.com.br/confirmar-conta?token=' + token
                };
                mailOptions['html'] = template(replacements);
                transporter.sendMail(mailOptions, function (error, response) {
                    console.log(error)
                    Message.info('Email enviado!');
                });
            } catch (error) {
                Message.warning(error);
            }
        });
    }

    static recoverPassword(name, email, token) {
        mailOptions = {
            to: email,
            from: 'iStones <no-reply@istonesapp.com.br>',
            subject: 'Recuperação de Senha - iStones'
        }

        console.log(process.env.USER_EMAIL, process.env.PASS_EMAIL)

        readHTML(__dirname + '/../email/password-reset.html', function (err, html) {

            try {
                let template = handlebars.compile(html);
                let replacements = {
                    nome: name,
                    link: 'https://istonesapp.com.br/nova-senha?token=' + token
                };
                mailOptions['html'] = template(replacements);
                transporter.sendMail(mailOptions, function (error, response) {
                    console.log(response, error)
                    Message.info('Email enviado!');
                });
            } catch (error) {
                Message.warning(error);
            }
        });
    }

    static sendBoleto(boletoCode, boletoLink, id_order, email, name) {
        mailOptions = {
            to: email,
            from: 'iStones <no-reply@istonesapp.com.br>',
            subject: 'Seu Pedido - iStones'
        }

        console.log(process.env.USER_EMAIL, process.env.PASS_EMAIL)

        readHTML(__dirname + '/../email/ticket.html', function (err, html) {

            try {
                let template = handlebars.compile(html);
                let replacements = {
                    link: boletoLink,
                    code: boletoCode,
                    id: id_order,
                    name
                };
                mailOptions['html'] = template(replacements);
                transporter.sendMail(mailOptions, function (error, response) {
                    console.log(response, error)
                    Message.info('Email enviado!');
                });
            } catch (error) {
                Message.warning(error);
            }
        });
    }

    static sendPix(code, qr_pix, id_order, email, name) {
        mailOptions = {
            to: email,
            from: 'iStones <no-reply@istonesapp.com.br>',
            subject: 'Seu Pedido - iStones'
        }

        console.log(process.env.USER_EMAIL, process.env.PASS_EMAIL)

        readHTML(__dirname + '/../email/pix.html', function (err, html) {

            try {
                let template = handlebars.compile(html);
                let replacements = {
                    code: code,
                    qr_pix: qr_pix,
                    id: id_order,
                    name: name
                };
                mailOptions['html'] = template(replacements);
                transporter.sendMail(mailOptions, function (error, response) {
                    console.log(response, error)
                    Message.info('Email enviado!');
                });
            } catch (error) {
                Message.warning(error);
            }
        });
    }


    static sendSalesNotification(product, order_id, email) {
        mailOptions = {
            to: email,
            from: 'iStones <no-reply@istonesapp.com.br>',
            subject: 'Você vendeu! - iStones'
        }

        console.log(process.env.USER_EMAIL, process.env.PASS_EMAIL)

        readHTML(__dirname + '/../email/sales-notification.html', function (err, html) {

            try {
                let template = handlebars.compile(html);
                let replacements = {
                    link: 'https://istonesapp.com.br/suas-vendas/detalhes/' + order_id,
                    title: product.title,
                    id: order_id,
                    name: product.business_name
                };
                mailOptions['html'] = template(replacements);
                transporter.sendMail(mailOptions, function (error, response) {
                    console.log(response, error)
                    Message.info('Email enviado!');
                });
            } catch (error) {
                Message.warning(error);
            }
        });
    }

    static advertiseSale(data) {
        try {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) Message.warning(error);
                else res.send('Enviou: ' + info);
            });
        } catch (error) {
            Message.warning(error);
        }
    }

    static advertiseInvoice(data) {
        try {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) Message.warning(error);
                else res.send('Enviou: ' + info);
            });
        } catch (error) {
            Message.warning(error);
        }
    }
}

module.exports = Email;