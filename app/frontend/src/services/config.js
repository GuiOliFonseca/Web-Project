import axios from 'axios';

const apiURL = 'http://localhost:3000';

axios.interceptors.request.use((config) => {
    config.timeout = 15000;
    config.withCredentials = true;
    config.headers.common['authorization'] = 'Bearer ' + window.localStorage.getItem('token')
    config.headers.common['Access-Control-Allow-Origin'] = 'https://istonesapp.com.br';

    return config;
})

export {
    apiURL,
    axios
}
