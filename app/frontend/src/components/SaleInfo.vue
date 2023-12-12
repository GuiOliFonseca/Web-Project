<template>
  <div class="bg-white p-6 rounded-lg mt-4 mb-10">
    <div v-if="!loading" class="md:flex">
      <div class="md:w-1/2 text-base lg:text-lg text-gray-700">
      <p class="my-2">Valor total: <b>R$ {{(order.order_total).toFixed(2).toLocaleString('pt-br', {minimumFractionDigits: 2})}}</b></p>
        <p class="my-2">Você recebe: <b>R$ {{total.toFixed(2).toLocaleString('pt-br', {minimumFractionDigits: 2})}}</b></p>
        <p class="my-2">Método de pagamento: 
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
        <p class="my-2">Comprado em: {{new Date(order.created_at).toLocaleString().substr(0,10)}}</p>
        <p class="my-2">Última Atualização em: {{new Date(order.updated_at).toLocaleString().substr(0,10)}}</p>
      </div>
      <hr class="md:display-none my-4 md:my-0" />
      <div class="md:w-1/2 text-gray-700 text-base lg:text-lg">
        <h2 class="text-xl mb-4">Detalhes do Endereço</h2>
        <h3 class="">{{order.alias}}</h3>
        <p>{{order.street}}, {{order.num}}</p>
        <p>{{order.neigh}}</p>
        <p>{{order.city}}, {{order.state}}</p>
        <p>{{order.zipcode}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Config from '../../config';
export default {
  props: {
    address: Object,
    order: Object,
  },
  data(){
    return {
      loading: true,
      fee: undefined,
      total: 0
    }
  },
  created(){
    
      for(const prod of this.order.products){
        //console.log(prod.tax)
        this.total += (prod.price_total * (1 - prod.tax)) * prod.quantity;
      }
      this.loading = false;
    }
};
</script>