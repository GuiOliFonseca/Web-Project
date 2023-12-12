<template>
  <div class="bg-gray-900 mt-12 p-6 rounded-lg">
    <div class="flex-none md:flex">
      <div class="w-full md:w-3/5">
        <p class="font-semibold text-2xl md:text-3xl text-white">Total:</p>
      </div>
      <div class="w-full md:w-2/5 text-right text-gray-600">
        <p class="text-white">R$ <span class="text-2xl md:text-3xl">{{total}}</span></p>
        <p>à vista no boleto ou em até 12x.</p>
        <p>taxas são aplicáveis.</p>
      </div>
    </div>
    <div v-if="showButton && $store.state.login.login.isLogged" class="w-full mt-12">
      <button
        type="button"
        @click="pagamento()"
        class="w-full transition duration-150 py-2 px-4 bg-red-800 hover:bg-red-900 text-white font-bold border-b-4 border-red-900 focus:outline-none rounded"
      >
        Finalizar Compra    
      </button>
    </div>
    <div class="text-gray-300 text-xl text-center mt-5" v-if="!$store.state.login.login.isLogged">Faça login para conseguir comprar!</div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
  props: {
    product: Object,
    showButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      juros: false,
      total: 0,
      items: Array,
      loading: true,
    };
  },
  methods: {
    ...mapMutations(["setItems"]),
    ...mapActions([
      "removeItems",
      "getItems"
    ]),
    pagamento(){
      this.$router.push('/pagamento')
    },
    async loadPrice() {
      this.total = 0;
      for (let item of this.items) {
        this.total +=
          parseInt(item.cart_quantity) * parseFloat(item.price_total - (item.discount * item.price_total / item.price));
      }
      this.total = this.total.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    },
  },
  watch: {
    "$store.state.cart.cart"(newItem) {
      this.items = this.$store.state.cart.cart;
      this.items ? this.loadPrice() : undefined;
    },
  },
  async created() {
    this.items = await this.getItems();
    this.items ? this.loadPrice() : undefined;
  },
  computed: {
    parcels(value){
      return parseFloat(value);
    }
  }
};
</script>
