<template>
  <div class="bg-white p-6 rounded-lg mt-4 mb-10">
    <div class="md:flex">
      <div class="md:w-1/2 text-base lg:text-lg text-gray-700">
        <p class="my-2">Valor total: <b>R$ {{(order.order_total+order.tax_total).toLocaleString('pt-br', {minimumFractionDigits: 2})}}</b></p>
        <p class="my-2">Método de pagamento: {{order.method == 'B' ? 'Boleto' : 'Cartão de Crédito'}}</p>
        <p class="my-2">
          Status do Pagamento:
          <span
          v-if="order.current_status == 'paid'"
            class="
              bg-green-600
              text-white text-sm
              lg:text-base
              p-2
              rounded-full
            "
            >Aprovado</span
          >
          
          <span
            v-else-if="order.current_status == 'waiting_payment' || order.current_status == null"
            class="
              bg-yellow-600
              text-white text-sm
              lg:text-base
              p-2
              rounded-full
            "
            >Aguardando</span
          >
          <span
            v-else
            class="bg-red-800 text-white text-sm lg:text-base p-2 rounded-full"
            >Reprovado</span
          >
        </p>
        <p class="my-2">Comprado em: {{new Date(order.created_at).toLocaleString().substr(0,10)}}</p>
        <p class="my-2">Última Atualização em: {{new Date(order.updated_at).toLocaleString().substr(0,10)}}</p>
        <p v-if="order.method == 'B' && order.current_status != 'paid' && order.boleto_url != null" class="my-2">Boleto: {{order.boleto_barcode}}</p>
        <button type="button" v-if="order.method == 'B' && order.current_status != 'paid' && order.boleto_url != null" @click="openBoleto" class="my-2 text-red-800">Imprimir Boleto</button>
        <p v-else-if="order.boleto_url != null && !order.current_status">Aguarde, estamos gerando o seu boleto...</p>
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
export default {
  props: {
    address: Object,
    order: Object,
  },
  methods: {
    openBoleto(){
      window.open(this.order.boleto_url, '_blank');
    }
  }
};
</script>