<script>
import { defineComponent } from "vue";
import { Bar } from "vue3-chart-v2";

export default defineComponent({
  name: "NewUsersMonthly",
  extends: Bar,
  props: {
    data: Array,
    type: String
  },
  mounted() {
    // Overwriting base render method with actual data
    const fields = [];
    const values = [];

    for(let info of this.data){
      fields.push(this.type == 'M' ? info.month : info.year);
      values.push(info.orders);
    }
    this.renderChart(
      {
        labels: fields.reverse(), // Meses do ano corrspondente aos numeros
        datasets: [
          {
            label: this.type == 'M' ? "Novas Compras Mensalmente" :"Novas Compras Anualmente" ,
            backgroundColor: "#F29D00",
            data: values,
          },
        ],
      },
      {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    );
  },
});
</script>