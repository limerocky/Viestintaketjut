import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma : PrismaClient = new PrismaClient();

const apiViestiketjutRouter : express.Router = express.Router();

apiViestiketjutRouter.use(express.json());

apiViestiketjutRouter.post("/", async (req : express.Request, res : express.Response) => {

    try {

        if (typeof req.body.lahettaja === "string" && req.body.lahettaja?.length > 0 && typeof req.body.vastaanottaja === "string" && req.body.vastaanottaja?.length > 0) {

            const viestiketju = await prisma.viestiketju.findFirst({
                where : {
                    OR : [
                        { 
                            lahettaja : req.body.lahettaja,
                            vastaanottaja : req.body.vastaanottaja
                        },
                        { 
                            vastaanottaja : req.body.lahettaja,
                            lahettaja : req.body.vastaanottaja
                        }
                    ],
                }
            })

            if (!viestiketju) {

                const lahettaja = await prisma.kayttaja.findFirst({
                    where : {
                        kayttajatunnus : req.body.lahettaja
                    }
                })
    
                const vastaanottaja = await prisma.kayttaja.findFirst({
                    where : {
                        kayttajatunnus : req.body.vastaanottaja
                    }
                })
    
                if (lahettaja && vastaanottaja) {

                    const helperViestiketju = await prisma.viestiketju.create({
                        data : {
                            lahettaja_id : lahettaja.id,
                            vastaanottaja_id : vastaanottaja.id,
                            lahettaja : lahettaja.kayttajatunnus,
                            vastaanottaja : vastaanottaja.kayttajatunnus
                        }
                    })
        
                    if (helperViestiketju) {
                        let viestiketju = {
                            ...helperViestiketju,
                            viestit : []
                        }

                        res.json(viestiketju);
                    }
                    else {
                        res.status(418).json("The server refuses the attempt to brew coffee with a teapot");
                    }
                }
                else {
                    res.status(400).json("Käyttäjää tai vastaanottajaa ei löydetty. Tarkista oletko olemassa");
                }
            }
            else {
                res.status(409).json("Viestiketju on jo olemassa käyttäjien välillä")
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

export default apiViestiketjutRouter;