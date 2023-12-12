<template>
  <div>
    <DashboardAdmin v-if="$store.state.user.user.type == 'A'" />
    <DashboardSalesman v-if="$store.state.user.user.type == 'V'" />
  </div>
</template>

<script>
import Footer from "../components/Footer.vue";
import DashboardAdmin from "../views/DashboardAdmin.vue";
import DashboardSalesman from "../views/DashboardSalesman.vue";
export default {
  components: {
    Footer,
    DashboardSalesman,
    DashboardAdmin
  },
  created(){
    if(this.$store.state.user.user.type != 'A' && this.$store.state.user.user.type != 'V') 
      return this.$router.push('/');
  }
};
</script>