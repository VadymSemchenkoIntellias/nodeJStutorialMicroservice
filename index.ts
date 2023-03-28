import express from 'express';
import mongoose from 'mongoose';

import { router } from "./router";
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = 5001;

const app = express();

app.use(express.json());
app.use('/user', router);
app.use((_, res) => {
    res.sendStatus(404);
})


async function startApp() {
    try {
        app.listen(PORT, async () => {
            await mongoose.connect(process.env.DB_URL as string);
        });
    } catch (e) {
        console.log(e);
    }
}

startApp();
