<template>
  <div id="top" class="min-h-screen flex flex-col">
    <div class="flex-grow px-6 pt-8 pb-2">
      <h1 class="text-2xl lg:text-5xl leading-none mb-10 text-gray-800">
        Seus anúncios
      </h1>
      <div v-if="!loading" class="flex-grow">
        <template v-for="product in products" :key="product.id">
          <ProductItem v-on:reload="reload()" :product="product" />
        </template>
      </div>
      <div v-else class="flex-grow">
        <OrderItemLoad />
        <OrderItemLoad />
        <OrderItemLoad />
        <OrderItemLoad />
        <OrderItemLoad />
        <OrderItemLoad />
      </div>
    </div>

    <Pagination
      v-if="products.length && !loading"
      v-on:go-to-page="goToPage"
      :curPage="parseInt(pagination.currentPage)"
      :numPages="pagination.lastPage"
    />
    <Footer />
  </div>
</template>

<script>
import OrderItemLoad from "../components/OrderItemLoad.vue";
import Footer from "../components/Footer.vue";
import Pagination from "../components/Pagination.vue";
import ProductItem from "../components/ProductItem.vue";

import Product from "../services/Product";
import Salesman from "../services/Salesman";
export default {
  components: {
    OrderItemLoad,
    Footer,
    Pagination,
    ProductItem,
  },
  data() {
    return {
      products: [],
      pagination: {},

      loading: true,

      title: "",
      tipy: "none",
      message: "",
    };
  },
  async mounted(){
    await this.backToTop()
  },
  async created() {
    if (
      this.$store.state.user.user.type != "V" ||
      !this.$store.state.login.login.isLogged
    )
      return this.$router.push("/");

    const products = await Salesman.getSalesmanOwnProducts(
      this.$store.state.user.user.id_salesman,
      1
    );
    if (!products.success) return this.$router.push("/");
    //console.log(products);
    this.products = products.product.data;
    this.pagination = products.product.pagination;
    //console.log(this.pagination);
    this.loading = false;
  },
  methods: {
    async goToPage(event, page) {
      await this.backToTop();
      this.loading = true;

      const products = await Salesman.getSalesmanOwnProducts(
        this.$store.state.user.user.id_salesman,
        page
      );
      if (products.success) {
        this.products = products.product.data;
        this.pagination = products.product.pagination;

        this.loading = false;
      }
    },
    async reload(){
      this.loading = true;

      const products = await Salesman.getSalesmanOwnProducts(
        this.$store.state.user.user.id_salesman,
        this.pagination.currentPage
      );
      if (products.success) {
        this.products = products.product.data;
        this.pagination = products.product.pagination;

        this.loading = false;
      }
    },
    async backToTop() {
      await this.$smoothScroll({
        scrollTo: document.getElementById("top"),
        duration: 0,
      });
      this.$router.go(-1)
    },
  },
};
</script>

<style>
</style>