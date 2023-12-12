<template>
  <div class="min-h-screen flex flex-col">
    <MessageCardFixed :type="type" :message="message" :title="title"/>
    <!-- Modal Add Banner -->
     <div
      :class="`modal ${
        !openModalAddBanner && 'opacity-0 pointer-events-none'
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
            <p class="text-2xl font-bold text-red-800">Adicionar banner</p>
            <div
              class="modal-close cursor-pointer z-50"
              @click="openModalAddBanner = false"
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
          <form @submit.prevent="addBanner()">
            <p class="my-4">Carregue a imagem e informe o link, caso possua.</p>

            <div class="w-full mb-4">
              <label
                for="confirm-password"
                class="
                  mb-1
                  text-xs
                  font-bold
                  sm:text-sm
                  tracking-wide
                  text-gray-600
                "
              >
                Imagem do Banner
              </label>
              <input
                @change="loadImage"
                id="banner-image"
                name="banner-image"
                type="file"
                accept="image/*"
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
            <div class="w-full mb-4">
              <label
                for="confirm-password"
                class="
                  mb-1
                  text-xs
                  font-bold
                  sm:text-sm
                  tracking-wide
                  text-gray-600
                "
              >
                Link Associado
              </label>
              <input
                v-model="link"
                name="banner-url"
                type="url"
                placeholder="https://exemplo.com.brs"
                pattern="https://.*"
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

            <!--Footer-->
            <div class="flex justify-end pt-2">
              <button
                type="button"
                @click="openModalAddBanner = false"
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
                Cancelar
              </button>
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
                Adicionar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Edit Banner -->
    <div
      :class="`modal ${
        !openModalAlterBanner && 'opacity-0 pointer-events-none'
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
            <p class="text-2xl font-bold text-red-800">Editar banner</p>
            <div
              class="modal-close cursor-pointer z-50"
              @click="openModalAlterBanner = false"
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
          <form @submit.prevent="updateBanner">
            <p class="my-4">Informe o link, caso possua.</p>

            <div class="w-full mb-4">
              <label
                for="confirm-password"
                class="
                  mb-1
                  text-xs
                  font-bold
                  sm:text-sm
                  tracking-wide
                  text-gray-600
                "
              >
                Link Associado
              </label>
              <input
                v-model="link"
                name="banner-url"
                type="url"
                placeholder="https://exemplo.com.brs"
                pattern="https://.*"
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

            <!--Footer-->
            <div class="flex justify-end pt-2">
              <button
                @click="openModalAlterBanner = false"
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
                Cancelar
              </button>
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
                Atualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

     <!-- Modal Delete Banner -->
    <div
      :class="`modal ${
        !openModalDeleteBanner && 'opacity-0 pointer-events-none'
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
            <p class="text-2xl font-bold text-red-800">Apagar banner</p>
            <div
              class="modal-close cursor-pointer z-50"
              @click="openModalDeleteBanner = false"
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
            Tem certeza que deseja apagar o banner? 
          </p>

          <!--Footer-->
          <div class="flex justify-end pt-2">
            <button
              @click="openModalDeleteBanner = false"
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
            <form @submit.prevent="deleteBanner">
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
                Apagar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

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
                <div class="text-gray-500">Total de Vendas</div>
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

          <div class="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3">
            <div
              class="flex items-center px-5 py-6 rounded-lg bg-white shadow-md transform transition duration-500 hover:scale-105"
            >
              <div class="rounded-full text-red-800">
                <span class="text-5xl"><i class="fas fa-truck-loading"></i></span>
              </div>

              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">{{orderPending || 0}}</h4>
                <div class="text-gray-500">Pedidos Pendentes</div>
              </div>
            </div>
          </div>

          <div class="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3">
            <div
              class="flex items-center px-5 py-6 rounded-lg bg-white shadow-md transform transition duration-500 hover:scale-105"
            >
              <div class="rounded-full text-red-800">
                <span class="text-5xl"><i class="fas fa-shipping-fast"></i></span>
              </div>

              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">{{orderShipped || 0}}</h4>
                <div class="text-gray-500">Pedidos Enviados</div>
              </div>
            </div>
          </div>

          <div class="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3">
            <div
              class="flex items-center px-5 py-6 rounded-lg bg-white shadow-md transform transition duration-500 hover:scale-105"
            >
              <div class="rounded-full text-red-800">
                <span class="text-5xl"><i class="fas fa-dolly"></i></span>
              </div>

              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">{{orderReceived || 0}}</h4>
                <div class="text-gray-500">Pedidos Recebidos</div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="mt-8">
        <h3 class="text-gray-700 text-3xl font-medium">Banners Ativos</h3>
        <div class="flex overflow-x-scroll my-4 space-x-8">
          <div class="self-center">
            <button class="bg-red-800 p-10 rounded-md hover:bg-red-700" @click="modalAddBanner()">
              <span class="text-white text-2xl"
                ><i class="fas fa-plus"></i
              ></span>
            </button>
          </div>
          <template v-if="!loading">
            <div v-for="banner in banners" :key="banner.id" class="w-full md:w-1/3 bg-white rounded-lg my-4 shadow-md">
            <img :src="banner.url_image" @click="redirect(banner.link)" class="h-48 object-cover w-full rounded-t-lg cursor-pointer" >
            <div class="flex p-4 space-x-8 justify-center">
              <button class="bg-red-800 hover:bg-red-700 p-2 text-white rounded-md" @click="modalAlterBanner(banner.id)">Editar</button>
              <button class="bg-red-800 hover:bg-red-700 p-2 text-white rounded-md" @click="modalDeleteBanner(banner.id)">Excluir</button>
            </div>
          </div>
          </template>

        </div>
      </div>

      <div class="mt-8">
        <h3 class="text-gray-700 text-3xl font-medium">Estatísticas Gerais</h3>
        <div class="lg:flex lg:space-x-4 mt-4">

          <div class="w-full lg:w-1/3 bg-white p-4 rounded-lg">
            <h4 class="text-xl font-semibold text-gray-700">Usuários por tipo</h4>
            <hr class="my-2">
            <UserTypes v-if="!loading" :data="userType" />
          </div>

          <div class="w-full lg:w-2/3 mt-4 lg:mt-0 bg-white p-4 rounded-lg">
            <h4 class="text-xl font-semibold text-gray-700">Novos Usuários por Mês</h4>
            <hr class="my-2">
            <NewUsersMonthly v-if="!loading" :data="countNewUsers"/>
          </div>

        </div>
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

      <MaterialControl />
      
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
import MaterialControl from "../components/MaterialControl.vue";

import Statistics from "../services/Statistics";
import Banner from "../services/Banner";
export default {
  components: {
    UserTypes,
    NewUsersMonthly,
    NewOrders,
    Footer,
    MessageCardFixed,
    MaterialControl
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

      orderPending: undefined,
      orderShipped: undefined,
      orderReceived: undefined,

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
    modalAddBanner() {
      this.openModalAddBanner = true;
    },
    loadImage(event){
      this.image = event.target.files[0];
    },
    redirect(link){
      window.open(link, '_blank');
    },
    async addBanner(){
      let formData = new FormData();
      //console.log(this.image)
      formData.append("file", this.image);
      formData.append("data", JSON.stringify({link: this.link}));

      const result = await Banner.create(formData);
      if(result.success){
        const b = await Banner.getAll();
        this.banners = b.banners || this.banners;
        this.setMessage('Sucesso!', 'success', 'Banner cadastrado com sucesso!', 3000);
        this.openModalAddBanner = false;
        this.link = '';
      }else this.setMessage('Erro!', 'error', result.message, 3000);
    },
    modalAlterBanner(id_banner) {
      this.id_banner = id_banner;
      this.openModalAlterBanner = true;
    },
    async updateBanner(){
      const result = await Banner.update({link: this.link, id_banner: this.id_banner});
      //console.log(result);
      if(result.success){
        const b = await Banner.getAll();
        this.banners = b.banners || this.banners;
        this.setMessage('Sucesso!', 'success', 'Banner atualizado com sucesso!', 3000);
        this.openModalAlterBanner = false;
        this.link = '';
      }else this.setMessage('Erro!', 'error', result.message, 3000);
    },
    modalDeleteBanner(id_banner) {
      this.id_banner = id_banner;
      this.openModalDeleteBanner = true;
    },
    async deleteBanner(){
      const result = await Banner.destroy(this.id_banner);
      //console.log(result);
      if(result.success){
        let id = this.id_banner;
        this.banners =  this.banners.filter(b => b.id != id);
        this.setMessage('Sucesso!', 'success', 'Banner apagado com sucesso!', 3000);
        this.openModalDeleteBanner = false;
        this.link = '';
      }else this.setMessage('Erro!', 'error', result.message, 3000);
    }
  },
  async created(){
    if(this.$store.state.user.user.type != 'A') return this.$router.push('/');
    
    const banners = await Banner.getAll();
    const userType = await Statistics.getCountUserByType();
    const countNewUsers = await Statistics.getCountNewUsers();
    const ordersAtMonth = await Statistics.getOrderMonthly();
    const ordersAtYear = await Statistics.getOrderYearly();
    const productAvaliable = await Statistics.getProductAvailable();
    const orderSold = await Statistics.getOrdersSold();
    const salesmanAvaliations = await Statistics.getCountSalesmanAvaliation();
    const productAvaliation = await Statistics.getCountProductAvaliation();
    const orderStatus = await Statistics.getShipStatus();

    if(userType.success)
      this.userType = userType.user;
    if(countNewUsers.success)
      this.countNewUsers = countNewUsers.user;
    if(ordersAtMonth.success)
      this.ordersAtMonth = ordersAtMonth.order;
    if(ordersAtYear.success)
      this.ordersAtYear = ordersAtYear.order;
    if(productAvaliable.success)
      this.productAvaliable = productAvaliable.numProducts;
    if(orderSold.success)
      this.solds = productAvaliable.numProducts;
    if(banners.success) 
      this.banners = banners.banners;
    if(salesmanAvaliations.success)
      this.salesmanAvaliation = salesmanAvaliations.relation;
    if(productAvaliation.success)
      this.productAvaliation = productAvaliation.relation;

    if(orderStatus.success) {
      for(const order of orderStatus.status) {
        if(order.status === 'C') this.orderPending = order.count;
        else if (order.status === 'E') this.orderShipped = order.count;
        else this.orderReceived = order.count;
      }
    }

    this.loading = false
  }
};
</script>