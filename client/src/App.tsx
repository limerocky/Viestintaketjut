import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import Register from './components/Register';
import UusiViestiketju from './components/UusiViestiketju';
import Viestiketju from './components/Viestiketju';

const App: React.FC = (): React.ReactElement => {

  const [token, setToken] = useState<string>(String(localStorage.getItem("token")));
  const [viestiketjut, setViestiketjut] = useState<Viestiketju[]>([]);
  const kayttaja = useRef<string>(String(localStorage.getItem("kayttaja")));

  const loaded = useRef<boolean>(false);

  useEffect(() => {

    if (!loaded.current) {

      if (localStorage.getItem("viestit")) {

        setViestiketjut(JSON.parse(String(localStorage.getItem("viestit"))));

      }
    }

    return () => {
      loaded.current = true;
    }

  }, []);

  useEffect(() => {

    localStorage.setItem("viestit", JSON.stringify(viestiketjut));

  }, [viestiketjut]);

  return (

    <Routes>

      <Route path="/" element={<Main token={token} setToken={setToken} kayttaja={kayttaja} viestiketjut={viestiketjut} setViestiketjut={setViestiketjut} />} />

      <Route path="/viestiketju/:id" element={<Viestiketju viestiketjut={viestiketjut} setViestiketjut={setViestiketjut} token={token} />} />

      <Route path="/viestiketju" element={<UusiViestiketju viestiketjut={viestiketjut} setViestiketjut={setViestiketjut} kayttaja={kayttaja.current} token={token} />} />

      <Route path="/register" element={<Register />} />

    </Routes>

  );
}

export default App;
