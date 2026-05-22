import {

    BrowserRouter,
    Routes,
    Route

} from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CarritoPage from './pages/CarritoPage';
import AdminPage from './pages/AdminPage';


function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<HomePage />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/carrito"
                    element={<CarritoPage />}
                />

                <Route
                    path="/admin"
                    element={<AdminPage />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;