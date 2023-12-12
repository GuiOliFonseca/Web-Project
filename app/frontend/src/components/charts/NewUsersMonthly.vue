<script>
import { defineComponent } from "vue";
import { Bar } from "vue3-chart-v2";

export default defineComponent({
  name: "NewUsersMonthly",
  extends: Bar,
  props: {
    data: Array
  },
  mounted() {
    // Overwriting base render method with actual data.
    const fields = [];
    const values = [];

    for(let info of this.data){
      fields.push(info.month);
      values.push(info.users);
    }
    this.renderChart(
      {
        labels: fields.reverse(), // Meses do ano corrspondente aos numeros
        datasets: [
          {
            label: "Novos usuários Mensalmente",
            backgroundColor: "#D73853",
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