<template>
  <div class="min-h-screen flex flex-col">
    <div
      :class="`modal ${
        !open && 'opacity-0 pointer-events-none'
      } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
    >
      <div
        class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
      ></div>

      <div
        class="
          modal-container
          bg-white
          w-11/12
          md:max-w-md
          mx-auto
          rounded
          shadow-lg
          z-50
          overflow-y-auto
        "
      >
        <div
          class="
            modal-close
            absolute
            top-0
            right-0
            cursor-pointer
            flex flex-col
            items-center
            mt-4
            mr-4
            text-white text-sm
            z-50
          "
        >
          <svg
            class="fill-current text-white"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path
              d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
            />
          </svg>
          <span class="text-sm">(Esc)</span>
        </div>
      </div>
    </div>

    <div
      :class="`modal ${
        !openModalAddress && 'opacity-0 pointer-events-none'
      } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
    >
      <div
        class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
      ></div>

      <div
        class="
          modal-container
          bg-white
          w-11/12
          md:max-w-md
          mx-auto
          rounded
          shadow-lg
          z-50
          overflow-y-auto
        "
      >

        <div class="modal-content py-4 text-left px-6">
          <div class="flex justify-between items-center pb-3">
            <p class="text-2xl font-bold">Endereço não cadastrado</p>
            <div class="modal-close cursor-pointer z-50">
            </div>
          </div>

          <p>
            Você precisa cadastrar seu endereço para conseguir cadastrar um produto!
          </p>

          <div class="flex justify-end pt-2">
            <button
              @click="$router.push('/perfil')"
              class="
                px-6
                py-3
                bg-red-800
                hover:bg-red-800
                text-white
                font-bold
                border-b-4 border-red-800
                focus:outline-none
                rounded
              "
            >
              Cadastrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <MessageCardFixed :message="message" :title="title" :type="type" />
    <div class="flex-grow px-6 pt-8 pb-2">
      <h1 class="text-2xl lg:text-5xl text-gray-800 lg:font-light mb-2">
        Cadastro de Produto
      </h1>
      <div class="bg-white mt-4 rounded-lg p-6 mb-12">
        <form @submit.prevent="registerProduct()">
          <div class="w-full mb-5">
            <div class="mb-4">
              <input
                accept="image/x-png,image/jpeg"
                class="inputfile"
                id="image"
                name="image"
                type="file"
                multiple
                @change="addPhoto"
              />
            </div>
            <div id="preview" class="flex overflow-x-auto space-x-2 rounded-lg">
              <label
                for="image"
                class="
                  cursor-pointer
                  mb-1
                  text-xs
                  font-bold
                  sm:text-sm
                  tracking-wide
                  text-gray-600
                "
              >
                Fotos: {{ qtdImages }}
                <br />
                <div
                  class="
                    mt-4
                    rounded-lg
                    w-24
                    h-24
                    border border-solid border-red-800
                    font-normal
                    text-red-800
                  "
                >
                  <p class="text-center mt-5 mb-1 w-full">Selecione</p>
                  <p class="text-center">
                    <i
                      class="
                        far
                        fa-images
                        text-red-800 text-center text-2xl text-light
                      "
                    ></i>
                  </p>
                </div>
              </label>
              <div v-for="image in images" :key="image.key">
                <img
                  class="rounded object-cover h-24 w-24 mt-preview"
                  width="80px"
                  height="80px"
                  :src="image.url"
                  :title="image.key"
                />
                <div @click="removeImage(image.key)" class="text-center">
                  <i
                    class="far fa-trash-alt hover:text-red-800 cursor-pointer"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          <div class="md:flex md:space-x-6">
            <div class="w-full md:w-1/2">
              <div class="mb-4">
                <label
                  for="title"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Título
                </label>
                <input
                  id="title"
                  v-model="titleProduct"
                  name="title"
                  type="text"
                  autocomplete="off"
                  placeholder="Nome do produto"
                  required
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800
                    focus:outline-none
                    py-2
                    px-4
                  "
                />
              </div>
              <div class="sm:flex mb-4 sm:space-x-4">
                <div class="w-full sm:w-1/2 mb-4 sm:mb-0">
                  <label
                    for="category"
                    class="
                      mb-1
                      text-xs
                      font-bold
                      sm:text-sm
                      tracking-wide
                      text-gray-600
                    "
                  >
                    Categoria
                  </label>
                  <input
                    @input="updateNameCategory"
                    class="p-5 w-full border rounded h-10 capitalize"
                    list="list-category"
                    ref="category"
                    required
                  />
                  <datalist v-if="!loading" id="list-category">
                    <option
                      class="capitalize"
                      v-for="category in categoryList"
                      :key="category.id"
                      :value="category.name"
                    />
                  </datalist>
                </div>
              </div>
              <div class="sm:flex mb-4 sm:space-x-4">
                <div class="w-full sm:w-3/6 mb-4 sm:mb-0">
                  <label
                    for="price"
                    class="
                      mb-1
                      text-xs
                      font-bold
                      sm:text-sm
                      tracking-wide
                      text-gray-600
                    "
                  >
                    Preço
                  </label>
                  <div class="relative">
                    <div
                      class="
                        absolute
                        flex
                        border border-transparent
                        left-0
                        top-0
                        h-full
                        w-10
                      "
                    >
                      <div
                        class="
                          flex
                          items-center
                          justify-center
                          rounded-tl rounded-bl
                          z-10
                          bg-gray-100
                          text-gray-600 text-md
                          h-full
                          w-full
                        "
                      >
                        R$
                      </div>
                    </div>
                    <input
                      id="price"
                      v-model="price"
                      name="price"
                      type="text"
                      @keyup="moneyFormat()"
                      placeholder="Valor por m²"
                      required
                      autocomplete="off"
                      step="0.01"
                      class="
                        text-sm
                        sm:text-sm
                        relative
                        w-full
                        border
                        rounded
                        text-gray-800
                        placeholder-gray-500
                        focus:border-red-800
                        focus:outline-none
                        py-2
                        pr-2
                        pl-12
                      "
                    />
                  </div>
                </div>
                <div class="w-full sm:w-1/6 mb-4 sm:mb-0">
                  <label
                    for="quantity"
                    class="
                      mb-1
                      text-xs
                      font-bold
                      sm:text-sm
                      tracking-wide
                      text-gray-600
                    "
                  >
                    Unidades
                  </label>
                  <input
                    id="quantity"
                    v-model="quantity"
                    name="quantity"
                    type="number"
                    placeholder="Qtd"
                    required
                    autocomplete="off"
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800
                      focus:outline-none
                      py-2
                      px-4
                    "
                  />
                </div>
              </div>
            </div>
            <div class="w-full md:w-1/2 mt-4 md:mt-0">
              <div class="mb-4">
                <label
                  for="desc"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Descrição
                </label>
                <textarea
                  id="desc"
                  v-model="description"
                  name="desc"
                  placeholder="Aqui você pode informar dados sobre o produto que não foram contemplados ao lado..."
                  rows="13"
                  required
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800
                    focus:outline-none
                    py-2
                    px-4
                  "
                ></textarea>
              </div>
            </div>
          </div>
          <div>
            <button
              :disabled="buttonLoading"
              type="submit"
              class="
                inline-flex
                justify-center
                items-center
                transition
                duration-150
                py-2
                px-4
                bg-red-800
                hover:bg-red-900
                text-white
                font-bold
                border-b-4 border-red-900
                focus:outline-none
                rounded
                w-full
              "
            >
              <svg
                class="h-5 w-5 mr-2 text-white animate-spin"
                v-if="buttonLoading"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Cadastrar produto
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import MessageCardFixed from "../components/MessageCardFixed.vue";
import Product from "../services/Product";
import Category from "../services/Category";
import Salesman from "../services/Salesman";

export default {
  data() {
    return {
      type: "none",
      title: "",
      message: "",
      qtdImages: 0,

      titleProduct: "",
      images: [],
      price: undefined,
      pricePerPlate: undefined,
      quantity: undefined,
      quality: "1",
      width: undefined,
      height: undefined,
      depth: undefined,
      description: undefined,

      categoryList: [],
      category: undefined,
      style: undefined,
      loading: true,
      files: [],

      buttonLoading: false,

      openModalAddress: undefined
    };
  },
  methods: {
    updateNameCategory(){
      this.category = this.$refs.category.value;
    },
    moneyFormat() {
      let v = this.price.replace(/\D/g, '');
      v = `${(v / 100).toFixed(2)}`;
      v = v.replace('.', ',');
      v = v.replace(/(\d)(\d{3})(\d{3}),/g, '$1.$2.$3,');
      v = v.replace(/(\d)(\d{3}),/g, '$1.$2,');
      this.price = v;
    },
    async removeImage(key) {
      this.images = this.images.filter((image) => image.key != key);
      this.files = this.files.filter((file) => file.name != key);
      this.qtdImages--;
    },
    setMessage(title, type, message, miliseconds) {
      this.message = message;
      this.type = type;
      this.title = title;
      setTimeout(() => {
        this.type = "none";
      }, miliseconds);
    },
    addPhoto(e) {
      const files = e.target.files;
      if (files.length) {
        for (let i = 0; i < files.length; i++) {
          if (!/\.(jpe?g|png)$/i.test(files[i].name))
            return this.setMessage(
              "Imagem não carregada",
              "error",
              `${files[i].name} não tem o formato permitido!`,
              4000
            );
          if (this.qtdImages + 1 <= 15) {
            this.images.push({
              key: files[i].name,
              url: (window.URL ? URL : webkitURL).createObjectURL(files[i]),
            });
            this.files.push(files[i]);
            this.qtdImages++;
          }
        }
      }
    },
    async registerProduct() {
      //console.log("Entrou")
      if(this.files.length < 1) {
        this.setMessage("Erro!", "error", "Adicione pelo menos uma foto do produto!", 3000);
        return;
      }
      const exists = this.categoryList.filter((category) => {
        if (
          category.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") ==
          this.category
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        )
          return category;
      });

      let data = {
        title: this.titleProduct,
        price: parseFloat(this.price.replace('.', '').replace(',', '.')).toFixed(2),
        quantity: parseInt(this.quantity),
        description: this.description,
        id_salesman: this.$store.state.user.user.id_salesman,
      };

      if (exists && exists.length) {
        data.id_category = exists[0].id;
      } else {
        this.setMessage("Erro!", "error", "Selecione uma categoria já existente!", 3000);
        return;
      }
      this.buttonLoading = true;

      let formData = new FormData();
      for (let image of this.files) {
        formData.append("file", image);
      }

      formData.append("data", JSON.stringify(data));
      const result = await Product.create(formData);
      if (result.success) {
        this.setMessage("Sucesso!", "success", "Produto cadastrado!", 3000);
        this.$router.push({ path: "/produto/" + result.product.id });
      } else {
        this.setMessage("Erro!", "error", result.message, 3000);
      }
      this.buttonLoading = false;
    },
  },
  components: {
    MessageCardFixed,
  },
  async created() {
    if (!this.$store.state.user.user.id_salesman) this.$router.push("/");
    const categories = await Category.getAll(1);
    this.categoryList = categories.category;
    this.loading = false;

    const salesman = await Salesman.getSalesmanById(this.$store.state.user.user.id_salesman);
    if(!salesman.success) this.$router.push("/");
    if(salesman.salesman.id_address){
      this.openModalAddress = false;
    }else this.openModalAddress = true;
  }
};
</script>

<style>
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.mt-preview {
  margin-top: 2.25rem;
}

.modal {
  transition: opacity 0.25s ease;
}
</style>
