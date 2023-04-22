import React, { useRef, useState } from "react";
import { Backdrop, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface Errors {
    kayttaja?: string,
    salasana?: string
}

const Register: React.FC = (): React.ReactElement => {

    const navigate : NavigateFunction = useNavigate();

    const [errorText, setErrorText] = useState<Errors>({});
    const formRef = useRef<HTMLFormElement>();

    const register = async (e: React.FormEvent): Promise<void> => {

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

            const yhteys = await fetch("http://localhost:3456/api/auth/", {
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

                setErrorText({});

                navigate("/")

            }
            else {
                setErrorText({ kayttaja: "Käyttäjää ei pystytty luomaan", salasana: "Käyttäjää ei pystytty luomaan" });
            }
        }
    };

    return (
        <Backdrop open={true}>
            <Paper sx={{ padding: 2 }}>
                <Box
                    component="form"
                    onSubmit={register}
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
                            Rekisteröidy
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Backdrop>
    );
};

export default Register;