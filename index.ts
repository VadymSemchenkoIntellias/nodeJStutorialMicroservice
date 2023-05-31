import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger';

import { router as userRouter } from "./userRouter";
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();


app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ['POST']
}));
app.use('/user', userRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((_, res) => {
    res.sendStatus(404);
});


async function startApp() {
    try {
        app.listen(process.env.PORT, async () => {
            await mongoose.connect('mongodb+srv://semchenko:a00190019@cluster0.xpyrdb8.mongodb.net/?retryWrites=true&w=majority');
        });
    } catch (e) {
        console.log(e);
    }
}


startApp();
