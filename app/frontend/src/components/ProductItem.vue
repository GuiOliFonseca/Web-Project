<template>
  <div class="w-full my-1 px-1">

    <div
      :class="`modal ${
        !openModalDelete && 'opacity-0 pointer-events-none'
      } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
    >
      <div
        class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
      ></div>

      <div
        class="
          modal-container
          bg-white
          w-11/12
          md:max-w-xl
          mx-auto
          rounded
          shadow-lg
          z-50
          overflow-y-auto
        "
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-3">
            <p class="text-2xl font-bold text-red-800">Apagar Produto</p>
            <div
              class="modal-close cursor-pointer z-50"
              @click="openModalDelete = false"
            >
              <svg
                class="fill-current text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                />
              </svg>
            </div>
          </div>

          <!--Body-->
          <form @submit.prevent="deleteProduct()">
            <div>
              <p class="text-gray-800">Você tem certeza que deseja apagar o produto?</p>
            </div>
            <!--Footer-->
            <div class="flex justify-end pt-2">
              <button
                @click="openModalDelete = false"
                type="button"
                class="
                  px-6
                  py-3
                  bg-transparent
                  p-3
                  rounded-lg
                  text-red-800
                  hover:bg-gray-100
                  hover:text-red-700
                  mr-2
                "
              >
                Fechar
              </button>
              <button
                :disabled="buttonLoading"
                class="
                  px-6
                  py-3
                  bg-red-800
                  rounded-md
                  text-white
                  font-medium
                  tracking-wide
                  hover:bg-red-700
                "
              >
                Apagar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <MessageCardFixed :type="type" :message="message" :title="title"/>
      <div class="w-full rounded-lg bg-white overflow-hidden shadow-sm mt-6">
        <div class="flex justify-start">
          <img
            @click="redirect()"
            class="h-40 w-3/12 xl:w-2/12 object-cover cursor-pointer"
            :src="product.url_image"
            alt="img"
          />
          <div class="w-full md:flex p-4 text-left text-gray-700">
            <div @click="redirect()" class="cursor-pointer md:w-9/12 md:text-xl text-lg">
              <p>
                <span class="text-gray-700"><b>{{ product.title }}</b></span>
              </p>
              <p>
                Valor: <span class="text-gray-800 text-md"
                  >R$ {{ (product.price - product.discount).toLocaleString('pt-br', {minimumFractionDigits: 2}) }} <small>por m²</small></span
                >
              </p>
              <p>
                Quantidade disponível: <span class="text-gray-800 text-md"
                  >{{ product.quantity}}</span
                >
              </p>
              <p>
                Desconto: <span class="text-gray-800 text-md"
                  >{{ product.disvount ? product.discount : 'Não'}}</span
                >
              </p>
            </div>
            <div
              class=" cursor-pointer md:w-3/12 md:text-right md:text-xl text-lg content-center"
            >
              <p @click="reactive()" class="text-red-800">{{product.is_active ? "Desativar produto" : "Reativar produto"}}</p>
              <p @click="openModalDelete = true" class="text-red-800">Apagar produto</p>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import Product from "../services/Product";
import MessageCardFixed from "../components/MessageCardFixed.vue";

export default {
  props: {
    product: Object,
  },
  components: {
    MessageCardFixed
  },
  data() {
    return {
      index: 0,
      openModalDelete: false,
      buttonLoading: false,

      type: 'none',
      message: '',
      title: '',
    };
  },
  computed: {
  },
  methods: {
    redirect(){
      this.$router.push(`/produto/editar/${this.product.id}`);
    },
    async reactive(){
      const result = await Product.updateActivity({is_active: !this.product.is_active, id_product: this.product.id});
      //console.log(result);
      if(result.success) {
        this.setMessage('Sucesso!', 'success', 'Operação concluída!', 3000);
        this.$emit('reload', null);
      }else this.setMessage('Erro!', 'error', result.message, 3000);

      this.openModalDelete = false;
    },
    async deleteProduct(){
      const result = await Product.destroy(this.product.id);
      //console.log(result);
      if(result.success) {
        this.setMessage('Sucesso!', 'success', 'Produto apagado!', 3000);
        this.$emit('reload', null);
      }else this.setMessage('Erro!', 'error', result.message, 3000);

      this.openModalDelete = false;
    },
    setMessage(title, type, message, miliseconds) {
      this.message = message;
      this.type = type;
      this.title = title;
      setTimeout(() => {
        this.type = "none";
      }, miliseconds);
    },
    created() {
      //console.log(this.product)
    }
  },
};
</script>
