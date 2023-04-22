import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken';

const prisma : PrismaClient = new PrismaClient();

const apiAuthRouter : express.Router = express.Router();

apiAuthRouter.use(express.json());

apiAuthRouter.post("/", async (req : express.Request, res : express.Response) => {

    try {

        if (typeof req.body.kayttajatunnus === "string" && req.body.kayttajatunnus?.length > 0 && typeof req.body.salasana === "string" && req.body.salasana?.length > 0) {

            const kayttaja = await prisma.kayttaja.findFirst({
                where : {
                    kayttajatunnus : req.body.kayttajatunnus
                }
            });

            if (!kayttaja) {

                const kayttaja = await prisma.kayttaja.create({
                    data : {
                        kayttajatunnus : req.body.kayttajatunnus,
                        salasana : req.body.salasana
                    }
                });
    
                if (kayttaja) {
                    res.json("Käyttäjän luominen onnistui");
                }
                else {
                    res.status(418).json("The server refuses the attempt to brew coffee with a teapot.");
                }
            }
            else {
                res.status(400).json("Kayttajatunnus on jo olemassa");
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

apiAuthRouter.post("/login", async (req : express.Request, res : express.Response) => {

    try {

        if (typeof req.body.kayttajatunnus === "string" && req.body.kayttajatunnus?.length > 0 && typeof req.body.salasana === "string" && req.body.salasana?.length > 0) {

            const kayttaja = await prisma.kayttaja.findFirst({
                where : {
                    kayttajatunnus : req.body.kayttajatunnus,
                    salasana : req.body.salasana
                }
            });

            if(kayttaja) {

                let token = jwt.sign({}, String(process.env.TOKEN));

                let viestiketjut = await prisma.viestiketju.findMany({
                    where : {
                        OR : [
                            { lahettaja : req.body.kayttajatunnus },
                            { vastaanottaja : req.body.kayttajatunnus }
                        ]
                    }
                });

                let viestit = await Promise.all(viestiketjut.map(async (viestiketju : any) => {

                    return {
                        ...viestiketju,
                        viestit : await prisma.viesti.findMany({
                            where : {
                                viestiketju_id : viestiketju.id
                            }
                        })
                    }
                }));

                res.json({ token : token, viestiketjut : viestit });

            }
            else {
                res.status(401).json("Virheellinen käyttäjätunnus tai salasana");
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

export default apiAuthRouter;