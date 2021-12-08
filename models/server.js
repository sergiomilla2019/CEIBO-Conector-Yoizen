const express = require('express')
const fs = require('fs');



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

            fs.appendFile("example_file.txt", myJSON, (err) => {
                if (err) {
                  console.log(err);
                }
              });

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