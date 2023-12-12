let users = [];
const Product = require('../models/Product');
class WebSockets {
    connection(client) {
        // event fired when the chat room is disconnected
        client.on("disconnect", (reason) => {
            console.log("usuário " + client.id + " se desconectou, razao: " + reason)
            users = users.filter(user => user.socketId != client.id)
        });
        // add identity of user mapped to the socket id
        client.on("identify", (userId) => {
            console.log("Usuário se identificou", userId, client.id)
            users.push({
                socketId: client.id,
                userId: userId,
            });
        });
        // subscribe person to chat & other user as well
        client.on("subscribe", (room) => {
            if(typeof room == 'string') {
                room = JSON.parse(room);
                room = room.rooms;
            }
            console.log("Usuário se inscreveu na sala ", room)
            client.join(room); 
        });
        // mute a chat room
        client.on("unsubscribe", (room) => {
            console.log("usuario " + client.id + " saiu da sala " + room)
            console.log(typeof room)
            client.leave(room);
            users = users.filter(user => user.socketId != client.id)
            console.log("Usuário se desinscreveu da sala ", room)
        });

        client.on('visit', async(id_product) => {
            Product.increaseVisits(id_product);
        })
    }

    subscribeOtherUser(room, otherUserId) {
        const userSockets = this.users.filter(
            (user) => user.userId === otherUserId
        );
        userSockets.map((userInfo) => {
            const socketConn = global.io.sockets.connected(userInfo.socketId);
            if (socketConn) {
                socketConn.join(room);
            }
        });
    }

    getUsers(){
        return users;
    }

    getUserById(id){
        return users.filter(user => id == user.userId);
    }
}

module.exports = new WebSockets();
