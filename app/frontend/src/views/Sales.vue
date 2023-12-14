<template>
  <div id="top" class="min-h-screen flex flex-col">
    <div class="flex-grow px-6 pt-8 pb-2">
      <h1 class="text-2xl lg:text-5xl leading-none mb-10 text-gray-800">
        Suas Vendas
      </h1>
      <div v-if="!loading" class="flex-grow">
        <template v-for="item in items" :key="item.id">
          <SaleItem :order="item" />
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
      <div v-if="!items.length" class="my-16 text-center text-gray-500">
        <span class="text-3xl md:text-4xl lg:text-6xl"
          ><i class="fas fa-truck-loading"></i
        ></span>
        <p>Você ainda não tem nenhuma compra!</p>
      </div>
    </div>

    <Pagination
      v-if="items.length && !loading"
      v-on:go-to-page="goToPage"
      :curPage="parseInt(pagination.currentPage)"
      :numPages="pagination.lastPage"
    />
  </div>
</template>

<script>
import SaleItem from "../components/SaleItem.vue";
import OrderItemLoad from "../components/OrderItemLoad.vue";
import Pagination from "../components/Pagination.vue";
import Order from "../services/Order";

export default {
  components: {
    Pagination,
    SaleItem,
    OrderItemLoad,
  },
  data() {
    return {
      items: [],
      pagination: {},
      images: [],

      loading: true,
    };
  },
  async mounted(){
    await this.backToTop()
  },
  async created() {
    if (
      !this.$store.state.login.login.isLogged ||
      this.$store.state.user.user.type != "V"
    )
      return this.$router.push("/login");
    const orders = await Order.getAllSalesmanOrder(
      this.$store.state.user.user.id_salesman, 1);

    if (orders.success) {
      this.items = orders.order.data;
      this.pagination = orders.order.pagination;
      let index = 0;
      orders.order.data.map((order) => {
        let images = [];
        order.products.map((product) => {
          images.push(product.url_image);
        });
        this.images[index] = images;
        index++;
      });
      this.loading = false;
    } else {
      this.items = [];
      this.images = [];
      this.loading = false;
    }
  },
  methods: {
    async goToPage(event, page) {
      await this.backToTop();
      this.loading = true;

      const orders = await Order.getAllClientOrder(
        this.$store.state.user.user.id_salesman,
        page,
        "R"
      );
      if (orders.success) {
        this.items = orders.order.data;
        this.pagination = orders.order.pagination;

        let index = 0;
        orders.order.data.map((order) => {
          let images = [];
          order.products.map((product) => {
            images.push(product.url_image);
          });
          this.images[index] = images;
          index++;
        });
        this.loading = false;
      }
    },
    async backToTop() {
      await this.$smoothScroll({
        scrollTo: document.getElementById("top"),
        duration: 0,
      });
      this.$router.go(-1);
    },
  },
};
</script>
