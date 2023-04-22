import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma : PrismaClient = new PrismaClient();

const apiViestiRouter : express.Router = express.Router();

apiViestiRouter.use(express.json());

apiViestiRouter.post("/", async (req : express.Request, res : express.Response) => {

    try {

        let viestiketju_id = Number(req.body.viestiketju_id);

        if (!isNaN(viestiketju_id) && typeof req.body.sisalto === "string" && req.body.sisalto.length > 0) {

            const viesti = await prisma.viesti.create({
                data : {
                    viestiketju : { connect : { id : viestiketju_id } },
                    sisalto : req.body.sisalto,
                }
            })

            if (viesti) {
                res.json(viesti);
            }
            else {
                res.status(418).json("The server refuses the attempt to brew coffee with a teapot.");
            }
        }
        else {
            res.status(400).json("Pyynnön tiedot ovat virheelliset");
        }
    }
    catch (e : any) {
        res.status(500).json("Palvelimella tapahtui odottamaton virhe");
    }
})

export default apiViestiRouter;