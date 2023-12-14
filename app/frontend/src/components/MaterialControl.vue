<template>
  <div>
    <MessageCardFixed :type="type" :message="message" :title="title" />
    <div class="flex-grow px-0 pt-8 pb-2">
      <h3 class="text-gray-700 text-3xl font-medium">Materiais</h3>
      <h3 class="text-gray-700 text-xl font-medium">
        Gerencie os tipos de materiais aqui!
      </h3>
      <p>Pesquise pelo material e, caso ele não exista, aperte o botão cadastrar novo</p>
      <div class="flex mt-4 space-x-4 mb-8">
        <input
          class="form-input"
          v-model="searchWord"
          placeholder="Pesquisar"
          type="search"
        />
        <br />
        <button
          @click="create"
          class="
            p-2
            border-b-4 border-red-800
            text-sm
            leading-6
            font-bold
            focus:outline-none
            rounded-md
            text-white
            bg-red-800
            hover:bg-red-800
            transition
            duration-150
          "
        >
          Cadastrar Novo
        </button>
      </div>
      <template v-if="!loading">
        <div v-for="material in materialSearch" :key="material.id" class="mt-4">
          <div class="flex flex-wrap -mx-6">
            <div class="w-full px-6">
              <div
                class="
                  flex
                  items-center
                  px-5
                  py-6
                  rounded-lg
                  bg-white
                  shadow-md
                "
              >
                <div class="mx-5">
                  <div class="text-gray-900 text-xl capitalize">{{ material.name }}</div>
                  <button
                    type="button"
                    @click="remove(material.id)"
                    class="text-gray-600 hover:text-red-800 hover:underline"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Category from "../services/Category";
import MessageCardFixed from "../components/MessageCardFixed.vue";

export default {
  components: {
    MessageCardFixed,
  },
  data() {
    return {
      materials: [],
      materialSearch: [],
      loading: true,
      searchWord: "",

      message: "",
      title: "",
      type: "none",
    };
  },
  async created() {
    const material = await Category.getAll();
    //console.log(material);
    if (material.success) {
      this.materials = material.material;
      this.materialSearch = material.material.filter(() => true);
    }
    this.loading = false;
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
    search() {
      this.loading = true;
      let search = this.searchWord
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      //console.log(search);
      this.materialSearch = this.materials.filter((mat) =>
        mat.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(search)
      );
      this.loading = false;
    },
    async remove(id) {
        //console.log(id)
      const result = await Category.destroy(id);
      if (result.success) {
        this.materials = this.materials.filter((mat) => id != mat.id);
        this.searchWord = "";
        this.setMessage('Sucesso!', 'success', 'Material removido com sucesso!', 3000);
      } else this.setMessage('Erro!', 'error', result.message, 3000);
    },
    async create() {
      const result = await Material.create({name: this.searchWord});
      if (result.success) {
          //console.log(result)
        this.materials.push(result.material)
        this.searchWord = "";
        this.setMessage('Sucesso!', 'success', 'Material cadastrado com sucesso!', 3000);
      } else this.setMessage('Erro!', 'error', result.message, 3000);
    },
  },
  watch: {
    searchWord() {
      this.search();
    },
  },
};
</script>

<style>
</style>