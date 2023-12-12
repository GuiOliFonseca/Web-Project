import { axios, apiURL } from './config.js';

class Chat {
    static async initiateChatRoom(data) {
        try {
            const response = await axios.post(`${apiURL}/room/initiate`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async sendMessage(data) {
        try {
            const response = await axios.post(`${apiURL}/room/message`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }
    static async retriveChatMessage(id_room) {
        try {
            const response = await axios.get(`${apiURL}/room/message/${id_room}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async getChatRooms(id_user) {
        try {
            const response = await axios.get(`${apiURL}/room/chat/${id_user}`);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    static async markAsRead(data){
        try {
            const response = await axios.post(`${apiURL}/room/read/`, data);
            return response.data;
        } catch (error) {
            if(error.response && error.response.data)
                return error.response.data
            else return {success: false, message: 'Houve um erro desconhecido'};
        }
    }

    // static async newMessage(socket) {
    //     let data = {}

    //     socket.on("new Message", message => {
    //         data.message = message;
    //     });

    //     return data;
    // }

    // static async identify(socket, id_user) {
    //     let data = {}

    //     socket.on("new Message", message => {
    //         data.message = message;
    //     });

    //     return data;
    // }
}

export default Chat