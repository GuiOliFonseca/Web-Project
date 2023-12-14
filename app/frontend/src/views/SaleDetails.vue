<template>
  <div class="min-h-screen flex flex-col">
    <MessageCardFixed :type="type" :message="message" :title="title" />

    <!-- Modal Confirmação de Envio -->
    <div
      :class="`modal ${
        !openConfirmShipping && 'opacity-0 pointer-events-none'
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
          lg:max-w-md
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
            <p class="text-2xl font-bold text-red-800">Confirmar Envio</p>
            <div
              class="modal-close cursor-pointer z-50"
              @click="openConfirmShipping = false"
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
          <form @submit.prevent="confirmShipping()">
            <p class="text-center text-5xl text-red-800">
              <i class="fas fa-radiation fa-spin"></i>
            </p>
            <p class="my-4">Tem certeza que deseja confirmar o envio de {{name}}?</p>

            <!--Footer-->
            <div class="flex justify-end pt-2">
              <button
              type="button"
                @click="openConfirmShipping = false"
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
                Cancelar
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
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="flex-grow px-6 pt-8 pb-2">
      <h1 class="text-2xl lg:text-5xl text-gray-800 lg:font-light mb-2">
        Detalhes do Pedido #{{ $route.params.id }}
      </h1>
      <div class="flex-grow">
        <SaleInfo v-if="!loading" :order="order" />
        <h3 class="text-xl md:text-3xl text-gray-800">Produtos desta Venda</h3>

        <template v-if="!loading">
          <div
            v-for="product in order.products"
            :key="product.id"
            class="w-full my-2 px-1"
          >
            <div
              class="w-full rounded-lg bg-white overflow-hidden shadow-sm mt-6"
            >
              <div class="flex justify-start">
                <img
                  class="h-40 w-3/12 object-cover cursor-pointer"
                  :src="product.url_image"
                  alt="img"
                />
                <div class="md:flex px-6 py-4 text-left w-full">
                  <div class="w-full md:w-9/12">
                    <p class="text-lg md:text-2xl mb-3 text-gray-800">
                      {{ product.title }}
                    </p>
                    <p class="text-lg md:text-2xl text-gray-800">
                      R$ {{ (product.price * product.width * product.height).toFixed(2).toLocaleString('pt-br', {minimumFractionDigits: 2}) }}
                    </p>
                    <p class="text-sm md:text-base text-gray-600">
                      Quantidade: {{ product.quantity }}
                    </p>
                    <p><i class="fas fa-store"></i> Sua Loja</p>
                  </div>
                  <hr class="md:display-none border-gray-500 my-4" />
                  <div class="w-full md:w-3/12 md:text-center my-auto">
                    <p
                      v-if="product.status == 'C'"
                      class="cursor-pointer text-red-800 hover:text-gray-600"
                      @click="
                        modalConfirmShipping(
                          product.id_salesman,
                          product.id_order_product,
                          product.title
                        )
                      "
                    >
                      Confirmar Envio
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="loading">
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import SaleInfo from "../components/SaleInfo.vue";
import MessageCardFixed from "../components/MessageCardFixed.vue";

import Order from "../services/Order";
export default {
  data() {
    return {
      openConfirmShipping: false,

      order: {},
      loading: true,

      confirmationData: {},

      type: "none",
      message: "",
      title: "",

      name: "",
      buttonLoading: false
    };
  },
  components: {
    SaleInfo,
    MessageCardFixed,
  },
  methods: {
    likeAvaliation(stts) {
      this.liked = stts;
    },
    modalConfirmShipping(id_salesman, id_order_product, name) {
      this.name = name;
      this.confirmationData = { id_salesman, id_order_product };
      this.openConfirmShipping = true;
    },
    async confirmShipping(){
      this.buttonLoading = true;
      const result = await Order.confirmShipping(this.confirmationData.id_salesman, this.confirmationData.id_order_product);
      //console.log(result);
      if(result.success) {
        this.setMessage('Sucesso!', 'success', 'Envio confirmado!', 3000);
        let id = this.confirmationData.id_order_product;
        this.order.products = this.order.products.map(item => {
          if(item.id_order_product == id) item.status = 'E';
          return item;
        })
      }
      else this.setMessage('Erro!', 'error', result.message, 3000);

      this.buttonLoading = false;
      this.openConfirmShipping = false;
    },
    setMessage(title, type, message, miliseconds) {
      this.message = message;
      this.type = type;
      this.title = title;
      setTimeout(() => {
        this.type = "none";
      }, miliseconds);
    },
  },
  async created() {
    if(this.$store.state.user.user.type != 'V') return this.$router.push('/');
    const order = await Order.getOrderById(this.$route.params.id);
    if (!order.success) return this.$router.push("/suas-compras");

    this.order = order.order;
    //console.log(order);
    this.loading = false;
  },
};
</script>