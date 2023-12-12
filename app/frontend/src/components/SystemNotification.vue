<template>
    <div>
        <template v-if="notification.type == 'V'">
            <strong>
                Você vendeu {{notification.message}}!
            </strong>
            <p>Veja mais detalhes de sua venda <router-link class="text-red-600" :to="{name: 'SaleDetails', params: {id: notification.aditional.id_order}}">aqui</router-link></p>
        </template>
    </div>
</template>

<script>
export default {
  props: {
    notification: Object,
  }
};
</script>

<style>
</style>