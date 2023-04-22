interface Viesti {
    id : number,
    viestiketju_id : number,
    sisalto : string,
    aika : string
}

interface Viestiketju {
    id : number,
    lahettaja_id : number,
    vastaanottaja_id : number,
    lahettaja : string,
    vastaanottaja : string,
    aikaleima : Date,
    viestit : Viesti[]
}