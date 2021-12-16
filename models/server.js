"use strict";

const express = require('express');
const nodemailer = require("nodemailer");

let multer = require('multer');
let upload = multer();


class Server {
    
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.middlewares();

        this.routes();
    }

    middlewares(){

        // for parsing application/x-www-form-urlencoded
        this.app.use(express.urlencoded({ extended: true })); 

        // for parsing multipart/form-data
        this.app.use(upload.array()); 

        this.app.use(express.json());

        this.app.use(express.static('public'));
    }

    async routes(){
        this.app.post('/api', (req, res) => {
            const body = req.body;
            const myJSON = JSON.stringify(body);

              //const msj = JSON.stringify(body);


              
              sendEmail(body);

              //console.log("--msj-->", msj);
              //console.log("----->", mjs.email);

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

async function sendEmail(body){

            //Armando body del mail



            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            let testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                user: 'conectoryoizeneloqua@gmail.com', // generated ethereal user
                pass: 'ceibo.2021', // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Eloqua" <conectoryoizeneloqua@gmail.com>', // sender address
                to: "ventapymes@teco.com.ar", // list of receivers ventapymes@teco.com.ar
                subject: "Formulario Eloqua", // Subject line
                text: "Formulario Eloqua", // plain text body
                html: `<br><u><b>Campos del formulario</b></u> <br><br>
                <b>PhonePrefix:${body.PhonePrefix}</b><br><br>
                <b>Phone:${body.Phone}</b><br><br>
                <b>LastName:${body.LastName}</b><br><br>
                <b>Email:${body.Email}</b><br><br>
                <b>Product:${body.Product}</b><br><br>
                <b>Name:${body.Name}</b><br><br>
                <b>elqSiteId:${body.elqSiteId}</b><br><br>`, // html body
                headers: {
                    'X-YoizenSocial-SenderMail': body.Email,
                    'X-YoizenSocial-SenderName': body.Name,
                    'X-YoizenSocial-WebFormName': 'Formulario_Base_2021',
                }
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));  

}

module.exports = Server;