import Login from '../../services/Login';

const getters = {

}

const actions = {
    login: async({ commit }, payload) => {
        return new Promise((resolve, reject) => {
            Login.login(payload.email, payload.password).then(result => {
                if (result.success) {
                    commit("setLogin", { isLogged: true, token: result.token });
                    commit("setUser", result.data);
                    resolve(result);
                } else resolve(result);
            }).catch(error => {
                reject(error);
            })
        })
    },

    async verifyLoginValidity(context) {
        const token = await localStorage.getItem('token');

        if(token !== 'undefined') {
            const result = await Login.getUserInfo();

            if(result.success) {
                context.commit('setUser', result.user);
            } else {
                context.dispatch('logout');
            }
        }
    },

    logout: async({ commit }) => {
        commit("resetLogin");
        commit("resetUser");
        commit("resetCart");
    }
}

let login = {
    isLogged: false,
    token: window.localStorage.getItem('token')
}

const mutations = {
    setLogin: (state, payload) =>{
        state.login = payload;
        localStorage.setItem('token', payload.token);
    },
    resetLogin: (state) => {
        window.localStorage.setItem('token', undefined);
        state.login.isLogged = false;
    },
}


if (window.localStorage.getItem('token') && window.localStorage.getItem('token') !== 'undefined') login.isLogged = true;
export default {
    getters,
    actions,
    mutations,
    state: {
        login
    }
}