import { Button, Container, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface Props {
    viestiketjut: Viestiketju[],
    kayttaja: React.MutableRefObject<string>,
    setToken: React.Dispatch<React.SetStateAction<string>>
}

const Start: React.FC<Props> = ({ viestiketjut, kayttaja, setToken }): React.ReactElement => {

    const logout = () : void => {

        localStorage.clear();

        setToken("null");
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
                <Typography
                    variant="h4"
                >
                    {`Tervetuloa käyttäjä ${kayttaja.current}.`}
                </Typography>
                <List>
                    {viestiketjut.map((viestiketju: Viestiketju) => {

                        return (
                            <ListItem
                                key={viestiketju.id}
                            >
                                <Button
                                    component={Link}
                                    to={`/viestiketju/${viestiketju.id}`}
                                >
                                    <ListItemText
                                        primary={`${viestiketju.lahettaja} - ${viestiketju.vastaanottaja}`}
                                        secondary={format(new Date(viestiketju.aikaleima), "dd.MM.yy HH:mm")}
                                    />
                                </Button>
                            </ListItem>
                        )
                    })}
                </List>
                <Button
                    component={Link}
                    to="/viestiketju"
                >Uusi viestiketju</Button>
                <Button
                    onClick={logout}
                >Kirjaudu ulos</Button>
            </Stack>
        </Container>
    )
}

export default Start;