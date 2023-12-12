import { axios, apiURL } from './config.js';

class Address {
    static async getAll(id_user) {
        try {
            const response = await axios.get(`${apiURL}/address/all/${id_user}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async getAddressById(id) {
        try {
            const response = await axios.get(`${apiURL}/address/${id}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async create(data) {
        try {
            const response = await axios.post(`${apiURL}/address`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async update(data) {
        try {
            const response = await axios.put(`${apiURL}/address/`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async destroy(id){
        try {
            const response = await axios.delete(`${apiURL}/address/${id}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getCEPInfo(cep){
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/unicode/`);
            return {success: true, cep: response.data};
        } catch (error) {
            if(error.response && error.response.data)
                return {success: false, message: error.response.data};
            else return {success: false, message: 'Houve um erro desconhecido'};;
        }
    }
}

export default Address;