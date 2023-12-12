import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import VueSmoothScroll from 'vue3-smooth-scroll'
import VueSocketIOExt from 'vue-socket.io-extended';
import {io} from 'socket.io-client';
const socket = io('https://api.istonesapp.com.br');
//console.log(socket)

import './assets/main.css'

import { JSEncrypt } from 'jsencrypt'

import DashboardLayout from './components/DashboardLayout.vue'
import EmptyLayout from './components/EmptyLayout.vue'
import VueEasyLightbox from 'vue-easy-lightbox'

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

import config from '../config';

const app = createApp(App)

app.config.globalProperties.$encryptedData = function (password) {
    //new an object
    let encrypt = new JSEncrypt()
    //Setting public key
    encrypt.setPublicKey("-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBADZGBaE2ppIcVJxf+Vc7K85PgF2mM56oTvUrlyadaPKdlFac1jBTScg7PnC/dd/ezOtxE7fYW5bQL4LUOFe8aGHgMdg1ZWExVYYho05gN2xOU9BK3FDXQS3zSbnX116euwm3ZBH9Ld7LCVlrV4AoXSW8OUmzR33EyBmj1cblGQIDAQAB-----END PUBLIC KEY-----");
    //password is the data to be encrypted. You don't need to pay attention to the + sign here, because rsa itself has already transcoded base64, and there is no +. It's all binary data
    let result = encrypt.encrypt(password)
    return result
}

app.config.devtools = true
app.component('default-layout', DashboardLayout)
app.component('empty-layout', EmptyLayout)
app.use(router)
app.use(config)
app.use(VueSocketIOExt, socket);
app.use(VueEasyLightbox)
app.use(store)
app.use(VueSmoothScroll)
app.mount('#app')
