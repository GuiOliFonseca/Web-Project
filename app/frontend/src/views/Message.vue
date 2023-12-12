<template>
  <div class="min-h-screen flex flex-col">
      <MessageCardFixed :type="type" :message="messageCard" :title="title"/>
    <div class="flex-grow px-6 pt-8 pb-2">
      <h1 class="text-2xl lg:text-5xl text-gray-800 lg:font-light mb-2">
        Mensagem Geral
      </h1>
      <div class="my-auto bg-white mt-4 rounded-lg p-6">
          <h1 class="text-xl lg:2xl text-gray-800 lg:font-light mb-2">
            Nova mensagem
          </h1>

          <textarea v-model="message" class="form-input w-full" rows="10"></textarea>
          <button type="button" @click="send()" class="transition
                duration-150
                py-2
                px-4
                bg-red-800
                hover:bg-red-800
                text-white
                font-bold
                border-b-4 border-red-800
                focus:outline-none
                rounded
                w-full
                mt-6">Enviar mensagem</button>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Admin from '../services/Admin';

import MessageCardFixed from "../components/MessageCardFixed.vue";
import Footer from "../components/Footer.vue";
export default {
  components: {
    Footer,
    MessageCardFixed
  },
  data() {
    return {
      message: "",
      loading: false,

      title: '',
      messageCard: '',
      type: 'none'
    }
  },
  methods: {
    setMessage(title, type, message, miliseconds) {
      this.messageCard = message;
      this.type = type;
      this.title = title;
      setTimeout(() => {
        this.type = "none";
      }, miliseconds);
    },
    async send(){
      this.loading = true;
      const result = await Admin.sendMessage({message: this.message});
      //console.log(result)
      if(result.success){
          this.setMessage('Sucesso!','success', 'Mensagem enviada!',3000);
      }else{
          this.setMessage("Erro!", "error", result.message, 3000);
      }
      this.loading = false
    }
  }
};
</script>

<style>
</style>