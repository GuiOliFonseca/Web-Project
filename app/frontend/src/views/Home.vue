<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-grow px-6 pt-8 pb-2">
      <template v-if="!loading">
        <div id="top" class="flex-grow px-6 pt-8 pb-2">
          <Label title="Catálogo de Produtos" :type="2" />
          <ProductGrid v-if="!empty && !loadingAll" :data="products" />
          <div v-if="empty" class="my-16 text-center text-gray-500">
            <span class="text-3xl md:text-4xl lg:text-6xl"
              ><i class="fas fa-search"></i
            ></span>
            <p>Ops! Não há produtos cadastrados...</p>
          </div>
          <ProductGridLoad v-if="loadingAll" :isGrid="true" />
        </div>
        <Pagination
          v-if="!empty"
          v-on:go-to-page="goToPage"
          :curPage="parseInt(pagination.currentPage)"
          :numPages="pagination.lastPage"
        />
      </template>
      <template v-else>
        <SliderLoad />
        <SliderLoad />
        <SliderLoad />
        <SliderLoad />
        <SliderLoad />
        <ProductGridLoad v-if="loadingAll" :isGrid="true" />
      </template>
    </div>
  </div>
</template>

<script>
import Label from "../components/Label.vue";
import Slider from "../components/Slider.vue";
import SliderLoad from "../components/SliderLoad.vue";

import ProductGrid from "../components/ProductGrid.vue";
import ProductGridLoad from "../components/ProductGridLoad.vue";
import Pagination from "../components/Pagination.vue";

import Product from "../services/Product";
import Category from "../services/Category";

export default {
  data() {
    return {
      items: [],
      loading: true,

      products: [],
      pagination: {},
      loadingAll: true,
      empty: true,
    };
  },
  components: {
    Slider,
    Label,
    SliderLoad,
    ProductGrid,
    ProductGridLoad,
    Pagination,
  },
  methods: {
    async goToPage(event, page = 0) {
      this.loadingAll = true;
      const result = await Product.getAll(page);

      if (result.success) {
        this.products = result.product.data;
        this.pagination = result.product.pagination;

        this.empty = false;
      } else {
        this.empty = true;
      }
      this.loadingAll = false;
    },
  },
  async created() {
    await this.goToPage();

    let categories = await Category.getMostedUsed();
    categories = categories.category || [];

    let selecteds = [];

    for (let i = 0; i < 4 && categories.length > i; i++) {
      selecteds[i] = categories[i];
      const products = await Product.getProductByCategory(
        selecteds[i].id_category
      );
      selecteds[i].products = products.success ? products.product.data : [];
    }
    this.items = selecteds;

    this.loading = false;
  },
};
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}
</style>