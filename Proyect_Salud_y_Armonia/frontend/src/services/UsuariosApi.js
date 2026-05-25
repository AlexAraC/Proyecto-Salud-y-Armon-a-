import axios from "axios"; //Importacion  de la liberia de apis

const API_URL = "http://localhost:3000/usuarios"; 

export const crearUsuario = async (datos) => { 
    return await axios.post(
        API_URL,
        datos
    );
}