<template>
  <div class="w-full my-1 px-1">
    <router-link :to="`/suas-compras/detalhes/${order.id}`">
      <div class="w-full rounded-lg bg-white overflow-hidden shadow-sm mt-6">
        <div class="flex justify-start">
          <img
            class="h-40 w-3/12 xl:w-2/12 object-cover cursor-pointer"
            @mouseover="carrouselImg"
            @mouseout="carrouselImgStop"
            :src="imageNow"
            alt="img"
            :key="index"
          />
          <div class="w-full md:flex p-4 text-left text-gray-700">
            <div class="md:w-9/12 md:text-xl text-lg">
              <p>
                <b>Data: </b
                ><span class="text-gray-700">{{ data }}</span>
              </p>
              <p>
                <b>Método: </b
                >
                <span v-if="order.method == 'B'" class="text-gray-700">
                  Boleto
                </span>
                <span v-if="order.method == 'P'" class="text-gray-700">
                  PIX
                </span>
                <span v-if="order.method == 'C'" class="text-gray-700">
                  Cartão de Crédito
                </span>
              </p>
              <p>
                <!-- Aqui variar de acordo com o status da compra (Vermelho Amarelo e Verde)-->
                <b>Situação da compra: </b>
                <span
                  v-if="order.current_status == null"
                  class="text-yellow-600"
                  >Processando pedido...</span
                >
                <span v-else-if="order.current_status == 'paid'" class="text-green-600"
                  >Aprovado</span
                >
                <span v-else-if="order.current_status == 'refused'" class="text-red-800">Rejeitado</span>
                <span v-else-if="order.current_status == 'waiting_payment'" class="text-yellow-600">Aguardando Pagamento</span>
              </p>
            </div>
            <div
              class="md:w-3/12 md:text-right md:text-xl text-lg content-center"
            >
              <p>
                <b>Valor: </b><span class="text-gray-800 text-2xl">R$ {{(order.order_total + order.tax_total).toLocaleString('pt-br', {minimumFractionDigits: 2})}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    order: Object,
    productImages: Array,
  },
  data() {
    return {
      imageNow: null,
      alterImage: null,
      index: 0,
    };
  },
  created: function () {
    this.imageNow = this.productImages[0];
  },
  computed: {
    data(){
      return new Date(this.order.created_at).toLocaleString().substr(0,10);
    }
  },
  methods: {
    carrouselImg() {
      if (!this.alterImage) {
        this.alterImage = setInterval(() => {
          if (this.index < this.productImages.length - 1) {
            this.index++;
            this.imageNow = this.productImages[this.index];
          } else {
            this.index = 0;
            this.imageNow = this.productImages[0];
          }
        }, 1500);
      }
    },
    carrouselImgStop() {
      if (this.alterImage) {
        clearInterval(this.alterImage);
        this.alterImage = null;
      }
    },
  },
};
</script>
