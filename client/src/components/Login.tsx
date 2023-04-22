import React, { useRef, useState } from "react";
import { Backdrop, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface Props {
    setToken: React.Dispatch<React.SetStateAction<string>>,
    setViestiketjut: React.Dispatch<React.SetStateAction<Viestiketju[]>>,
    kayttaja : React.MutableRefObject<string>
}

interface Errors {
    kayttaja?: string,
    salasana?: string
}

const Login: React.FC<Props> = ({ setToken, setViestiketjut, kayttaja }): React.ReactElement => {

    const [errorText, setErrorText] = useState<Errors>({});
    const formRef = useRef<HTMLFormElement>();

    const login = async (e: React.FormEvent): Promise<void> => {

        e.preventDefault();

        let errors: Errors = {};

        if (!formRef.current?.kayttajatunnus.value) {
            errors = { ...errors, kayttaja: "Käyttäjätunnus on pakollinen" };
        }
        if (!formRef.current?.salasana.value) {
            errors = { ...errors, salasana: "Salasana on pakollinen" };
        }

        if (Object.entries(errors).length > 0) {
            setErrorText({ ...errors });
        }
        else {

            const yhteys = await fetch("http://localhost:3456/api/auth/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    kayttajatunnus: formRef.current?.kayttajatunnus.value,
                    salasana: formRef.current?.salasana.value
                })
            });

            if (yhteys.status === 200) {

                let { token, viestiketjut } = await yhteys.json();

                kayttaja.current = formRef.current?.kayttajatunnus.value;
                setToken(token);
                setViestiketjut(viestiketjut);

                localStorage.setItem("token", token);
                localStorage.setItem("kayttaja", kayttaja.current);

                setErrorText({});

            }
            else {
                setErrorText({ kayttaja: "Virheellinen käyttäjätunnus tai salasana", salasana: "Virheellinen käyttäjätunnus tai salasana" });
            }
        }
    };

    return (
        <Backdrop open={true}>
            <Paper sx={{ padding: 2 }}>
                <Box
                    component="form"
                    onSubmit={login}
                    ref={formRef}
                    style={{
                        width: 300,
                        backgroundColor: "#fff",
                        padding: 20
                    }}
                >
                    <Stack spacing={2}>
                        <Typography variant="h6">Kirjaudu sisään</Typography>
                        <TextField
                            label="Käyttäjätunnus"
                            name="kayttajatunnus"
                            error={Boolean(errorText.kayttaja)}
                            helperText={errorText.kayttaja}
                        />
                        <TextField
                            label="Salasana"
                            name="salasana"
                            type="password"
                            error={Boolean(errorText.salasana)}
                            helperText={errorText.salasana}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                        >
                            Kirjaudu
                        </Button>
                        <Button
                            component={Link}
                            to="/register"
                        >Rekisteröidy</Button>
                    </Stack>
                </Box>
            </Paper>
        </Backdrop>
    );
};

export default Login;