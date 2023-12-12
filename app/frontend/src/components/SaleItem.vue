<template>
  <div class="w-full my-1 px-1">
    <router-link :to="`/suas-vendas/detalhes/${order.id}`">
      <div class="w-full rounded-lg bg-white overflow-hidden shadow-sm mt-6">
        <div class="flex justify-start items-center p-3">
          <div class="text-5xl text-red-800">
            <i class="fas fa-money-check-alt"></i>
          </div>
          <div class="w-full md:flex p-4 text-left text-gray-700">
            <div class="md:w-9/12 md:text-xl text-lg">
              <p>
                <b>Data: </b><span class="text-gray-700">{{ data }}</span>
              </p>
              <p>
                <b>Método: </b
                > <span v-if="order.method == 'B'" class="text-gray-700">
                  Boleto
                </span>
                <span v-if="order.method == 'P'" class="text-gray-700">
                  PIX
                </span>
                <span v-if="order.method == 'C'" class="text-gray-700">
                  Cartão de Crédito
                </span>
              </p>
            </div>
            <div
              class="md:w-3/12 md:text-right md:text-xl text-lg content-center"
            >
              <p>
                <b>Valor: </b
                ><span class="text-gray-800 text-2xl"
                  >R${{(order_total).toLocaleString('pt-br', {minimumFractionDigits: 2})}}</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import Config from '../../config';
export default {
  props: {
    order: Object,
  },
  data(){
    return {
      fee: Config.config.fee
    }
  },
  created(){
    //console.log(this.order)
  },
  computed: {
    data() {
      return new Date(this.order.created_at).toLocaleString().substr(0, 10);
    },
    order_total(){
      let total = 0;
      this.order.products.map(prod => {
        //TODO: Calculo do desconto esta errado!
        total += prod.price_total * prod.quantity;
      })
      return total.toFixed(2);
    }
  },
};
</script>
