<template>
  <div id="top" class="min-h-screen flex flex-col">
    <div class="flex-grow px-6 pt-8 pb-2">
      <ProductDetailsLoading v-if="loading" />
      <ProductDetails
        v-else
        :stock="inStock"
        :product="product"
        :salesman="salesman"
      />
      <Avaliation :avaliations="avaliations" v-if="!loading" />
      <Pagination
        v-if="!loading && avaliations.length"
        :curPage="parseInt(pagination.currentPage)"
        v-on:go-to-page="goToPage"
        :numPages="pagination.lastPage"
      />
      <Chat
        :salesman="salesman"
        v-if="!loading && $store.state.user.user.type != 'V'"
      />
    </div>
    <Footer />
  </div>
</template>

<script>
import ProductDetails from "../components/ProductDetails.vue";
import Avaliation from "../components/ProductAvaliation.vue";
import ProductDetailsLoading from "../components/ProductDetailsLoading.vue";
import ProductAvaliation from "../services/ProductAvaliation";
import Footer from "../components/Footer.vue";
import Product from "../services/Product";
import Salesman from "../services/Salesman";
import Chat from "../components/Chat.vue";
import Pagination from "../components/Pagination.vue";

export default {
  components: {
    ProductDetailsLoading,
    Avaliation,
    ProductAvaliation,
    ProductDetails,
    Footer,
    Chat,
    Pagination
  },
  data() {
    return {
      product: Object,
      salesman: Object,
      loading: true,
      inStock: true,
      avaliations: Array,
      pagination: Object,
    };
  },
  async mounted(){
    await this.backToTop()
  },
  async created() {
    const id_product = this.$route.params.id_product;
    const product = await Product.getProductById(id_product);
    product.success ? (this.product = product.product) : this.$router.push("/");
    if (
      product.product.quantity <= 0 ||
      !product.product.is_active ||
      product.product.is_deleted
    )
      this.inStock = false;

    const salesman = await Salesman.getSalesmanById(this.product.id_salesman);
    salesman.success
      ? (this.salesman = salesman.salesman)
      : this.$router.push("/");

    const productAvaliation = await ProductAvaliation.getProductAvaliations(
      id_product
    );
    if (productAvaliation.success) {
      this.avaliations = productAvaliation.avaliation.data;
      this.pagination = productAvaliation.avaliation.pagination;
    } else {
      this.avaliations = [];
    }

    const a = this.$socket.client.emit("visit", product.product.id);

    //console.log(product);
    this.backToTop();
    this.loading = false;
  },
  methods: {
    async backToTop() {
      await this.$smoothScroll({
        scrollTo: document.getElementById("top"),
        duration: 0,
      });
      this.$router.go(-1)
    },
    async goToPage(event, page) {
      await this.getProductAvaliation(page);
    }, 
    async getProductAvaliation(page) {
      this.loading = true;
      const avaliations = await ProductAvaliation.getProductAvaliations(
        this.product.id_product,
        page || 1
      );
      if (avaliations.success) {
        this.backToTop();
        this.avaliations = avaliations.avaliations.data;
        this.pagination = avaliations.avaliations.pagination;
        this.loading = false;
      } else this.setMessage("Erro!", avaliations.message, "error", 3000);
    },
  },
};
</script>
