<template>
  <div class="flex-grow px-6 pt-8 pb-2">
    <!-- Modal Deleção de Endereço-->
    <div
      :class="`modal ${
        !openModalDelete && 'opacity-0 pointer-events-none'
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
          lg:max-w-md
          mx-auto
          rounded
          shadow-lg
          z-50
          overflow-y-auto
        "
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-3">
            <p class="text-2xl font-bold text-red-800">{{operationType == 'R' ? 'Reativar Usuário' : 'Desativar Usuário'}}</p>
            <div
              class="modal-close cursor-pointer z-50"
              @click="openModalDelete = false"
            >
              <svg
                class="fill-current text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                />
              </svg>
            </div>
          </div>

          <!--Body-->
          <p class="my-4">
            Tem certeza que deseja {{operationType == 'R' ? 'reativar' : 'desativar' }} o usuário <b>{{ userName }}</b
            >?
          </p>

          <!--Footer-->
          <div class="flex justify-end pt-2">
            <button
              @click="openModalDelete = false"
              class="
                px-6
                py-3
                bg-transparent
                p-3
                rounded-lg
                text-red-800
                hover:bg-gray-100
                hover:text-red-700
                mr-2
              "
            >
              Fechar
            </button>
            <form @submit.prevent="operation()">
              <button
                class="
                  px-6
                  py-3
                  bg-red-800
                  rounded-md
                  text-white
                  font-medium
                  tracking-wide
                  hover:bg-red-700
                "
              >
                {{operationType == 'R' ? 'Reativar' : 'Desativar'}}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div>
      <MessageCardFixed :type="type" :message="message" :title="title" />
      <div class="flex-grow px-0 pt-8 pb-2">
        <h3 class="text-gray-700 text-3xl font-medium">Usuários</h3>
        <h3 class="text-gray-700 text-xl font-medium">Gerencie os Usuários!</h3>
        <input
          class="form-input mt-5"
          v-model="searchWord"
          placeholder="Nome ou email..."
          type="search"
        />
        <br />

        <template v-if="!loading">
          <div v-for="user in usersSearch" :key="user.id" class="mt-4">
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
                    <div class="text-gray-900 text-xl capitalize">
                      {{ user.name + " " + user.surname }}
                    </div>
                    <p>{{ user.email }}</p>
                    <small>{{
                      user.type == "V" ? "Vendedor" : "Cliente"
                    }}</small
                    ><br />
                    <button
                      type="button"
                      @click="changeStatus(user.id, user.name, user.is_deleted, user.type, user.type == 'C' ? user.id_client : user.id_salesman)"
                      class="text-gray-600 hover:text-red-800 hover:underline"
                    >
                      {{user.is_deleted ? 'Reativar' : 'Desativar'}}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <Pagination
      :curPage="parseInt(pagination.currentPage)"
      :numPages="pagination.lastPage"
      v-on:go-to-page="goToPage"
    />
  </div>
</template>

<script>
import User from "../services/User";
import Client from "../services/Client";
import Salesman from "../services/Salesman";

import MessageCardFixed from "../components/MessageCardFixed.vue";

import Pagination from "../components/Pagination.vue";
export default {
  components: {
    MessageCardFixed,
    Pagination,
  },
  data() {
    return {
      users: [],
      usersSearch: [],
      loading: true,
      searchWord: "",
      pagination: {},

      message: "",
      title: "",
      type: "none",

      openModalDelete: false,
      userId: undefined,
      userName: undefined,
      operationType: false,
      userType: '',
      userIdSpecialization: undefined
    };
  },
  async created() {
    const users = await User.getAll();
    if (users.success) {
      //console.log(users)
      this.users = users.user.data;
      this.usersSearch = this.users.filter(() => true);
      this.pagination = users.user.pagination;
    }
    this.loading = false;
  },
  methods: {
    async goToPage(event, page) {
      this.loading = true;

      const users = await User.getAll(page);
      if (users.success) {
        this.users = users.user.data;
        this.usersSearch = this.users.filter(() => true);
        this.pagination = users.user.pagination;
      }
      this.loading = false;
    },
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

      this.usersSearch = this.users.filter(
        (user) =>
          user.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(search) ||
          user.surname
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(search) ||
          user.email
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(search)
      );
      this.loading = false;
    },
    async changeStatus(id_user, name, deleted, type, id_specialization) {
      this.userId = id_user;
      this.userName = name;
      this.operationType = deleted ? 'R' : 'D';
      this.userType = type;
      this.userIdSpecialization = id_specialization;
      this.openModalDelete = true;
    },
    async operation() {
      let result;
      if(this.userType == 'C'){
        result = this.operationType == 'R' ? await Client.restore(this.userIdSpecialization) : await Client.destroy(this.userIdSpecialization);
      }else if(this.userType == 'V'){
        result = this.operationType == 'R' ? await Salesman.restore(this.userIdSpecialization) : await Salesman.destroy(this.userIdSpecialization);
      }else return this.setMessage("Erro!", "error", 'Usuário administrador não pode ser apagado!', 3000);

      //console.log(result)

      if (result.success) {
        this.goToPage(null, this.pagination.currentPage)
        this.searchWord = "";
        this.setMessage(
          "Sucesso!",
          "success",
          "Usuário desativado/reativado com sucesso!",
          3000
        );
      } else this.setMessage("Erro!", "error", result.message, 3000);

      this.openModalDelete = false;
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