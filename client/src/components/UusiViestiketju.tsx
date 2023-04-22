import { Button, Stack, TextField } from "@mui/material";
import { useRef } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";

interface Props {
    viestiketjut: Viestiketju[],
    setViestiketjut: React.Dispatch<React.SetStateAction<Viestiketju[]>>,
    kayttaja: string,
    token: string
}

const UusiViestiketju: React.FC<Props> = ({ viestiketjut, setViestiketjut, kayttaja, token }): React.ReactElement => {

    const navigate: NavigateFunction = useNavigate();

    const vastaanottaja = useRef<string>("");

    const lisaaViestiketju = async (e: React.FormEvent) => {

        e.preventDefault();

        const yhteys = await fetch("http://localhost:3456/api/viestiketjut", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body: JSON.stringify({
                lahettaja: kayttaja,
                vastaanottaja: vastaanottaja.current
            })
        });

        if (yhteys.ok) {

            setViestiketjut([
                ...viestiketjut,
                await yhteys.json()
            ]);

            navigate("/");
        }
    }

    return (
        <Stack>
            <TextField 
                name="vastaanottaja"
                label="Vastaanottaja"
                onChange={(e : any) => vastaanottaja.current = e.target.value}
            />
            <Button
                variant="contained"
                onClick={lisaaViestiketju}
            >Avaa keskustelu</Button>
            <Button
                component={Link}
                to="/"
            >Peruuta</Button>
        </Stack>
    )
}

export default UusiViestiketju;