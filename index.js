//Importo los modulos que necesito
import express from 'express';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
//import { fileURLtoPath } from 'url'; 
import { fileURLToPath} from 'url';
import {readFile} from 'fs/promises';
import path from 'path'; 

//Creo una instancia del Servidor Express
const app = express();

//Con esto lo que llegue en el Body de Req lo pasa a formato Json
app.use(express.json());

//Contesto al endpoint test con un ok
app.get('/test', (req, res) => {
    res.json({'Ok':true});
});

//EndPoint Notificacion
app.post('/notificacion', async (req, res) => {
    console.log(req.body);

    if (!req.body.fecha || !req.body.salon || !req.body.turno || !req.body.correoDestino){
        res.status(400).send({'Estado':false, 'mensaje': 'Faltan datos que son requeridos'});
    }
    try {
        const {fecha, salon, turno, correoDestino} = req.body;

        // Convierto a ruta absoluta la url del archivo actual (index.js)
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const plantilla = path.join(__dirname, 'utiles', 'handlebars', 'plantilla.hbs');
        const datos = await readFile(plantilla, 'utf-8'); 

        // Compilo la plantilla
        const template = handlebars.compile(datos);

        //Paso los datos obtenidos a la plantilla
        var html = template(
            {fecha: fecha,
             salon: salon,
             turno: turno});
        console.log(html);

    } catch (error){
        console.log(error);
    } 
 
//    res.json({'Notificacion Ok' :true});

});

//Cargo el archivo con las variables de entorno
process.loadEnvFile();

//Pongo a escuchar al servidor en el PUERTO = 3000
app.listen(process.env.PUERTO, () =>{
    console.log(`Servidor en el puerto ${process.env.PUERTO}`);
})