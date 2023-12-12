import { axios, apiURL } from './config.js';
import axios2 from 'axios';
const key = "pk_test_AaOR0GjtNBsv0M4o"
class Payment {

    static async getTaxas() {
        try {
            const response = await axios.get(`${apiURL}/payment_tax/all`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data)
                return error.response.data
            else return { success: false, message: 'Houve um erro desconhecido' };
        }
    }

    static async generateCardHash(number, holder_name, exp_month, exp_year, cvv, holder_document) {
        const url = 'https://api.pagar.me/core/v5/tokens?appId=pk_test_AaOR0GjtNBsv0M4o';

        const headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
        };

        const body = {
            card: {
                number: parseInt(number.replaceAll(" ", "")),
                holder_name: holder_name,
                exp_month: parseInt(exp_month),
                exp_year: parseInt(exp_year),
                cvv: parseInt(cvv),
                holder_document: holder_document.replace(/\D/g, '')
            },
            type: 'card'
        };

        const requestOpt = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        }

        try {
            const response = await fetch(url, requestOpt);
            const jsonResponse = await response.json();

            return jsonResponse.id;
        } catch (error) {
            if (error.response && error.response.data)
                return error.response.data
            else return { success: false, message: 'Houve um erro desconhecido' };
        }
    }
    static async verifyCardIndo(card) {
        try {
            const response = await axios.get(`${apiURL}/material/${id}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data)
                return error.response.data
            else return { success: false, message: 'Houve um erro desconhecido' };
        }
    }
    static async create(data) {
        try {
            const response = await axios.post(`${apiURL}/material`, data);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data)
                return error.response.data
            else return { success: false, message: 'Houve um erro desconhecido' };
        }
    }
    static async update(id, data) {
        try {
            const response = await axios.put(`${apiURL}/material/${id}`, data);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data)
                return error.response.data
            else return { success: false, message: 'Houve um erro desconhecido' };
        }
    }

    static async destroy(id) {
        try {
            const response = await axios.delete(`${apiURL}/material/${id}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data)
                return error.response.data
            else return { success: false, message: 'Houve um erro desconhecido' };
        }
    }

}

export default Payment