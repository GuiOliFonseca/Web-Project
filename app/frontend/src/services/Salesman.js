import { axios, apiURL } from './config.js';

class Salesman {
    static async getAll(page = '1') {
        try {
            const response = await axios.get(`${apiURL}/salesman/all?page=${page}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async getSalesmanById(id) {
        try {
            const response = await axios.get(`${apiURL}/salesman/${id}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async create(data) {
        try {
            const response = await axios.post(`${apiURL}/salesman`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async update(data) {
        try {
            const response = await axios.put(`${apiURL}/salesman`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getSalesmanOwnProducts(id_salesman, page = 1){ 
        try {
            const response = await axios.get(`${apiURL}/salesman/product/${id_salesman}?page=${page}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async destroy(id){
        try {
            const response = await axios.delete(`${apiURL}/salesman/${id}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getNotifications(id_salesman){
        try {
            const response = await axios.get(`${apiURL}/salesman/all/message/${id_salesman}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'}; 
        }
    }

    static async reactive(id_salesman){
        try {
            const response = await axios.get(`${apiURL}/salesman/retrieve/${id_salesman}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'}; 
        }
    }
}

export default Salesman;