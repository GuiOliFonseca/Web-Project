<template>
  <div class="min-h-screen flex flex-col">
    <MessageCardFixed :type="type" :message="message" :title="title"/>

    <div class="flex-grow px-6 pt-8 pb-2">
      <h3 class="text-gray-700 text-3xl font-medium">Painel de Controle</h3>

      <div class="mt-4">
        <div class="flex flex-wrap -mx-6">
          <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
            <div
              class="flex items-center px-5 py-6 rounded-lg bg-white shadow-md transform transition duration-500 hover:scale-105"
            >
              <div class="rounded-full text-red-800">
                <span class="text-5xl"><i class="fas fa-thumbs-up"></i></span>
              </div>

              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">{{sumAvaliation || 0}}</h4>
                <div class="text-gray-500">Total de Avaliações</div>
              </div>
            </div>
          </div>

          <div class="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
            <div
              class="flex items-center px-5 py-6 rounded-lg bg-white shadow-md transform transition duration-500 hover:scale-105"
            >
              <div class="rounded-full text-red-800">
                <span class="text-5xl"
                  ><i class="fas fa-shopping-cart"></i
                ></span>
              </div>

              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">{{solds || 0}}</h4>
                <div class="text-gray-500">Total de Produtos Vendidos</div>
              </div>
            </div>
          </div>

          <div class="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
            <div
              class="flex items-center px-5 py-6 rounded-lg bg-white shadow-md transform transition duration-500 hover:scale-105"
            >
              <div class="rounded-full text-red-800">
                <span class="text-5xl"><i class="fas fa-box-open"></i></span>
              </div>

              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">{{productAvaliable || 0}}</h4>
                <div class="text-gray-500">Produtos disponíveis</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <h3 class="text-gray-700 text-3xl font-medium">Estatísticas Gerais</h3>
        <div class="lg:flex lg:space-x-4 mt-8">

          <div class="w-full lg:w-1/2 bg-white p-4 rounded-lg">
            <h4 class="text-xl font-semibold text-gray-700">Compras Mensalmente</h4>
            <hr class="my-2">
            <NewOrders v-if="!loading" :type="'M'" :data="ordersAtMonth"/>
          </div>

          <div class="w-full lg:w-1/2 mt-4 lg:mt-0 bg-white p-4 rounded-lg">
            <h4 class="text-xl font-semibold text-gray-700">Compras Anualmente</h4>
            <hr class="my-2">
            <NewOrders v-if="!loading" :type="'Y'" :data="ordersAtYear"/>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import UserTypes from "../components/charts/UserTypes.vue";
import NewUsersMonthly from "../components/charts/NewUsersMonthly.vue";
import NewOrders from "../components/charts/NewOrders.vue";
import Footer from "../components/Footer.vue";
import MessageCardFixed from "../components/MessageCardFixed.vue";

import Statistics from "../services/Statistics";
import Banner from "../services/Banner";
export default {
  components: {
    UserTypes,
    NewUsersMonthly,
    NewOrders,
    Footer,
    MessageCardFixed
  },

  data() {
    return{
      loading: true,
      openModalAddBanner: false,
      openModalAlterBanner: false,
      openModalDeleteBanner: false,

      totalAvaliations: undefined,
      totalSales: undefined,
      productsDisponible: undefined,
      userType: [],
      newUser: [],
      ordersAtMonth: [],
      ordersAtYear: [],
      productAvaliable: undefined,
      salesmanAvaliation: [],
      productAvaliation: [],
      solds: undefined,

      banners: [],
      link: '',
      image: undefined,
      id_banner: undefined,

      type: 'none',
      message: '',
      title: ''
    };
  },
  computed: {
    sumAvaliation(){
      let count = 0;
      for(let i of this.productAvaliation){
        count += i.count;
      }
      for(let i of this.salesmanAvaliation){
        count += i.count;
      }

      return count;
    }
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
  async created(){
    if(this.$store.state.user.user.type != 'V') return this.$router.push('/');
    const id = this.$store.state.user.user.id_salesman;

    const productAvaliable = await Statistics.getProductAvailable(id);
    const salesmanAvaliations = await Statistics.getCountSalesmanAvaliation(id);
    const productAvaliation = await Statistics.getCountProductAvaliation(id);
    const sales = await Statistics.getCountSalesSalesman(id);

    const monthly = await Statistics.getOrderMonthly(id);
    const yearly = await Statistics.getOrderYearly(id);

    if(productAvaliable.success)
      this.productAvaliable = productAvaliable.numProducts;
    if(sales.success)
      this.solds = sales.amountProduct;
    if(salesmanAvaliations.success)
      this.salesmanAvaliation = salesmanAvaliations.relation;
    if(productAvaliation.success)
      this.productAvaliation = productAvaliation.relation;
    if(monthly.success)
      this.ordersAtMonth = monthly.order
    if(yearly.success)
      this.ordersAtYear = yearly.order
    this.loading = false
  }
};
</script>