<template>
  <div class="flex justify-center items-center h-screen bg-gray-900 px-6">
    <div class="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
      <div class="flex justify-center items-center">
        <img
          class="h-32 w-32"
          src="https://system-photos.s3.sa-east-1.amazonaws.com/iStones-Logo.svg"
          alt="iStones"
        />
      </div>
      <form class="mt-4" @submit.prevent="resend">
        <div class="mb-1 mt-10">
          <p class="block text-sm fontme text-gray-500 text-center">
            Você deve confirmar o email antes de acessar!
          </p>
        </div>

        <div class="mb-1">
          <p class="block text-sm fontme text-gray-500 text-center">
            Ainda não recebeu nosso email?
          </p>
        </div>

        <div class="mt-6">
          <button
            type="submit"
            class="
              transition
              duration-150
              py-2
              px-4
              bg-red-800
              hover:bg-red-900
              text-white
              font-bold
              border-b-4 border-red-900
              focus:outline-none
              rounded
              w-full
            "
            :disabled="blockAction"
          >
            Reenviar
          </button>
          <MessageCard :type="type" :message="message" :title="title" />
          <router-link
            class="
              block
              text-sm
              fontme
              text-gray-500
              hover:text-red-700 hover:underline
              text-center
              mt-2
            "
            to="/login"
            >Login</router-link
          >
        </div>
      </form>
      <p class="text-center text-gray-500 text-xs mt-10">
        &copy;2020 iStones | All rights reserved.
      </p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import MessageCard from "../components/MessageCard.vue";
import Login from "../services/Login";

export default defineComponent({
  data() {
    return {
      id: null,
      email: "",
      password: "",

      type: "none",
      message: "",
      title: "",

      blockAction: false,
    };
  },
  methods: {
    async resend() {
      this.blockAction = true;
      const result = await Login.resendConfirmationEmail(this.id);
      if (result.success) {
        this.message = result.message;
        this.title = "Sucesso!";
        this.type = "success";
      } else {
        this.message = result.message;
        this.title = "Erro";
        this.type = "error";
      }

      this.blockAction = false;
      setTimeout(() => {
        this.type = "none";
      }, 3000);
    },
  },
  created: function () {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      let query = Object.assign({}, this.$route.query);
      delete query.id;
      this.$router.replace({ query });
    } else this.$router.push({ path: "/login" });
  },
  components: {
    MessageCard,
  },
});
</script>
