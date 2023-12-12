<template>
  <img @click="redirect" class=" cursor-pointer h-64 object-cover w-full" :src="banner.url_image"/>
</template>

<script>
export default {
    props: {
        banner: Object
    },
    methods: {
      redirect(){
        window.open(this.banner.link, '_blank')
      }
    }
}
</script>