import {

    BrowserRouter,
    Routes,
    Route,
    Navigate

} from 'react-router-dom';

import Login from './pages/Login/Login';

import Register from './pages/Login/Registrarse';

import RecuperacionCodigo
from './pages/Login/RecuperacionCodigo';

import VerificacionCodigo
from './pages/Login/VerificarCodigoUsuario';

import CambioDePassword 
from './pages/Login/CambioDePassword';

import MenuPrincipal 
from './pages/Administracion/Menuprincipal'

import Footer 
from './components/footer';

import Navbar 
from './components/Navbar';

function App() {

    return (

        <BrowserRouter>

            <Navbar/>

            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/recuperacion"
                    element={<RecuperacionCodigo />}
                />

                <Route
                    path="/verificacion-codigo"
                    element={<VerificacionCodigo />}
                />
                 <Route
                    path="/cambio_de_password"
                    element={<CambioDePassword />}
                />
                <Route
                    path="/administracion"
                    element={<MenuPrincipal />}
                />

        
            </Routes>
           

            <Footer/>

        </BrowserRouter>

    );

}

export default App;