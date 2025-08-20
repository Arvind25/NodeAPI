
import express, { Request, Response, Router } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import globalConfig from './app/config';
import routes from './app/routes';

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "100mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.get("/", (req,res) =>{
   res.status(200).send("Node 2025 >>: ");

})

/**
 * Connection to database
 * @param: mongoDb database connection string
 */
mongoose
  .connect(`${globalConfig.MONGODB_URI}`)
  .then(() => {
    console.log("App connected to database.");
    })
  .catch((error) => {
    console.log("Database connection error",error);
  });

// Setup routes
app.use('/', routes);

/**
 * This function starts the Web server
 * @param: Port on which web server runs 
 */
const server = app.listen(globalConfig.PORT,()=>{
                    console.log(`Server in running on Port: ${globalConfig.PORT}`);
                });

const exitHandler = () =>{
    if(server){
        server.close(() =>{
            console.error('Web Server Close Handler')
        })
    }
};

const unexpectedHandler = (err:any) =>{
    console.error('Server Handler Error: ', err);
    exitHandler();
}
process.on('uncaughtException', unexpectedHandler);
process.on('unhandledRejection', unexpectedHandler);

/**
 * This function gives termination signal sent to a process, requesting it to shut down gracefully.
 */
process.on('SIGTERM', () =>{
    console.log('Sigterm Recieved, web server shut down gracefully');
    if(server){
        server.close();
    }
});