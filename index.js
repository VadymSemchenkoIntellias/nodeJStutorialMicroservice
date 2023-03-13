import express from 'express';
import router from "./router.js";

const PORT = 5001;

const app = express();

app.use(express.json());
app.use('/', router);
app.use((_, res) => {
    res.sendStatus(404);
})


async function startApp() {
    try {
        app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

startApp();
