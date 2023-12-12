import { axios, apiURL } from './config.js';

class Statistics {
    static async getCountUserByType() {
        try {
            const response = await axios.get(`${apiURL}/user/count_types`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async getCountNewUsers(id) {
        try {
            const response = await axios.get(`${apiURL}/user/monthly/show_new`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getShipStatus() {
        try {
            const response = await axios.get(`${apiURL}/order/ship/status`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getOrderMonthly(id_salesman = '') {
        try {
            const response = await axios.get(`${apiURL}/order/monthly${id_salesman != '' ? "?id_salesman="+id_salesman : ''}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getOrderYearly(id_salesman = '') {
        try {
            const response = await axios.get(`${apiURL}/order/yearly${id_salesman != '' ? "?id_salesman="+id_salesman : ''}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getProductAvailable(id_salesman = ''){
        try {
            const response = await axios.get(`${apiURL}/product/available${id_salesman != '' ? "?id_salesman="+id_salesman : ''}`);
            //console.log(response)
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getOrdersSold() {
        try {
            const response = await axios.get(`${apiURL}/order/sold`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getCountSalesmanAvaliation(id_salesman = '') {
        try {
            const response = await axios.get(`${apiURL}/avaliation/salesman/relation${id_salesman != '' ? "?id_salesman="+id_salesman : ''}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getCountProductAvaliation(id_salesman = '') { 
        try {
            const response = await axios.get(`${apiURL}/avaliation/product/relation${id_salesman != '' ? "?id_salesman="+id_salesman : ''}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getCountSalesSalesman(id_salesman = '') {
        try {
            const response = await axios.get(`${apiURL}/product/amount_sold/${id_salesman}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    
}

export default Statistics;