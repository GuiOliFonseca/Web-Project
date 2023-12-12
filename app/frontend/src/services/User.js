import { axios, apiURL } from './config.js';

class User {
    static async getAll(page = '1') {
        try {
            const response = await axios.get(`${apiURL}/user/all?page=${page}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async getUserById(id) {
        try {
            const response = await axios.get(`${apiURL}/user/${id}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async create(data) {
        try {
            const response = await axios.post(`${apiURL}/user`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async update(data) {
        try {
            const response = await axios.put(`${apiURL}/user`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async destroy(id){
        try {
            const response = await axios.delete(`${apiURL}/user/${id}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
}

export default User;