import Login from "./Login";
import Start from "./Start";


interface Props {
    token: string,
    setToken: React.Dispatch<React.SetStateAction<string>>,
    kayttaja: React.MutableRefObject<string>
    viestiketjut: Viestiketju[],
    setViestiketjut: React.Dispatch<React.SetStateAction<Viestiketju[]>>
}

const Main: React.FC<Props> = ({ token, setToken, kayttaja, viestiketjut, setViestiketjut }): React.ReactElement => {

    return (
        <>
            {(Boolean(token !== "null"))
                ? <Start viestiketjut={viestiketjut} kayttaja={kayttaja} setToken={setToken} />
                : <Login setToken={setToken} setViestiketjut={setViestiketjut} kayttaja={kayttaja} />
            }
        </>
    )
}

export default Main;