<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-grow px-6 pt-8 pb-2">
      <template v-if="!loading">
        <Slider v-if="!loading" type="B" :data="banners" />
        <Label title="Destaques" :type="1" />
        <template v-for="item in items" :key="item.id">
          <Label class="capitalize" :title="item.name" :type="2" />
          <Slider type="P" :data="item.products" />
        </template>
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
    <Footer />
  </div>
</template>

<script>
import Label from "../components/Label.vue";
import Slider from "../components/Slider.vue";
import SliderLoad from "../components/SliderLoad.vue";
import Footer from "../components/Footer.vue";

import ProductGrid from "../components/ProductGrid.vue";
import ProductGridLoad from "../components/ProductGridLoad.vue";
import Pagination from "../components/Pagination.vue";

import Product from "../services/Product";
import Material from "../services/Material";
import Banner from "../services/Banner";

export default {
  data() {
    return {
      items: [],
      loading: true,
      mostDiscount: {},
      banners: [],

      products: [],
      pagination: {},
      loadingAll: true,
      empty: true,
    };
  },
  components: {
    Slider,
    Label,
    Footer,
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

    let materials = await Material.getMostedUsed();
    materials = materials.material || [];

    let selecteds = [];

    for (let i = 0; i < 4 && materials.length > i; i++) {
      selecteds[i] = materials[i];
      const products = await Product.getProductByMaterial(
        selecteds[i].id_material
      );
      selecteds[i].products = products.success ? products.product.data : [];
    }
    this.items = selecteds;

    let mostDiscount = await Product.getProductMostDiscount();
    mostDiscount = mostDiscount.success
      ? { products: mostDiscount.product.data }
      : { products: [] };
    mostDiscount.name = "Os melhores descontos";
    this.mostDiscount = mostDiscount;

    const banners = await Banner.getAll();
    if (banners.success) this.banners = banners.banners;

    this.loading = false;
  },
};
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}
</style>
