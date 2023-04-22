import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import apiAuthRouter from './routes/apiAuth';
import apiViestiRouter from './routes/apiViestit';
import apiViestiketjutRouter from './routes/apiViestiketjut';

dotenv.config();

const app : express.Application = express();

const checkToken = (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {

        let token : string = req.headers.authorization!.split(" ")[1];

        jwt.verify(token, String(process.env.TOKEN));

        next();

    } catch (e: any) {
        res.status(401).json({});
    }

}

app.use(cors({origin : "http://localhost:3000"}));

app.use("/api/auth", apiAuthRouter);

app.use("/api/viestit", checkToken, apiViestiRouter);

app.use("/api/viestiketjut", apiViestiketjutRouter);

app.listen(Number(process.env.PORT), () => {

    console.log(`Palvelin käynnistyy porttiin ${Number(process.env.PORT)}`)

})