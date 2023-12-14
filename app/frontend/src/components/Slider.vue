<template>
  <carousel
    @mouseenter="type == 'B' ? (mouseHover = true) : (mouseHover = false)"
    @mouseleave="mouseHover = false"
    :settings="settings"
    :breakpoints="breakpoints"
    
    class="mb-10"
  >
    <slide v-for="dt in data" :key="dt.id">
      <template><ProductCard :product="dt" /></template>
    </slide>

    <template #addons>
      <navigation />
    </template>
  </carousel>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import ProductCard from "./ProductCard.vue";
import { Carousel, Navigation, Slide } from "vue3-carousel";

export default {
  components: {
    Carousel,
    Slide,
    Navigation,
    ProductCard,
  },
  props: {
    data: Array,
    type: {
      type: String,
      default: "P",
    },
  },
  data() {
    return {
      settings: {
        itemsToShow: 1,
        snapAlign: "center",
      },
      breakpoints: {},

      mouseHover: false,
      timervar: "",
    };
  },
  methods: {
    timer() {
      this.timervar = setInterval(() => {
        if (this.mouseHover) return;

        document.getElementsByClassName('carousel__next')[0].click();
      }, 3000);
    },
  },
  created() {
    if (this.type === "B") {
      this.breakpoints = {
        300: {
          itemsToShow: 1,
          snapAlign: "center",
        },
      };

      this.timer();
    } else {

      this.breakpoints = {
        300: {
          itemsToShow: 2,
          snapAlign: "center",
        },
        700: {
          itemsToShow: 3,
          snapAlign: "center",
        },
        1024: {
          itemsToShow: 5,
          snapAlign: "start",
        },
      };
    }
  },
  unmounted() {
    clearInterval(this.timervar);
  },
};
</script>

<style>

.carousel__prev,
.carousel__next {
  background-color: #383f51;
  border: 5px solid #EDF2F7;
  width: 2.5rem;
  height: 2.5rem;
}
.carousel__prev:hover,
.carousel__next:hover {
  color: #f6222e;
}

</style>
