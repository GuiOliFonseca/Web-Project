import { axios, apiURL } from './config.js';

class Order {
    static async getAllSalesmanOrder(id, page = 1, method = 'C') {
        try {
            const response = await axios.get(`${apiURL}/order/all/salesman/${id}?page=${page}&method=${method}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getAllOrders(page = 1, method = 'C') {
        try {
            const response = await axios.get(`${apiURL}/order/all/?page=${page}&method=${method}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getAllClientOrder(id, page = 1) {
        try {
            const response = await axios.get(`${apiURL}/order/all/client/${id}?page=${page}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getOrderById(id) {
        try {
            const response = await axios.get(`${apiURL}/order/${id}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async create(data) {
        try {
            const response = await axios.post(`${apiURL}/order`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async update(id, data) {
        try {
            const response = await axios.put(`${apiURL}/material/${id}`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async destroy(id) {
        try {
            const response = await axios.delete(`${apiURL}/material/${id}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async confirmDelivery(id_client, id_order, id_order_product){
        try {
            const response = await axios.put(`${apiURL}/order/confirm_delivery/${id_client}/${id_order_product}/${id_order}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async confirmShipping(id_salesman, id_order_product){
        try {
            const response = await axios.put(`${apiURL}/order/confirm_shipping/${id_salesman}/${id_order_product}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

}

export default Order