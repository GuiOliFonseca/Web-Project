<template>
  <div class="flex flex-col">
    <div class="flex-grow">
      <div class="flex-none lg:flex bg-gray-900 rounded-lg">
        <MessageCardFixed :message="message" :title="title" :type="type" />
        <div class="my-auto w-full lg:w-1/2 xl:w-2/3 xl:pl-6">
          <!-- Imagem -->
          <Carousel :wrap-around="false" :items-to-show="1">
            <template v-if="product.images.length">
              <Slide v-for="img in product.images" :key="img.key">
                <img :src="img.url" @click="showImg(0)" :class="{ imgGray: !stock }" class="
                        xl:px-6
                        cursor-pointer
                        h-image-card
                        object-cover
                        w-full
                        rounded-t-lg
                        lg:rounded-none lg:rounded-l-lg
                      " :alt="product.title" />
              </Slide>
            </template>
            <template v-else>
              <Slide>
                <img :src="product.url_image" @click="showImg(0)" :class="{ imgGray: !stock }" class="
                        xl:px-6
                        cursor-pointer
                        h-image-card
                        object-cover
                        w-full
                        rounded-t-lg
                        lg:rounded-none lg:rounded-l-lg
                      " :alt="product.title" />
              </Slide>
            </template>
            <template #addons>
              <Navigation />
            </template>
          </Carousel>
        </div>
        <div class="w-full lg:w-1/2 xl:w-1/3 p-4">
          <div class="pl-5 pr-3 py-2">
            <h1 class="text-white text-xl font-semibold capitalize">
              {{ product.title }}
            </h1>
            <p class="text-gray-500 text-xs text-left my-2">
              Número de Visualizações:
              <span class="text-white font-bold">{{
                product.num_access || 0
              }}</span>
            </p>
            <hr class="border-gray-700 my-2" />
            <div class="text-gray-500">
              <div class="flex-none lg:flex lg:flex-row-reverse my-2">
                <div class="w-full lg:w-1/4 lg:text-right">
                  <span class="
                          mr-1
                          bg-white
                          text-gray-700 text-xs
                          px-2
                          rounded-full
                          uppercase
                          font-bold
                          tracking-wide
                        ">
                    Tipo {{ quality }}
                  </span>
                </div>
                <div class="w-full lg:w-3/4">
                  <small v-if="product.discount" style="text-decoration: line-through" class="block">R$
                    {{
                      product.price_total.toLocaleString("pt-br", {
                        minimumFractionDigits: 2,
                      })
                    }}</small>
                  <p>
                    R$
                    <span class="text-white text-3xl">{{
                      (
                        product.price_total -
                        (product.discount * product.price_total) / product.price
                      ).toLocaleString("pt-br", { minimumFractionDigits: 2 })
                    }}</span><span class="text-xs"> por chapa</span>
                  </p>
                  <p class="text-xs">
                    R$
                    {{
                      (product.price - product.discount).toLocaleString(
                        "pt-br",
                        { minimumFractionDigits: 2 }
                      )
                    }}
                    por m²
                  </p>
                  <p class="text-start text-xs">
                    Taxas de processamento são aplicáveis.
                  </p>
                  <p class="text-xs">
                    Unidades disponíveis:
                    <span class="text-white font-bold">{{
                      product.quantity
                    }}</span>
                  </p>

                </div>
              </div>
              <hr class="border-gray-700 my-2" />
              <div class="my-2">
                <p class="text-sm">
                  Material:
                  <span class="mr-1 text-white font-bold capitalize">
                    {{ product.material }}</span>
                </p>
                <p class="text-sm">
                  Altura:
                  <span class="mr-1 text-white font-bold">{{
                    product.height.toLocaleString("pt-br")
                  }}</span>
                  m
                </p>
                <p class="text-sm">
                  Comprimento:
                  <span class="mr-1 text-white font-bold">
                    {{ product.width.toLocaleString("pt-br") }}</span>
                  m
                </p>
                <p class="text-sm">
                  Espessura:
                  <span class="mr-1 text-white font-bold">
                    {{ product.depth.toLocaleString("pt-br") }}</span>
                  cm
                </p>
                <p class="text-sm">
                  Estilo:
                  <span class="mr-1 text-white font-bold capitalize">
                    {{ product.style || "Não informado" }}</span>
                </p>
              </div>
              <hr class="border-gray-700 my-4" />
              <div class="mt-4 mb-2">
                <p class="text-xs text-left my-2">
                  Unidades vendidas:
                  <span class="text-white font-bold">{{
                    product.total_sold || 0
                  }}</span>
                </p>
              </div>
              <div class="mt-4 mb-2">
                <div class="
                        h-1
                        mx-auto
                        relative
                        max-w-xl
                        w-full
                        rounded-full
                        overflow-hidden
                        my-2
                      ">
                  <div class="w-full h-full absolute bg-green-500"></div>
                  <div class="h-full bg-red-500 absolute" :style="{
                    width:
                      parseInt(
                        (product.count_satisfaction['D'] /
                          (product.count_satisfaction['L'] +
                            product.count_satisfaction['D'])) *
                        100
                      ) + '%',
                  }"></div>
                </div>
                <div class="my-2 flex justify-between px-2">
                  <div class="text-xs text-center">
                    <span class="text-xl"><i class="fas fa-thumbs-down"></i></span>
                    <span class="text-white font-bold ml-2">
                      {{ product.count_satisfaction["D"] || 0 }}</span>
                  </div>
                  <div class="text-xs text-center">
                    <span class="text-xl"><i class="fas fa-thumbs-up"></i></span>
                    <span class="text-white font-bold ml-2">
                      {{ product.count_satisfaction["L"] || 0 }}</span>
                  </div>
                </div>
              </div>
              <div class="mb-2 mt-4">
                <p class="text-xs">Vendido por:</p>
                <p>
                  <router-link class="
                          text-gray-500 text-sm
                          transition
                          duration-300
                          hover:text-red-800
                          uppercase
                          font-semibold
                          tracking-wide
                          cursor-pointer
                        " :to="{ path: '/loja/' + salesman.id_salesman }"><i class="fas fa-store"></i>
                    {{ salesman.business_name }}</router-link>
                </p>
              </div>
              <hr class="border-gray-700 my-6" />
              <div v-if="status === true" class="my-2 justify-center">
                <button type="button" @click="addToCart()" class="
                        inline-flex
                        justify-center
                        items-center
                        py-2
                        px-4
                        border-b-4 border-red-800
                        text-sm
                        leading-6
                        font-bold
                        focus:outline-none
                        rounded
                        text-white
                        bg-red-800
                        hover:bg-red-900
                        w-9/12
                        transition
                        duration-150
                      " :disabled="blockAction">
                  <svg class="h-5 w-5 mr-2 text-white animate-spin" v-if="loading" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  <i v-if="!loading" class="fas fa-dolly mr-1"></i> Carrinho
                </button>
                <input class="text-center py-2 rounded ml-3 bg-gray-700 w-2/12" type="number" placeholder="Qtd" name=""
                  min="1" :max="product.quantity" step="1" v-model="quantity" id="" />
              </div>
              <div v-else-if="status === false" class="my-2 justify-center">
                <p class="text-center">Produto sem estoque :(</p>
              </div>
              <div v-else-if="status === 'V'" class="my-2 justify-center">
                <p class="text-center">
                  Usuários vendedores não podem comprar, crie uma conta de
                  cliente!
                  <router-link class="underline hover:text-red-800" to="/cadastrar">
                    Cadastrar
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="my-6 bg-white rounded-lg p-4 text-gray-700">
        <h2 class="font-bold text-base lg:text-xl">Descrição</h2>
        <hr class="border-gray-300 my-2" />
        <p class="lg:mx-5 my-5">{{ product.description }}</p>
      </div>
    </div>

    <vue-easy-lightbox :visible="visible" :imgs="imgs" :index="0" @hide="handleHide"></vue-easy-lightbox>
  </div>
</template>

<style scoped>
@media screen and (max-width: 550px) {
  .h-image-card {
    height: 18rem;
  }
}

@media screen and (min-width: 551px) and (max-width: 850) {
  .h-image-card {
    height: 24rem;
  }
}

@media screen and (min-width: 851px) {
  .h-image-card {
    height: 32rem;
  }
}

input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>

<script>
import "vue3-carousel/dist/carousel.css";
import { mapActions, mapMutations } from "vuex";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import MessageCardFixed from "./MessageCardFixed.vue";

export default {
  props: {
    product: Object,
    salesman: Object,
    stock: Boolean,
  },
  data() {
    return {
      loading: false,
      blockAction: false,
      quantity: 1,

      type: "none",
      title: "",
      message: "",

      visible: false,
      imgs: [],

      status: true,
    };
  },
  components: {
    Carousel,
    Slide,
    Navigation,
    MessageCardFixed,
  },
  methods: {
    ...mapActions(["getItems", "setItem"]),
    redirectToSearch(search) {
      this.$router.push("/busca?search=" + search);
    },
    addToCart: async function () {
      this.loading = true;
      this.blockAction = true;
      if (this.quantity > this.product.quantity) {
        this.setMessage(
          "Erro!",
          "error",
          "Quantidade maior que a disponível!",
          3000
        );
        this.blockAction = false;
        return;
      }

      if (this.quantity < 1) {
        this.setMessage("Erro!", "error", "Quantidade inválida!", 3000);
        this.blockAction = false;
        return;
      }
      let data = {
        id_product: this.product.id,
        cart_quantity: parseInt(this.quantity),
      };
      this.setItem(data).then((result) => {
        result.success
          ? this.setMessage("Sucesso!", "success", result.message, 3000)
          : this.setMessage("Erro!", "error", result.message, 3000);
      });

      this.loading = false;
      this.blockAction = false;
    },
    setMessage(title, type, message, milisseconds) {
      this.message = message;
      this.type = type;
      this.title = title;
      this.loading = false;
      setTimeout(() => {
        this.type = "none";
      }, milisseconds);
      return;
    },
    showImg(index) {
      this.index = index;
      this.visible = true;
    },
    handleHide() {
      this.visible = false;
    },
  },
  created() {
    if (this.product.images.length)
      for (let img of this.product.images) this.imgs.push(img.url);
    else this.imgs = [this.product.url_image];

    if (this.$store.state.user.user.type == "V") this.status = "V";
    else this.status = this.stock;
  },
  computed: {
    quality() {
      const literal = {
        1: "A",
        2: "B",
        3: "C",
        4: "E",
      };
      return literal[this.product.quality];
    },
  },
};
</script>

<style scoped>
.imgGray:hover {
  filter: none;
  -webkit-filter: grayscale(0);
  -webkit-transition: all 0.8s linear;
  -moz-transition: all 0.8s linear;
  transition: all 0.8s linear;
}

.imgGray {
  -webkit-transition: all 0.8s linear;
  -moz-transition: all 0.8s linear;
  transition: all 0.8s linear;
  filter: gray;
  /* IE6-9 */
  -webkit-filter: grayscale(100%);
  /* Chrome 19+, Safari 6+, Safari 6+ iOS */
}

.capitalize {
  text-transform: capitalize;
}
</style>
