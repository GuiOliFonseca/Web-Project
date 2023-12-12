<template>
  <div class="min-h-screen flex flex-col">
    <MessageCardFixed
      :type="type2"
      :message="message"
      :title="title"
    />
    <div class="flex-grow px-6 pt-8 pb-2">
      <h1 class="text-2xl lg:text-5xl text-gray-800 lg:font-light mb-2">
        Situação do Pedido: nº #{{ $route.params.id }}
      </h1>
     
      <div v-if="loading">Processando...</div>
      <div v-if="!loading" class="my-auto bg-white mt-4 rounded-lg p-6">
        <template v-if="type == 'A'">
          <h1 class="text-2xl text-center text-green-500">
            <span class="mr-2"><i class="far fa-check-circle"></i></span>Seu
            pagamento foi aprovado!
          </h1>
          <p class="text-center mt-6 text-gray-600">
            <b>Contate os vendedores na sua página de compras</b> para acertar
            os detalhes do envio!
          </p>
          <div>
            <button
              @click="openOrder()"
              type="button"
              class="
                transition
                duration-150
                py-2
                px-4
                bg-red-800
                hover:bg-red-800
                text-white
                font-bold
                border-b-4 border-red-800
                focus:outline-none
                rounded
                w-full
                mt-6
              "
            >
              Acessar meu Pedido
            </button>
          </div>
        </template>

        <template v-else-if="type == 'R'">
          <h1 class="text-2xl text-center text-red-500">
            <span class="mr-2"><i class="fas fa-times"></i></span>Seu pagamento
            foi reprovado!
          </h1>
          <p class="text-center mt-6 text-gray-600">
            Houve um erro durante a efetuação do pagamento, tente novamente mais
            tarde!
          </p>
          <div>
            <button
              type="button"
              class="
                transition
                duration-150
                py-2
                px-4
                bg-red-800
                hover:bg-red-800
                text-white
                font-bold
                border-b-4 border-red-800
                focus:outline-none
                rounded
                w-full
                mt-6
              "
            >
              Voltar para Home
            </button>
          </div>
        </template>
        <template v-else-if="type=='B'">
          <h1 class="text-2xl text-center text-yellow-500">
            <span class="mr-2"><i class="fas fa-exclamation"></i></span
            >Aguardando o pagamento do boleto!
          </h1>
          <p class="text-center mt-6 text-gray-600">
            Após efetuar o pagamento,
            <b>acompanhe o status da compra em suas compras</b> e contate o
            vendedor!
          </p>
          <p class="text-center mt-6 text-gray-600">
            <b>{{ boletoCode }}</b>
          </p>
          <div>
            <button
              type="button"
              @click="openBoleto()"
              class="
                transition
                duration-150
                py-2
                px-4
                bg-red-800
                hover:bg-red-800
                text-white
                font-bold
                border-b-4 border-red-800
                focus:outline-none
                rounded
                w-full
                mt-6
              "
            >
              Acessar Boleto
            </button>
          </div>
        </template>
        <template v-else-if="type=='PIX'">
          <h1 class="text-2xl text-center text-yellow-500">
            <span class="mr-2"><i class="fas fa-exclamation"></i></span
            >Aguardando o pagamento via PIX!
          </h1>
          <p class="text-center mt-6 text-gray-600">
            Após efetuar o pagamento,
            <b>acompanhe o status da compra em suas compras</b> e contate o
            vendedor!
          </p>
          <div class="flex justify-center items-center mt-5">
            <img class="w-56" :src="pix_qr" alt="">
          </div>
          <p class="text-center mt-6 text-gray-600">
            <b>{{pix_qr_url}}</b>
          </p>
          <div>
            <button
              type="button"
              @click="copyQrPix()"
              class="
                transition
                duration-150
                py-2
                px-4
                bg-red-800
                hover:bg-red-800
                text-white
                font-bold
                border-b-4 border-red-800
                focus:outline-none
                rounded
                w-full
                mt-6
              "
            >
              Copiar QR Pix
            </button>
          </div>
        </template>
        <template v-else-if="type == 'P'">
          <h1 class="text-2xl text-center text-yellow-500">
            <span class="mr-2"><i class="fas fa-exclamation"></i></span>Estamos
            processando seu pagamento! Aguarde...
          </h1>
          <p class="text-center mt-6 text-gray-600">
            Veja mais detalhes em suas compras!
          </p>
          <div>
            <button
              @click="openOrder()"
              type="button"
              class="
                transition
                duration-150
                py-2
                px-4
                bg-red-800
                hover:bg-red-800
                text-white
                font-bold
                border-b-4 border-red-800
                focus:outline-none
                rounded
                w-full
                mt-6
              "
            >
              Acessar meu Pedido
            </button>
          </div>
        </template>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Order from "../services/Order";
import Footer from "../components/Footer.vue";
import MessageCardFixed from "../components/MessageCardFixed.vue";

export default {
  components: {
    Footer,
    MessageCardFixed
  },
  data() {
    return {
      type: "",
      status: "",
      loading: true,
      id: undefined,

      boletoLink: "",
      boletoCode: "",
      pix_qr: "",
      pix_qr_url: "",
      title: "",
      type2: "none",
      message: "",

      timervar: undefined,
    };
  },
  async created() {
    this.timervar = setInterval(async () => {
      const order = await Order.getOrderById(this.$route.params.id);
      //console.log(order);
      if (!order.success) this.$router.push("/");
      else {
        if (!order.order.current_status) {
          this.loading = false;
          return (this.type = "P");
        } else clearInterval(this.timervar);

        this.status = order.order.current_status;
        if (order.order.method == "B" && order.order.boleto_barcode != null) {
          this.type = "B";
          this.boletoLink = order.order.boleto_url;
          this.boletoCode = order.order.boleto_barcode;
        } else if(order.order.method == "P"){
          this.type = "PIX";
          const paymentData = JSON.parse(order.order.payment_json);
          this.pix_qr = paymentData.charges[0].last_transaction.qr_code_url;
          this.pix_qr_url = paymentData.charges[0].last_transaction.qr_code;
          
        }
         else if (!order.order.current_status) this.type = "P";
        else if (order.order.current_status == "paid") this.type = "A";
        else if (order.order.current_status == "refused") this.type = "R";
        else this.type = "P";

        this.id = order.order.id;
      }

      this.loading = false;
    }, 7000);
  },
  methods: {
    setMessage(title, type, message, miliseconds) {
      this.message = message;
      this.type2 = type;
      this.title = title;
      setTimeout(() => {
        this.type2 = "none";
      }, miliseconds);
      return;
    },
    openBoleto() {
      window.open(this.boletoLink, "_blank");
    },
    openOrder(){
      this.$router.push('/suas-compras/detalhes/'+ this.id)
    },
    copyQrPix(){
      navigator.clipboard.writeText(this.pix_qr_url);
      this.setMessage("Sucesso!", "success", 'Código pix copiado!', 3000);
    },
  },
  beforeUnmount() {
    clearInterval(this.timervar);
  },
};
</script>
