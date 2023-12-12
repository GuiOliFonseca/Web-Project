<template>
    <div>
        <div class="w-full text-center text-white bg-gray-900 p-8 mt-5 inset-x-0 bottom-0 px-0">
            <p align="center"><img class="object-center w-32 mb-2" src="https://system-photos.s3.sa-east-1.amazonaws.com/iStones-Logo.svg"><b>iStones</b> Rochas Ornamentais <span class="text-red-800">{{year}}</span></p>
            <p class="text-xs"><a href="https://api.whatsapp.com/send?phone=5527999722749&text=Ol%C3%A1%20iStones!%20Podemos%20conversar%3F">Telefone: (27) 99972-2749</a></p>
            <p class="text-xs"><a mailto="contato@istonesapp.com.br">E-mail: contato@istonesapp.com.br</a></p>
            <p class="text-xs">CNPJ: 38.095.387/0001-80</p> 
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            year: "Ano atual"
        }
    },
    created(){
        const date = new Date();
        this.year = date.getFullYear();
    }
}
</script>