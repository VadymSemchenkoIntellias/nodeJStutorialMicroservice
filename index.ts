import express from 'express';
import { router } from "./router";
import mongoose from 'mongoose';


const PORT = 5001;
// TODO: move DB password to .env
const DB_URL = `mongodb+srv://semchenko:a00190019@cluster0.xpyrdb8.mongodb.net/?retryWrites=true&w=majority`;


const app = express();

app.use(express.json());
app.use('/user', router);
app.use((_, res) => {
    res.sendStatus(404);
})


async function startApp() {
    try {
        app.listen(PORT, async () => {
            await mongoose.connect(DB_URL);
        });
    } catch (e) {
        console.log(e);
    }
}

startApp();
