<template>
  <div class="w-full my-1 px-1">
    <MessageCardFixed :message="message" :title="title" :type="type" />
    <div class="w-full rounded-lg bg-white overflow-hidden shadow-sm mt-6">
      <div class="flex justify-start">
        <img
          class="h-40 w-3/12 xl:w-2/12 object-cover cursor-pointer"
          :src="product.url_image"
          alt="img"
        />
        <div class="px-6 py-4 text-left w-9/12">
          <div class="mt-3 mb-0 pb-0 font-semibold capitalize">{{product.title}}</div>
          <small class="mt-0">Tipo {{quality}}</small>
          <div class="mt-2">
            <small v-if="product.discount" style="text-decoration: line-through" class="block ">R$ {{(product.price_total).toLocaleString('pt-br', {minimumFractionDigits: 2})}}</small>
            R$<span class="text-3xl mt-2 pt-2">{{ ((product.price_total - (product.discount * product.price_total / product.price))).toLocaleString('pt-br', {minimumFractionDigits: 2})}}</span> <small>{{product.cart_quantity}} unidade(s)</small>
          </div>
          <br/>
            <div class="float-left pt-0 mt-0 text-gray-500 text-sm transition duration-300 hover:text-red-800 uppercase font-semibold tracking-wide"
            ><i class="fas fa-store"></i> {{ product.business_name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MessageCardFixed from "../components/MessageCardFixed.vue";

export default {
  props: {
    product: Object,
  },
  data() {
    return {
      quantity: undefined,
      type: "none",
      title: "",
      message: "",
    };
  },
  methods: {
    setMessage(title, type, message, miliseconds) {
      this.message = message;
      this.type = type;
      this.title = title;
      setTimeout(() => {
        this.type = "none";
      }, miliseconds);
    },
  },
  components: {
    MessageCardFixed,
  },
  created(){
    //console.log(this.product)
  },
  computed: {
    quality(){
      const literal = {
        '1': 'A',
        '2': 'B',
        '3': 'C',
        '4': 'E'
      }
      return literal[this.product.quality];
    }
  }
};
</script>

<style scoped>
  .capitalize {
    text-transform: capitalize;
  }
</style>