<template>
  <div class="min-h-screen flex flex-col">
    <MessageCardFixed :type="type" :message="message" :title="title"/>
    <!-- Modal de Avaliação de Produto -->
    <div
      :class="`modal ${
        !openAvaliationProduct && 'opacity-0 pointer-events-none'
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
            <p class="text-2xl font-bold text-red-800">Avaliação de Produto</p>
            <div
              class="modal-close cursor-pointer z-50"
              @click="openAvaliationProduct = false"
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
          <form @submit.prevent="productAvaliation()">
            <div>
              <p class="text-gray-800">Como você avalia {{name}}?</p>
              <div class="flex space-x-4 justify-center my-10">
                <button
                  type="button"
                  :class="{ 'bg-red-700': liked == 'L' }"
                  class="bg-gray-600 hover:bg-red-700 text-white p-2 rounded-md"
                  @click="likeAvaliation('L')"
                >
                  <span class="text-lg mr-2"
                    ><i class="fas fa-thumbs-up"></i></span
                  >Gostei
                </button>
                <button
                  type="button"
                  :class="{ 'bg-red-700': liked == 'D' }"
                  class="bg-gray-600 hover:bg-red-700 text-white p-2 rounded-md"
                  @click="likeAvaliation('D')"
                >
                  <span class="text-lg mr-2"
                    ><i class="fas fa-thumbs-down"></i></span
                  >Não gostei
                </button>
              </div>
              <textarea
                v-model="avaliation"
                rows="5"
                placeholder="Deixe sua mensagem sobre o produto"
                class="
                  w-full
                  border
                  rounded
                  text-gray-800
                  focus:border-red-800
                  focus:outline-none
                  py-2
                  px-4
                "
              >
              </textarea>
            </div>
            <!--Footer-->
            <div class="flex justify-end pt-2">
              <button
                @click="openAvaliationProduct = false"
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
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Avaliação de Vendedor -->
    <div
      :class="`modal ${
        !openAvaliationSalesman && 'opacity-0 pointer-events-none'
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
            <p class="text-2xl font-bold text-red-800">Avaliação de Vendedor</p>
            <div
              class="modal-close cursor-pointer z-50"
              @click="openAvaliationSalesman = false"
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
          <form @submit.prevent="salesmanAvaliation()">
            <div>
              <p class="text-gray-800">Como você avalia {{name}}?</p>
              <div class="flex space-x-4 justify-center my-10">
                <button
                  type="button"
                  :class="{ 'bg-red-700': liked == 'L' }"
                  class="bg-gray-600 hover:bg-red-700 text-white p-2 rounded-md"
                  @click="likeAvaliation('L')"
                >
                  <span class="text-lg mr-2"
                    ><i class="fas fa-thumbs-up"></i></span
                  >Gostei
                </button>
                <button
                  type="button"
                  :class="{ 'bg-red-700': liked == 'D' }"
                  class="bg-gray-600 hover:bg-red-700 text-white p-2 rounded-md"
                  @click="likeAvaliation('D')"
                >
                  <span class="text-lg mr-2"
                    ><i class="fas fa-thumbs-down"></i></span
                  >Não gostei
                </button>
              </div>
              <textarea
                v-model="avaliation"
                placeholder="Deixe sua mensagem sobre o vendedor"
                rows="5"
                class="
                  w-full
                  border
                  rounded
                  text-gray-800
                  focus:border-red-800
                  focus:outline-none
                  py-2
                  px-4
                "
              >
              </textarea>
            </div>
            <!--Footer-->
            <div class="flex justify-end pt-2">
              <button
                @click="openAvaliationSalesman = false"
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
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

     <!-- Modal Confirmação de Envio -->
    <div
      :class="`modal ${
        !openConfirmDelivery && 'opacity-0 pointer-events-none'
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
            <p class="text-2xl font-bold text-red-800">Confirmar Recebimento</p>
            <div
              class="modal-close cursor-pointer z-50"
              @click="openConfirmDelivery = false"
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
          <form @submit.prevent="confirmDelivery()">
            <p class="text-center text-5xl text-red-800">
              <i class="fas fa-radiation fa-spin"></i>
            </p>
            <p class="my-4">Tem certeza que deseja confirmar o recebimento de {{name}}?</p>

            <!--Footer-->
            <div class="flex justify-end pt-2">
              <button
                @click="openConfirmDelivery = false"
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
        <OrderInfo v-if="!loading" :order="order" />
        <h3 class="text-xl md:text-3xl text-gray-800">Produtos desta Compra</h3>

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
                      R$ {{ parseFloat(((product.price - product.discount) * product.width * product.height).toFixed(2)).toLocaleString('pt-br', {minimumFractionDigits: 2}) }}
                    </p>
                    <p class="text-sm md:text-base text-gray-600">
                      Quantidade: {{ product.quantity }}
                    </p>

                    <router-link
                      :to="`/loja/${product.id_salesman}`"
                      class="
                        text-gray-500 text-sm
                        transition
                        duration-300
                        hover:text-red-800
                        uppercase
                        font-semibold
                        tracking-wide
                        my-2
                      "
                    >
                      <i class="fas fa-store"></i> {{ product.business_name }}
                    </router-link>
                  </div>
                  <hr class="md:display-none border-gray-500 my-4" />
                  <template
                    v-if="
                      product.status === 'R' && order.current_status == 'paid'
                    "
                    class="w-full md:w-3/12 md:text-center my-auto"
                  >
                    <p
                      class="cursor-pointer text-red-800 hover:text-gray-600"
                      @click="modalAvaliationSalesman(product.id_salesman, product.id_order_product, product.business_name)"
                    >
                      Avaliar Vendedor
                    </p>
                    <p
                      class="cursor-pointer text-red-800 hover:text-gray-600"
                      @click="modalAvaliationProduct(product.id_order_product, product.title)"
                    >
                      Avaliar Produto
                    </p>
                  </template>
                    <p
                      v-if="product.status == 'E'"
                      class="cursor-pointer text-red-800 hover:text-gray-600"
                      @click="modalConfirmDelivery(product.id_salesman, product.id_order_product, product.title)"
                    >
                      Confirmar Recebimento
                    </p>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="loading">
          <PaymentItemLoad />
          <PaymentItemLoad />
          <PaymentItemLoad />
          <PaymentItemLoad />
          <PaymentItemLoad />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import OrderInfo from "../components/OrderInfo.vue";
import MessageCardFixed from "../components/MessageCardFixed.vue";

import ProductAvaliation from "../services/ProductAvaliation";
import Order from "../services/Order";
export default {
  data() {
    return {
      liked: 'L',
      avaliation: undefined,
      openAvaliationProduct: false,

      order: {},
      loading: true,

      avaliationData: {}, 

      type: 'none',
      message: '',
      title: '',

      name: '',

      buttonLoading: false
    };
  },
  components: {
    OrderInfo,
    MessageCardFixed
  },
  methods: {
    likeAvaliation(stts) {
      this.liked = stts;
    },
    modalAvaliationProduct(id_order_product, name) {
      this.name = name;
      this.avaliationData = {id_order_product};
      this.openAvaliationProduct = true;
    },
    async productAvaliation() {
      this.buttonLoading = true;
      let data = {
        liked: this.liked,
        comment: this.avaliation,
        ...this.avaliationData,
        id_order: this.order.id
      };
      const result = await ProductAvaliation.create(data);
      if(result.success) {
        this.setMessage('Sucesso!', 'success', 'Avaliação Cadastrada!', 3000);
      } else {
        this.setMessage('Erro!', 'error', result.message, 3000);
      }
      this.buttonLoading = false;
      this.openAvaliationProduct = false;
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
    if(this.$store.state.user.user.type != 'C') return this.$router.push('/');
    const order = await Order.getOrderById(this.$route.params.id);
    if (!order.success) return this.$router.push("/suas-compras");

    //console.log(order)

    this.order = order.order;
    this.loading = false;
  },
};
</script>