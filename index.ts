import express from 'express';
import mongoose from 'mongoose';

import { router } from "./router";
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();


app.use(express.json());
app.use('/user', router);
app.use((_, res) => {
    res.sendStatus(404);
})


async function startApp() {
    try {
        app.listen(5001, async () => {
            await mongoose.connect('mongodb+srv://semchenko:a00190019@cluster0.xpyrdb8.mongodb.net/?retryWrites=true&w=majority' as string);
        });
    } catch (e) {
        console.log(e);
    }
}

startApp();
