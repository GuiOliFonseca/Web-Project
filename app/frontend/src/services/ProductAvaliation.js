import { axios, apiURL } from './config.js';

class ProductAvaliation {
    static async getProductAvaliations(id_product, page = '1') {
        try {
            const response = await axios.get(`${apiURL}/avaliation/product/product/${id_product}?page=${page}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async getOrderProductAvaliation(id_order) {
        try {
            const response = await axios.get(`${apiURL}/avaliation/product/order/${id_order}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getClientProductAvaliation(id_client) {
        try {
            const response = await axios.get(`${apiURL}/avaliation/product/client/${id_client}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async create(data) {
        try {
            const response = await axios.post(`${apiURL}/avaliation/product`, data);
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

export default ProductAvaliation;