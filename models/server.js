"use strict";

const express = require('express')
const fs = require('fs');
const nodemailer = require("nodemailer");



class Server {
    
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.middlewares();

        this.routes();
    }

    middlewares(){

        this.app.use(express.json());

        this.app.use(express.static('public'));
    }

    routes(){
        this.app.post('/api', (req, res) => {
            const body = req.body;
            //console.log("--body-->", body);
            const myJSON = JSON.stringify(body);

            fs.appendFile("../public/example_file.txt", myJSON, (err) => {
                if (err) {
                  console.log(err);
                }
              });

            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            let testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                user: 'sergiomilla2019@gmail.com', // generated ethereal user
                pass: 'hlhkgfhjmthyxafc', // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Fred Foo 👻" <sergiomilla2019@gmail.com>', // sender address
                to: "sergiomilla2019@gmail.com", // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: `<b>${body}</b>`, // html body
                headers: {
                    'X-YoizenSocial-SenderMail': 'sergiomilla2019@gmail.com',
                    'X-YoizenSocial-SenderName': 'Sergio',
                    'X-YoizenSocial-WebFormName': 'Formulario_Base_2021',
                }
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));  

            res.json({
                ok: true,
                msg: "post API",
                body
            });
        });
        
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port)
        });
    }
}

module.exports = Server;