import { axios, apiURL } from './config.js';

class SalesmanAvaliation {
    static async getSalesmanAvaliations(id_salesman) {
        try {
            const response = await axios.get(`${apiURL}/avaliation/salesman/all/${id_salesman}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async getSalesmanAvaliation(id_avaliation) {
        try {
            const response = await axios.get(`${apiURL}/avaliation/salesman/${id_avaliation}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async countAvaliations(id_salesman){
        try {
            const response = await axios.get(`${apiURL}/avaliation/salesman/count/${id_salesman}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async create(data) {
        try {
            const response = await axios.post(`${apiURL}/avaliation/salesman`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async destroy(id){
        try {
            const response = await axios.delete(`${apiURL}/avaliation/product/${id}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
}

export default SalesmanAvaliation;