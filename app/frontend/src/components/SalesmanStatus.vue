<template>
  <div>
    <div class="img-mkt bg-cover bg-center h-160 rounded-t-lg md:rounded-none" />
    <div style="filter: blur(0px)" class="bg-white md:flex rounded-b-lg md:rounded-lg md:mx-6 p-6 -mt-16">
      <div class="w-full text-gray-600">
        <p class="font-bold">Informações sobre a loja</p>
        <p class="my-2">Nome do negócio: {{ salesman.business_name }}</p>
        <p class="my-2">CNPJ: {{ mCNPJ(salesman.cnpj) }}</p>
        <p class="my-2">Entrou em: {{ formatDate(salesman.created_at) }}</p>
      </div>
      <div class="w-full md:w-2/3">
        <div class="w-full text-gray-600">
        <p class="font-bold">Avaliações</p>
        <p v-if="!notAvaliation" class="my-2">Essa loja é recomendada por {{percentage}} dos usuários!</p>
        <p v-else class="my-2">Essa loja ainda não recebeu avaliações!</p>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.img-mkt {
  background-image: url("https://system-photos.s3-sa-east-1.amazonaws.com/market.jpg");
  z-index: -1;
}

.h-160 {
  height: 32rem;
}

@media screen and (max-width: 700px) {
  .img-mkt {
    background-image: url("https://system-photos.s3-sa-east-1.amazonaws.com/market-vertical.jpg");
    background-position: bottom;
  }
}
</style>

<script>
import SalesmanAvaliation from "../services/SalesmanAvaliation";
export default {
  data(){
    return {
      percentage: "--%",
      notAvaliation: false,
    }
  },
  props: {
    salesman: Object,
  },
  components: {},
  async created(){
    const countAvaliations = await SalesmanAvaliation.countAvaliations(this.salesman.id_salesman);
    //console.log(countAvaliations);
    if(countAvaliations.success){
      const likes = countAvaliations.avaliation.filter(ava => {
        return ava.satisfaction == 'L'
      });
      const dislikes = countAvaliations.avaliation.filter(ava => {
        return ava.satisfaction == 'D'
      });

      //console.log(likes, dislikes)

      if(countAvaliations.avaliation.length == 2) this.percentage = parseInt(((likes[0].count -  dislikes[0].count) / (likes[0].count +dislikes[0].count)) * 100);
      else if(likes.length) this.percentage = '100';
      else this.percentage = '0'

      if(this.percentage < 0) this.percentage = '0%';
      else if (this.percentage > 100) this.percentage = '100%'
      else this.percentage += '%';
    }else this.notAvaliation = true;
  },
  methods: {
    formatDate(date) {
      let dateParts = date.split("T")[0].split("-");
      return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    },
    mCNPJ(cnpj) {
      cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
      cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2");
      cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2");
      return cnpj;
    },
  },
};
</script>