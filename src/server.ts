import express from "express";
import router from "./router";
import db from "./config/db";
import colors from "colors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";


// Connect to the database
export async function connectDB() {
    try {
        await db.authenticate();
        db.sync();
        //console.log(colors.magenta.bold( "Connection has been established successfully."));
    } catch (error) {
        //console.log(error);
        console.log(colors.red.bold( "Unable to connect to the database"));
    }
}
connectDB();

//Instancia de expreass
const server = express()

//Leer datos en formularios
server.use(express.json());

server.use('/api/products' , router);

//Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




export default server;