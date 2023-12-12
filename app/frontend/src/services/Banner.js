import { axios, apiURL } from './config.js';

class Banner {
    static async getAll() {
        try {
            const response = await axios.get(`${apiURL}/banner/all/`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async create(data) {
        try {
            const response = await axios.post(`${apiURL}/banner`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async update(data) {
        try {
            const response = await axios.put(`${apiURL}/banner/`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async destroy(id){
        try {
            const response = await axios.delete(`${apiURL}/banner/${id}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
}

export default Banner;