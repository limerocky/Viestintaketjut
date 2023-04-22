import { Button, Container, Divider, List, ListItem, ListItemText, Stack, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface Props {
    viestiketjut: Viestiketju[],
    setViestiketjut: React.Dispatch<React.SetStateAction<Viestiketju[]>>,
    token: string
}

const Viestiketju: React.FC<Props> = ({ viestiketjut, setViestiketjut, token }): React.ReactElement => {

    let { id } = useParams();
    let sisalto = useRef<string>("");
    const [hereCauseImBad, setHereCauseImBad] = useState<boolean>(false)

    let index : number = viestiketjut.findIndex((viestiketju: Viestiketju) => viestiketju.id === Number(id));

    const addMessage = async () : Promise<void> => {

        if (sisalto.current) {
            
            const yhteys = await fetch("http://localhost:3456/api/viestit", {
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                    
                },
                body : JSON.stringify({
                    viestiketju_id : id,
                    sisalto : sisalto.current
                })
            })

            if (yhteys.ok) {

                let uudetViestiketjut : Viestiketju[] = viestiketjut;
                uudetViestiketjut[index].viestit.push(await yhteys.json());

                localStorage.setItem("viestit", JSON.stringify(viestiketjut));
                setViestiketjut(uudetViestiketjut);
                setHereCauseImBad(!hereCauseImBad);
            }
        }
    }

    return (
        <Container
            sx={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "20px"
            }}
        >
            <Stack>
                <List>
                    {viestiketjut[index]?.viestit?.map((viesti: Viesti) => {

                        return (
                            <React.Fragment
                                key={viesti.id}
                            >
                                <ListItem>
                                    <ListItemText primary={viesti.sisalto} />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        )
                    })}
                </List>
                <Stack>
                    <TextField
                        name="sisalto"
                        label="Viesti"
                        onChange={(e : any) => sisalto.current = e.target.value}
                        multiline
                    />
                    <Button 
                        variant="contained"
                        onClick={addMessage}
                    >Lähetä viesti</Button>
                    <Button
                        component={Link}
                        to="/"
                    >Takaisin</Button>
                </Stack>
            </Stack>
        </Container>
    )
}

export default Viestiketju;