import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import Login from './pages/Login/Login';
import Register from './pages/Login/Registrarse';
import RecuperacionCodigo from './pages/Login/RecuperacionCodigo';
import VerificacionCodigo from './pages/Login/VerificarCodigoUsuario';
import DesplegarCatalogo from './pages/Catalogo/CatalogoMain';
import DetalleProducto from './pages/Catalogo/DetalleProducto';
import ConfirmarPedido from './pages/Catalogo/ConfirmarPedido';
import CambioDePassword from './pages/Login/CambioDePassword';
import Perfil from './pages/Login/Perfil';
import Inicio from './pages/Home/Inicio';
import VerificarCorreo from './pages/Login/VerificarCorreo';
import MenuPrincipal from './pages/Administracion/MenuPrincipal';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import SessionExpiredModal from './components/SessionExpiredModal';
import { useSessionExpiry } from './hooks/useSessionExpiry';

// Componente interno que tiene acceso a useNavigate (dentro de BrowserRouter)
function AppContent() {
    const navigate = useNavigate();
    const { expired, warning, remaining, dismiss } = useSessionExpiry();

        const handleLogout = () => {
            dismiss(); // Reinicia los estados del hook

            localStorage.removeItem('token');
            localStorage.removeItem('loginTime');

            navigate('/');
        };
    // Determinar qué mode pasarle al modal
    const modalMode = expired ? 'expired' : warning ? 'warning' : null;

    return (
        <>
            <Navbar />

            {/* Modal de sesión caducada / por caducar */}
            <SessionExpiredModal
                mode={modalMode}
                remaining={remaining}
                onStay={dismiss}
                onLogout={handleLogout}
            />

            <div className="contenido-principal">
                <Routes>
                    <Route path="/"                    element={<Inicio />} />
                    <Route path="/register"            element={<Register />} />
                    <Route path="/login"               element={<Login />} />
                    <Route path="/recuperacion"        element={<RecuperacionCodigo />} />
                    <Route path="/verificacion-codigo" element={<VerificacionCodigo />} />
                    <Route path="/verificar-correo"    element={<VerificarCorreo />} />
                    <Route path="/cambio_de_password"  element={<CambioDePassword />} />
                    <Route path="/administracion"      element={<MenuPrincipal />} />
                    <Route path="/catalogo"            element={<DesplegarCatalogo />} />
                    <Route path="/producto/:id"        element={<DetalleProducto />} />
                    <Route path="/confirmar-pedido"    element={<ConfirmarPedido />} />
                    <Route path="/perfil"              element={<Perfil />} />
                </Routes>
            </div>

            <Footer />
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
