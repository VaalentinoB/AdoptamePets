import express from 'express';
import cookieParser from 'cookie-parser';
import mocksRouter from "./routes/mocks.router.js";
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mongoose from "mongoose";
const app = express();
const PORT = 8082;


app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use("/api/mocks", mocksRouter); 
app.listen(PORT,()=>console.log(`Listening on ${PORT}`))





mongoose.connect("mongodb+srv://valentinoburioni:vburioni1234@apivb.vym0xct.mongodb.net/Pets",)
    .then(() => {
        console.log('Conectado a la base de datos');
    }).catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
    });

