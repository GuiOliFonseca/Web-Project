<script>
import { defineComponent } from "vue";
import { Pie } from "vue3-chart-v2";

export default defineComponent({
  name: "UserTypes",
  extends: Pie,
  props: {
    data: Array
  },

  mounted() {
    //console.log(this.data)
    const fields = [];
    const values = [];

    for(let info of this.data){
      fields.push(info.type);
      values.push(info.quantity);
    }

    // Overwriting base render method with actual data.
    this.renderChart({
      labels: fields,
      datasets: [
        {
          label: "Tipos de Usuário",
          backgroundColor: ["#f87979", "#6D68CF", "#92F890"],
          data: values,
        },
      ],
    });
  },
});
</script>