<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-grow px-6 pt-8 pb-2">
      <MessageCardFixed :type="type" :message="message" :title="title" />
      <h1 class="text-2xl lg:text-5xl text-gray-800 lg:font-light mb-2">
        Pagamento
      </h1>
      <div class="md:flex md:space-x-4">
        <div class="md:w-2/3 w-full bg-white mt-4 rounded-lg p-6 mb-12">
          <span class="text-xl text-gray-600">Selecione o método de pagamento</span>
          <select name="method" required v-model="method" @change.prevent="calcTax()" class="
                inline
                text-sm
                sm:text-sm
                border
                rounded
                text-gray-800
                placeholder-gray-500
                focus:border-red-800 focus:outline-none
                py-2
                px-4
                md:ml-4
                mt-4
                md:mt-0
              ">
            <option value="P">Pix</option>
            <option value="B">Boleto</option>
            <option value="C">Cartão de Crédito</option>
          </select>

          <form @submit.prevent="pagar()" class="pt-4">
            <div v-if="method == 'B' || method == 'P'">
              <div class="sm:flex mb-16 sm:space-x-4">
                <div class="w-full sm:w-1/3 mb-4 sm:mb-0">
                  <label for="name" class="
                        mb-1
                        text-xs
                        font-bold
                        sm:text-sm
                        tracking-wide
                        text-gray-600
                      ">
                    Nome Completo
                  </label>

                  <input id="name" name="name" v-model="name" type="text" class="
                        text-sm
                        sm:text-sm
                        w-full
                        border
                        rounded
                        text-gray-800
                        placeholder-gray-500
                        focus:border-red-800 focus:outline-none
                        py-2
                        px-4
                      " placeholder="Nome" required />
                </div>
                <div class="w-full sm:w-1/3 mb-4 sm:mb-0">
                  <label for="document" class="
                        mb-1
                        text-xs
                        font-bold
                        sm:text-sm
                        tracking-wide
                        text-gray-600
                      ">
                    Documento
                  </label>
                  <input minlength="14" id="document" name="document" @keyup="mDoc()" v-model="document" class="
                        text-sm
                        sm:text-sm
                        w-full
                        border
                        rounded
                        text-gray-800
                        placeholder-gray-500
                        focus:border-red-800 focus:outline-none
                        py-2
                        px-4
                      " placeholder="CPF / CNPJ" required />
                </div>
                <div class="w-full sm:w-1/3 mb-4 sm:mb-0">
                  <label for="price" class="
                        mb-1
                        text-xs
                        font-bold
                        sm:text-sm
                        tracking-wide
                        text-gray-600
                      ">
                    Total da compra com taxas
                  </label>
                  <div class="relative">
                    <div class="
                          absolute
                          flex
                          border border-transparent
                          left-0
                          top-0
                          h-full
                          w-10
                        ">
                      <div class="
                            flex
                            items-center
                            justify-center
                            rounded-tl rounded-bl
                            z-10
                            bg-gray-100
                            text-gray-600 text-md
                            h-full
                            w-full
                          ">
                        R$
                      </div>
                    </div>
                    <input disabled id="price" v-model="total" name="price" type="number" step="0.01"
                      placeholder="Valor Total" required class="
                          text-sm
                          sm:text-sm
                          relative
                          w-full
                          border
                          rounded
                          text-gray-800
                          placeholder-gray-500
                          focus:border-red-800 focus:outline-none
                          py-2
                          pr-2
                          pl-12
                        " />
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="md:flex md:space-x-6">
                <div class="w-full">
                  <div class="mb-4">
                    <label for="number" class="
                          text-xs
                          font-bold
                          sm:text-sm
                          tracking-wid
                          text-gray-600
                        ">Número do Cartão</label>
                    <input id="number" v-model="card.number" @keyup="mNum()" name="number" type="card-number"
                      placeholder="Número do Cartão" required maxlength="19" minlength="19" class="
                          text-sm
                          sm:text-sm
                          w-full
                          border
                          rounded
                          text-gray-800
                          placeholder-gray-500
                          focus:border-red-800 focus:outline-none
                          py-2
                          px-4
                        " />
                  </div>
                  <div class="sm:flex mb-4 sm:space-x-4">
                    <div class="w-full sm:w-3/6 mb-4 sm:mb-0">
                      <label for="name" class="
                            mb-1
                            text-xs
                            font-bold
                            sm:text-sm
                            tracking-wide
                            text-gray-600
                          ">
                        Nome
                      </label>

                      <input id="name" name="name" v-model="card.name" type="text" class="
                            text-sm
                            sm:text-sm
                            w-full
                            border
                            rounded
                            text-gray-800
                            placeholder-gray-500
                            focus:border-red-800 focus:outline-none
                            py-2
                            px-4
                          " placeholder="Nome" required />
                    </div>
                    <div class="w-full sm:w-2/6 mb-4 sm:mb-0">
                      <label for="valid" class="
                            mb-1
                            text-xs
                            font-bold
                            sm:text-sm
                            tracking-wide
                            text-gray-600
                          ">
                        Validade
                      </label>
                      <input id="valid" maxlength="5" minlength="5" name="valid" v-model="card.valid" @keyup="mDate()"
                        class="
                            text-sm
                            sm:text-sm
                            w-full
                            border
                            rounded
                            text-gray-800
                            placeholder-gray-500
                            focus:border-red-800 focus:outline-none
                            py-2
                            px-4
                          " placeholder="Validade" required />
                    </div>
                    <div class="w-full sm:w-1/6 mb-4 sm:mb-0">
                      <label for="quantity" class="
                            mb-1
                            text-xs
                            font-bold
                            sm:text-sm
                            tracking-wide
                            text-gray-600
                          ">
                        CVV
                      </label>
                      <input id="quantity" v-model="card.cvv" maxlength="3" minlength="3" name="quantity" type="number"
                        placeholder="CVV" required class="
                            text-sm
                            sm:text-sm
                            w-full
                            border
                            rounded
                            text-gray-800
                            placeholder-gray-500
                            focus:border-red-800 focus:outline-none
                            py-2
                            px-4
                          " />
                    </div>
                  </div>
                  <div class="sm:flex mb-4 sm:space-x-4">
                    <div class="w-full sm:w-1/3 mb-4 sm:mb-0">
                      <label for="document" class="
                            mb-1
                            text-xs
                            font-bold
                            sm:text-sm
                            tracking-wide
                            text-gray-600
                          ">
                        Documento
                      </label>
                      <input minlength="14" id="document" name="document" @keyup="mDoc()" v-model="document" class="
                            text-sm
                            sm:text-sm
                            w-full
                            border
                            rounded
                            text-gray-800
                            placeholder-gray-500
                            focus:border-red-800 focus:outline-none
                            py-2
                            px-4
                          " placeholder="CPF / CNPJ" required />
                    </div>
                    <div class="w-full sm:w-1/2 mb-4 sm:mb-0">
                      <label for="portions" class="
                            mb-1
                            text-xs
                            font-bold
                            sm:text-sm
                            tracking-wide
                            text-gray-600
                          ">
                        Parcelas
                      </label>
                      <div class="relative">
                        <select name="portions" v-model="portions" required @change.prevent="calcTax()" class="
                              text-sm
                              sm:text-sm
                              w-full
                              border
                              rounded
                              text-gray-800
                              placeholder-gray-500
                              focus:border-red-800 focus:outline-none
                              py-2
                              px-4
                            ">
                          <option value="1" selected>01x Com Juros</option>
                          <option value="2">02x Com Juros</option>
                          <option value="3">03x Com Juros</option>
                          <option value="4">04x Com Juros</option>
                          <option value="5">05x Com Juros</option>
                          <option value="6">06x Com Juros</option>
                          <option value="7">07x Com Juros</option>
                          <option value="8">08x Com Juros</option>
                          <option value="9">09x Com Juros</option>
                          <option value="10">10x Com Juros</option>
                          <option value="11">11x Com Juros</option>
                          <option value="12">12x Com Juros</option>
                        </select>
                      </div>
                    </div>
                    <div class="w-full sm:w-1/2 mb-4 sm:mb-0">
                      <label for="price" class="
                            mb-1
                            text-xs
                            font-bold
                            sm:text-sm
                            tracking-wide
                            text-gray-600
                          ">
                        Total da compra com taxas
                      </label>
                      <div class="relative">
                        <div class="
                              absolute
                              flex
                              border border-transparent
                              left-0
                              top-0
                              h-full
                              w-10
                            ">
                          <div class="
                                flex
                                items-center
                                justify-center
                                rounded-tl rounded-bl
                                z-10
                                bg-gray-100
                                text-gray-600 text-md
                                h-full
                                w-full
                              ">
                            R$
                          </div>
                        </div>
                        <input disabled id="price" v-model="total" name="price" type="number" step="0.01"
                          placeholder="Valor em parcelas" required class="
                              text-sm
                              sm:text-sm
                              relative
                              w-full
                              border
                              rounded
                              text-gray-800
                              placeholder-gray-500
                              focus:border-red-800 focus:outline-none
                              py-2
                              pr-2
                              pl-12
                            " />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button :disabled="blockAction" class="
                    inline-flex
                    justify-center
                    items-center
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
                  ">
                <svg class="h-5 w-5 mr-2 text-white animate-spin" v-if="blockAction" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Efetuar Pagamento
              </button>
            </div>
          </form>
        </div>
        <div v-if="!loading && addresses.length" class="md:w-1/3 w-full bg-white mt-4 rounded-lg p-6 mb-12">
          <label class="text-xl text-gray-600" for="addresses">Selecione um endereço</label>
          <select id="addressess" name="addresses" required v-model="address" class="
                text-sm
                sm:text-sm
                w-full
                border
                rounded
                text-gray-800
                placeholder-gray-500
                focus:border-red-800 focus:outline-none
                py-2
                px-4
                mt-4
              ">
            <template v-for="address in addresses" :key="address.id">
              <option :value="address">{{ address.alias }}</option>
            </template>
          </select>
          <div v-if="address">
            <hr class="my-6" />
            <div class="text-gray-600 mt-">
              <h2 class="text-xl mb-4">Detalhes do Endereço</h2>
              <h3 class="">{{ address.alias }}</h3>
              <p>{{ `${address.street}, ${address.num}` }}</p>
              <p>{{ address.neigh }}</p>
              <p>{{ `${address.city}, ${address.state}` }}</p>
              <p>{{ `${address.zipcode}` }}</p>
            </div>
          </div>
          <div align="center" class="md:w-full w-full bg-white mt-4 rounded-lg p-6 mb-12">
            <span to="/perfil" class="text-md text-gray-600" for="addresses">Cadastrar um novo
              <router-link to="/perfil" class="text-red-800">
                endereço
              </router-link></span>
          </div>
        </div>
        <div align="center" v-else class="md:w-1/3 w-full bg-white mt-4 rounded-lg p-6 mb-12">
          <router-link to="/perfil" class="text-xl text-gray-600" for="addresses">Cadastre um endereço antes de efetuar a
            compra</router-link>
        </div>
      </div>

      <div class="pt-0">
        <div class="
              rounded
              flex
              text-center
              items-center
              bg-red-800
              text-white text-sm
              px-4
              py-3
            " role="alert">
          <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path
              d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
          </svg>
          <p class="text-center">
            Atenção! As questões de envio e frete devem ser tratadas diretamente
            com o vendedor!
            <router-link class="font-bold" to="/central-mensagens">Chat</router-link>
          </p>
        </div>
      </div>

      <h2 class="text-2xl lg:text-5xl text-gray-800 lg:font-light mb-2">
        Produtos
      </h2>
      <CartSum :showButton="false" />
      <template v-if="!loading">
        <template v-for="item in items" :key="item.id_product">
          <PaymentItem :product="item" />
        </template>
      </template>
      <PaymentItemLoad v-if="loading" />
      <PaymentItemLoad v-if="loading" />
      <PaymentItemLoad v-if="loading" />
      <PaymentItemLoad v-if="loading" />
    </div>
    <Footer />
  </div>
</template>

<script>

import Order from "../services/Order";
import Cart from "../services/Cart";
import Client from "../services/Client";
import Address from "../services/Address";
import Payment from "../services/Payment";
import PaymentItem from "../components/PaymentItem.vue";
import PaymentItemLoad from "../components/PaymentItemLoad.vue";
import Footer from "../components/Footer.vue";
import CartSum from "../components/CartSum.vue";
import MessageCardFixed from "../components/MessageCardFixed.vue";

import { mapActions } from "vuex";

export default {
  components: {
    PaymentItem,
    CartSum,
    Footer,
    MessageCardFixed,
    PaymentItemLoad,
  },
  data() {
    return {
      addresses: [],
      address: undefined,
      card: {
        number: undefined,
        name: undefined,
        valid: undefined,
        price: undefined,
        cvv: undefined,
      },
      order: {},
      total: 0,
      method: "B",
      portions: 1,
      name: "",
      document: "",
      loading: true,
      tax_value: 0,
      total_not_tax: 0,
      type: "none",
      message: "",
      title: "",

      blockAction: false,

      client: { name: "", surname: "", cpf: "", cnpj: "" },
    };
  },
  async created() {
    await this.loadCart();
    this.items = this.$store.state.cart.cart;

    const addresses = await Address.getAll(this.$store.state.user.user.id_user);
    if (addresses.success) this.addresses = addresses.address.data;

    const client = await Client.getClientById(
      this.$store.state.user.user.id_client
    );
    if (client.success) this.client = client.client;

    let order = {
      id_client: this.$store.state.user.user.id_client,
      id_user: this.$store.state.user.user.id_user,
      products: [],
    };

    this.items.map((item) => {
      let product = {
        id_product: item.id_product,
        quantity: item.cart_quantity,
        id_salesman: item.id_salesman,
        price: item.price,
      };
      this.total +=
        (item.price_total - (item.discount * item.price_total) / item.price) *
        item.cart_quantity;
      order.products.push(product);
    });

    this.total_not_tax = this.total;
    let tax = await Payment.getTaxas();

    let tax_total = parseFloat(tax.process.value);

    if (this.method == 'B')
      tax_total += tax.boleto.value;
    else if (this.method == 'C')
      tax_total = (parseFloat(this.total_not_tax) + parseFloat(tax_total)) * parseFloat(tax.credit_card[parseInt(this.portions) - 1].value) + parseFloat(tax.process.value);
    else if (this.method == 'P')
      tax_total = (this.total_not_tax + tax_total) * tax.pix.value + parseFloat(tax.process.value);

    this.tax_value = tax_total;
    this.total += tax_total;
    this.total = this.total.toFixed(2).toLocaleString();
    this.order = order;
    this.loading = false;
  },

  methods: {
    ...mapActions(["loadCart"]),
    setMessage(title, type, message, miliseconds) {
      this.message = message;
      this.type = type;
      this.title = title;
      setTimeout(() => {
        this.type = "none";
      }, miliseconds);
    },
    mDoc() {
      let doc = this.document;

      if (doc.length > 14) {
        doc = doc.replace(/\D+/g, "");
        doc = doc.replace(/^(\d{2})(\d)/, "$1.$2");
        doc = doc.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        doc = doc.replace(/\.(\d{3})(\d)/, ".$1/$2");
        doc = doc.replace(/(\d{4})(\d)/, "$1-$2");
      } else {
        doc = doc.replace(/\D/g, "");
        doc = doc.replace(/(\d{3})(\d)/, "$1.$2");
        doc = doc.replace(/(\d{3})(\d)/, "$1.$2");
        doc = doc.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      }

      this.document = doc;
    },
    mDate() {
      let valid = this.card.valid;
      valid = valid.replace(/\D/g, "");
      valid = valid.replace(/(\d{2})(\d)/, "$1/$2");
      this.card.valid = valid;
    },
    mNum() {
      let number = this.card.number;
      number = number.replace(/\D/g, "");
      number = number.replace(/(\d{4})(\d)/, "$1 $2");
      number = number.replace(/(\d{4})(\d)/, "$1 $2");
      number = number.replace(/(\d{4})(\d)/, "$1 $2");

      this.card.number = number;
    },
    async calcTax() {
      let tax = await Payment.getTaxas();

      let tax_total = parseFloat(tax.process.value);

      if (this.method == 'B')
        tax_total += tax.boleto.value;
      else if (this.method == 'C') {
        tax_total = (parseFloat(this.total_not_tax) + parseFloat(tax_total)) * parseFloat(tax.credit_card[parseInt(this.portions) - 1].value) + parseFloat(tax.process.value);
      }
      else if (this.method == 'P')
        tax_total = (this.total_not_tax + tax_total) * tax.pix.value + parseFloat(tax.process.value);

      this.tax_value = tax_total;
      this.total = this.total_not_tax + tax_total;

      this.total = this.total.toFixed(2).toLocaleString();
    },
    async pagar() {
      this.blockAction = true;
      if (!this.address) {
        this.blockAction = false;
        return this.setMessage("Erro!", "error", "Escolha um endereço!", 3000);
      }

      let result;
      if (this.method == "C") {
        const card_hash = await Payment.generateCardHash(
          this.card.number, this.card.name, this.card.valid.split('/')[0],
          this.card.valid.split('/')[1], this.card.cvv, this.document
        );
        result = await Order.create({
          ...this.order,
          id_address: this.address.id,
          card_hash: card_hash,
          method: this.method,
          portions: this.portions || 1,
          document: this.document,
          tax_total: this.tax_value
        });
      } else {
        //console.log(this.order);
        result = await Order.create({
          ...this.order,
          id_address: this.address.id,
          method: this.method,
          document: this.document,
          name: this.name,
          tax_total: this.tax_value
        });
      }
      this.blockAction = false;
      if (result.success) {
        return this.$router.push("/confirmacao/" + result.order.id);
      } else return this.setMessage("Erro!", "error", result.message, 3000);
    },
  },
};
</script>
