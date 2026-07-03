import {

    BrowserRouter,
    Routes,
    Route

} from 'react-router-dom';

import Login from './pages/Login/Login';

import Register from './pages/Login/Registrarse';

import RecuperacionCodigo
from './pages/Login/RecuperacionCodigo';

import VerificacionCodigo
from './pages/Login/VerificarCodigoUsuario';

import DesplegarCatalogo 
from './pages/Catalogo/CatalogoMain'

import DetalleProducto 
from './pages/Catalogo/DetalleProducto'

import ConfirmarPedido 
from './pages/Catalogo/ConfirmarPedido'

import CambioDePassword 
from './pages/Login/CambioDePassword';

import Perfil 
from './pages/Login/Perfil';

import Inicio 
from './pages/Home/Inicio';

import VerificarCorreo 
from './pages/Login/VerificarCorreo';

import MenuPrincipal 
from './pages/Administracion/MenuPrincipal'

import Footer 
from './components/Footer';

import Navbar 
from './components/Navbar';

function App() {

    return (

        <BrowserRouter>

            <Navbar/>

            <div className="contenido-principal">

            <Routes>

                <Route
                    path="/"
                    element={<Inicio />}
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
                    path="/verificar-correo"
                    element={<VerificarCorreo />}
                />
                 <Route
                    path="/cambio_de_password"
                    element={<CambioDePassword />}
                />
                <Route
                    path="/administracion"
                    element={<MenuPrincipal />}
                />
                <Route
                path='/catalogo'
                element={<DesplegarCatalogo />}
                />
                <Route
                path='/producto/:id'
                element={<DetalleProducto />}
                />
                <Route
                path='/confirmar-pedido'
                element={<ConfirmarPedido />}
                />
                <Route
                path='/perfil'
                element={<Perfil />}
                />

        
            </Routes>

            </div>
           

            <Footer/>

        </BrowserRouter>

    );

}

export default App;
