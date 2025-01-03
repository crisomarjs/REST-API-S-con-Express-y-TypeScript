import express from "express";
import router from "./router";
import db from "./config/db";
import colors from "colors";
import cors, {CorsOptions} from "cors";
import morgan from "morgan";
import swaggerUi, { serve } from "swagger-ui-express";
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

//Permitir peticiones de cualquier origen
const corsOptions: CorsOptions = {
    origin: function(origin, callback){
        if(origin === process.env.FRONTEND_URL){
            callback(null, true);
        }else{
            callback(new Error('Error de CORS'));
        }

    }
}

server.use(cors(corsOptions));

//Leer datos en formularios
server.use(express.json());

server.use(morgan('dev'))
server.use('/api/products' , router);

//Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




export default server;