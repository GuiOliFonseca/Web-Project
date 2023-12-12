import { axios, apiURL } from './config.js';

class Admin {
    static async sendMessage(data) {
        try {
            const response = await axios.post(`${apiURL}/admin/message`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async findMessages() {
        try {
            const response = await axios.get(`${apiURL}/admin/all/message`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
}

export default Admin;