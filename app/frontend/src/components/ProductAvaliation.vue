<template>
    <div>
        <h1 class="text-3xl lg:text-5xl text-gray-800 font-light mb-2">Avaliações</h1>
        <!-- Replicar -->
        <template v-if="avaliations.length">
            <div v-for="avaliation in avaliations" :key="avaliation.id" class="bg-white rounded-lg my-4 p-4 text-gray-600">
                <p class="mb-2">{{new Date(avaliation.created_at).toLocaleString().substr(0,10)}} |
                    <span v-if="avaliation.liked == 'L'" class="text-xl"> <i class="fas fa-thumbs-up"></i></span>
                    <span v-else class="text-xl"> <i class="fas fa-thumbs-down"></i></span>
                </p>
                <p>{{avaliation.comment}}</p>
            </div>
        </template>
        <div v-else class="bg-white rounded-lg my-4 p-4 text-gray-600">
            <p class="mb-2"> Ainda não há avaliações para esse produto! </p>
         </div>
    </div>
</template>

<script>
export default {
    props: {
        avaliations: {
            required: true,
            type: Array
        }
    }
}
</script>