import { axios, apiURL } from './config';

class Login {
    static async login(email, password) {
        try {
            const response = await axios.post(`${apiURL}/login`, { email, password });
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response;
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getUserInfo() {
        try {
            const response = await axios.get(`${apiURL}/me`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async logout() {
        try {
            const response = await axios.post(`${apiURL}/logout`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return {...error.response.data, status: error.response.status}
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async recoverPassword(email) {
        try {
            const response = await axios.post(`${apiURL}/recover-password`, { email });
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async confirmRecoverPassword(token, password) {
        try {
            const response = await axios.post(`${apiURL}/change-password?token=${token}`, { password });
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async resendConfirmationEmail(id_user) {
        try {
            const response = await axios.post(`${apiURL}/resend-confirm`, { id_user });
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async confirmEmail(token){
        try {
            const response = await axios.get(`${apiURL}/confirm?token=${token}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
}

export default Login