<template>
  <div class="min-h-screen flex flex-col">
    <MessageCardFixed
      class="justify-center"
      :type="type"
      :message="message"
      :title="title"
    />
    <!-- Modal Deleção de Endereço-->
    <div
      :class="`modal ${
        !openDeleteAddress && 'opacity-0 pointer-events-none'
      } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
    >
      <div
        class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
      ></div>

      <div
        class="
          modal-container
          bg-white
          w-11/12
          lg:max-w-md
          mx-auto
          rounded
          shadow-lg
          z-50
          overflow-y-auto
        "
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-3">
            <p class="text-2xl font-bold text-red-800">Deletar endereço</p>
            <div
              class="modal-close cursor-pointer z-50"
              @click="openDeleteAddress = false"
            >
              <svg
                class="fill-current text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                />
              </svg>
            </div>
          </div>

          <!--Body-->
          <p class="my-4">
            Tem certeza que deseja deletar <b>{{ editAddress?.alias }}</b
            >?
          </p>

          <!--Footer-->
          <div class="flex justify-end pt-2">
            <button
              @click="openDeleteAddress = false"
              class="
                px-6
                py-3
                bg-transparent
                p-3
                rounded-lg
                text-red-800
                hover:bg-gray-100 hover:text-red-700
                mr-2
              "
            >
              Fechar
            </button>
            <form @submit.prevent="deleteAddress()">
              <button
                class="
                  px-6
                  py-3
                  bg-red-800
                  rounded-md
                  text-white
                  font-medium
                  tracking-wide
                  hover:bg-red-700
                "
              >
                Deletar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Edição de Endereço-->
    <div
      :class="`modal ${
        !openEditAddress && 'opacity-0 pointer-events-none'
      } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
    >
      <div
        class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
      ></div>

      <div
        class="
          modal-container
          bg-white
          w-11/12
          md:max-w-xl
          mx-auto
          rounded
          shadow-lg
          z-50
          overflow-y-auto
        "
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-3">
            <p class="text-2xl font-bold text-red-800">Editar endereço</p>
            <div
              class="modal-close cursor-pointer z-50"
              @click="openEditAddress = false"
            >
              <svg
                class="fill-current text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                />
              </svg>
            </div>
          </div>

          <!--Body-->
          <form @submit.prevent="saveAlterationsAddress()">
            <div class="flex-none md:flex md:space-x-4">
              <div class="w-full md:w-3/4 mb-4">
                <label
                  for="alias"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Apelido
                </label>
                <input
                  id="alias"
                  v-model="editAddress.alias"
                  name="alias"
                  type="text"
                  placeholder="Ex: Apartamento dos Pais"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  required
                />
              </div>
              <div class="w-full md:w-1/4 mb-4">
                <label
                  for="zipcode"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  CEP
                </label>
                <input
                  id="zipcode"
                  v-model="editAddress.zipcode"
                  name="zipcode"
                  type="text"
                  placeholder="XXXXX-XXX"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  required
                />
              </div>
            </div>
            <div class="flex-none md:flex md:space-x-4">
              <div class="w-full md:w-2/3 mb-4">
                <label
                  for="street"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Rua
                </label>
                <input
                  id="street"
                  v-model="editAddress.street"
                  name="street"
                  type="text"
                  placeholder="Ex: Rua Ipiranga"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  required
                />
              </div>
              <div class="w-full md:w-1/2 mb-4">
                <label
                  for="neigh"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Bairro
                </label>
                <input
                  id="neigh"
                  v-model="editAddress.neigh"
                  name="neigh"
                  type="text"
                  placeholder="Ex: Laranjeiras"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  required
                />
              </div>
            </div>
            <div class="flex-none md:flex md:space-x-4">
              <div class="w-full md:w-1/3 mb-4">
                <label
                  for="num"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Num
                </label>
                <input
                  id="num"
                  v-model="editAddress.num"
                  name="num"
                  type="text"
                  placeholder="Ex: 10"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  required
                />
              </div>
              <div class="w-full md:w-2/3 mb-4">
                <label
                  for="complement"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Complemento
                </label>
                <input
                  id="complement"
                  v-model="editAddress.complement"
                  name="complement"
                  type="text"
                  placeholder="Ex: 12 andar Bloco 1"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  required
                />
              </div>
            </div>
            <div class="flex-none md:flex md:space-x-4">
              <div class="w-full md:w-1/3 mb-4">
                <label
                  for="city"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Cidade
                </label>
                <input
                  id="city"
                  v-model="editAddress.city"
                  name="city"
                  type="text"
                  placeholder="Ex: Rio de Janeiro"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  required
                />
              </div>
              <div class="w-full md:w-1/3 mb-4">
                <label
                  for="state"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  UF
                </label>
                <select
                  v-model="editAddress.state"
                  required
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  name="state"
                >
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>
            </div>

            <!--Footer-->
            <div class="flex justify-end pt-2">
              <button
                type="button"
                @click="openEditAddress = false"
                class="
                  px-6
                  py-3
                  bg-transparent
                  p-3
                  rounded-lg
                  text-red-800
                  hover:bg-gray-100 hover:text-red-700
                  mr-2
                "
              >
                Fechar
              </button>
              <button
                class="
                  px-6
                  py-3
                  bg-red-800
                  rounded-md
                  text-white
                  font-medium
                  tracking-wide
                  hover:bg-red-700
                "
              >
                Atualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Cadastro de Endereço-->
    <div
      :class="`modal ${
        !openRegisterAddress && 'opacity-0 pointer-events-none'
      } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
    >
      <div
        class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
      ></div>

      <div
        class="
          modal-container
          bg-white
          w-11/12
          md:max-w-xl
          mx-auto
          rounded
          shadow-lg
          z-50
          overflow-y-auto
        "
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-3">
            <p class="text-2xl font-bold text-red-800">Adicionar endereço</p>
            <div
              class="modal-close cursor-pointer z-50"
              @click="openRegisterAddress = false"
            >
              <svg
                class="fill-current text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                />
              </svg>
            </div>
          </div>

          <!--Body-->
          <form @submit.prevent="createAddress()">
            <div class="flex-none md:flex md:space-x-4">
              <div class="w-full md:w-3/4 mb-4">
                <label
                  for="alias"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Apelido
                </label>
                <input
                  v-model="newAddress.alias"
                  name="alias"
                  type="text"
                  placeholder="Ex: Apartamento dos Pais"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  required
                />
              </div>
              <div class="w-full md:w-1/4 mb-4">
                <label
                  for="zipcode"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  CEP
                </label>
                <input
                  v-model="newAddress.zipcode"
                  name="zipcode"
                  type="text"
                  placeholder="XXXXX-XXX"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  required
                />
              </div>
            </div>
            <div class="flex-none md:flex md:space-x-4">
              <div class="w-full md:w-2/3 mb-4">
                <label
                  for="street"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Rua
                </label>
                <input
                  v-model="newAddress.street"
                  name="street"
                  type="text"
                  placeholder="Ex: Rua Ipiranga"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  required
                />
              </div>
              <div class="w-full md:w-1/2 mb-4">
                <label
                  for="neigh"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Bairro
                </label>
                <input
                  v-model="newAddress.neigh"
                  name="neigh"
                  type="text"
                  placeholder="Ex: Laranjeiras"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  required
                />
              </div>
            </div>
            <div class="flex-none md:flex md:space-x-4">
              <div class="w-full md:w-1/3 mb-4">
                <label
                  for="num"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Num
                </label>
                <input
                  v-model="newAddress.num"
                  name="num"
                  type="text"
                  placeholder="Ex: 10"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  required
                />
              </div>
              <div class="w-full md:w-2/3 mb-4">
                <label
                  for="complement"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Complemento
                </label>
                <input
                  v-model="newAddress.complement"
                  name="complement"
                  type="text"
                  placeholder="Ex: 12 andar Bloco 1"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  required
                />
              </div>
            </div>
            <div class="flex-none md:flex md:space-x-4">
              <div class="w-full md:w-1/3 mb-4">
                <label
                  for="city"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Cidade
                </label>
                <input
                  v-model="newAddress.city"
                  name="city"
                  type="text"
                  placeholder="Ex: Rio de Janeiro"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  required
                />
              </div>
              <div class="w-full md:w-1/3 mb-4">
                <label
                  for="state"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  UF
                </label>
                <select
                  v-model="newAddress.state"
                  required
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  name="state"
                >
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>
            </div>

            <!--Footer-->
            <div class="flex justify-end pt-2">
              <button
                @click="openRegisterAddress = false"
                type="button"
                class="
                  px-6
                  py-3
                  bg-transparent
                  p-3
                  rounded-lg
                  text-red-800
                  hover:bg-gray-100 hover:text-red-700
                  mr-2
                "
              >
                Fechar
              </button>
              <button
                class="
                  px-6
                  py-3
                  bg-red-800
                  rounded-md
                  text-white
                  font-medium
                  tracking-wide
                  hover:bg-red-700
                "
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Desativação de Conta-->
    <div
      :class="`modal ${
        !openDesactivateAccount && 'opacity-0 pointer-events-none'
      } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
    >
      <div
        class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
      ></div>

      <div
        class="
          modal-container
          bg-white
          w-11/12
          lg:max-w-md
          mx-auto
          rounded
          shadow-lg
          z-50
          overflow-y-auto
        "
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-3">
            <p class="text-2xl font-bold text-red-800">Desativar Conta</p>
            <div
              class="modal-close cursor-pointer z-50"
              @click="openDesactivateAccount = false"
            >
              <svg
                class="fill-current text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                />
              </svg>
            </div>
          </div>

          <!--Body-->
          <form @submit.prevent="desactavateAccount()">
            <p class="text-center text-5xl text-red-800">
              <i class="fas fa-radiation fa-spin"></i>
            </p>
            <p class="my-4">Tem certeza que deseja desativar sua conta?</p>
            <!--Footer-->
            <div class="flex justify-end pt-2">
              <button
                @click="openDesactivateAccount = false"
                class="
                  px-6
                  py-3
                  bg-transparent
                  p-3
                  rounded-lg
                  text-red-800
                  hover:bg-gray-100 hover:text-red-700
                  mr-2
                "
              >
                Cancelar
              </button>
              <button
                class="
                  px-6
                  py-3
                  bg-red-800
                  rounded-md
                  text-white
                  font-medium
                  tracking-wide
                  hover:bg-red-700
                "
              >
                Desativar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Início da Tela -->

    <div class="flex-grow px-6 pt-8 pb-2">
      <h1 class="text-2xl lg:text-5xl text-gray-800 lg:font-light mb-2">
        Perfil de usuário
      </h1>
      <div v-if="!loading" class="flex-none lg:flex lg:space-x-4 mb-12">
        <div class="w-full lg:w-2/3 bg-white mt-4 rounded-lg p-6">
          <div class="my-4 flex">
            <div>
              <span
                class="font-semibold"
                :class="mode === true ? 'text-red-800' : 'text-gray-600'"
              >
                {{ mode === true ? "Edição" : "Visualização" }}
              </span>
            </div>
            <div class="ml-auto">
              <label class="switch ml-left">
                <input type="checkbox" v-model="mode" />
                <span class="slider round"></span>
              </label>
            </div>
          </div>
          <form @submit.prevent="saveAlterationsUser()">
            <div class="flex-none md:flex md:space-x-4">
              <div class="w-full md:w-1/2 mb-4">
                <label
                  for="name"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Nome
                </label>
                <input
                  id="name"
                  v-model="editUser.name"
                  name="name"
                  type="text"
                  placeholder="Ex: João"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  :disabled="!mode"
                  required
                />
              </div>
              <div class="w-full md:w-1/2 mb-4">
                <label
                  for="surname"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Sobrenome
                </label>
                <input
                  id="surname"
                  v-model="editUser.surname"
                  name="surname"
                  type="text"
                  placeholder="Ex: Silva"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  :disabled="!mode"
                  required
                />
              </div>
            </div>
            <div class="w-full mb-4">
              <label
                for="email"
                class="
                  mb-1
                  text-xs
                  font-bold
                  sm:text-sm
                  tracking-wide
                  text-gray-600
                "
              >
                Email
              </label>
              <input
                id="email"
                v-model="editUser.email"
                name="email"
                type="email"
                placeholder="exemplo@exemplo.com"
                class="
                  text-sm
                  sm:text-sm
                  w-full
                  border
                  rounded
                  text-gray-800
                  placeholder-gray-500
                  focus:border-red-800 focus:outline-none
                  py-2
                  px-4
                "
                disabled
                required
              />
            </div>
            <div class="flex-none md:flex md:space-x-4">
              <div v-if="user.cnpj" class="w-full md:w-1/3 mb-4">
                <label
                  for="cnpj"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  CNPJ
                </label>
                <input
                  id="cnpj"
                  v-model="user.cnpj"
                  name="cnpj"
                  type="text"
                  placeholder="XX.XXX.XXX/XXXX-XX"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  disabled
                />
              </div>
              <div v-if="user.business_name" class="w-full md:w-2/3 mb-4">
                <label
                  for="business-name"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Nome da Loja
                </label>
                <input
                  id="business-name"
                  v-model="editUser.business_name"
                  name="business-name"
                  type="text"
                  placeholder="Loja do João"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  :disabled="true"
                />
              </div>
            </div>
            <div class="flex-none md:flex md:space-x-4">
              <div v-if="user.cpf" class="w-full md:w-1/3 mb-4">
                <label
                  for="cpf"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  CPF
                </label>
                <input
                  id="cpf"
                  v-model="user.cpf"
                  name="cpf"
                  type="text"
                  placeholder="XXX.XXX.XXX-XX"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  disabled
                />
              </div>
              <div class="w-full md:w-1/3 mb-4">
                <label
                  for="birthdate"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Nascimento
                </label>
                <input
                  id="birthdate"
                  v-model="user.birthdate"
                  name="birthdate"
                  type="text"
                  placeholder="00/00/0000"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  disabled
                  required
                />
              </div>
              <div class="w-full md:w-1/3 mb-4">
                <label
                  for="created-at"
                  class="
                    mb-1
                    text-xs
                    font-bold
                    sm:text-sm
                    tracking-wide
                    text-gray-600
                  "
                >
                  Entrou em
                </label>
                <input
                  id="created-at"
                  v-model="user.created_at"
                  name="created-at"
                  type="text"
                  placeholder="00/00/0000"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    px-4
                  "
                  disabled
                  required
                />
              </div>
            </div>
            <div v-if="mode">
              <button
                type="submit"
                class="
                  transition
                  duration-150
                  py-2
                  px-4
                  bg-red-800
                  hover:bg-red-800
                  text-white
                  font-bold
                  border-b-4 border-red-800
                  focus:outline-none
                  rounded
                  w-full
                  mt-6
                "
              >
                Salvar alterações
              </button>
            </div>
          </form>
          <div v-if="$store.state.user.user.type == 'V' && !createBankAccount">
            <hr class="text-gray-500 my-4" />
            <h2 class="text-xl lg:text-2xl text-gray-800 mb-2">
              Dados Bancários
            </h2>
            <div class="bg-gray-300 p-2 my-4 rounded-md">
              <span class="text-gray-600"
                ><b class="text-gray-700"
                  ><i class="fas fa-exclamation-triangle"></i> Atenção:</b
                >
                O valor arrecadado nas vendas será enviado para a conta bancária
                informada. Certifique-se de que os dados informados estão
                corretos!</span
              >
            </div>
            <div class="my-4 flex">
              <div>
                <span
                  class="font-semibold"
                  :class="modeBank === true ? 'text-red-800' : 'text-gray-600'"
                >
                  {{ modeBank === true ? "Edição" : "Visualização" }}
                </span>
              </div>
              <div class="ml-auto">
                <label class="switch ml-left">
                  <input type="checkbox" v-model="modeBank" />
                  <span class="slider round"></span>
                </label>
              </div>
            </div>

            <!-- Conta Bancária -->

            <form @submit.prevent="updateBank()">
              <div class="flex-none md:flex md:space-x-4 md:my-4">
                <div class="w-full md:w-1/2 my-4 md:my-0">
                  <label
                    class="block text-gray-600 text-sm font-bold mb-2"
                    for="holder"
                  >
                    Titular da Conta
                  </label>
                  <input
                    name="holder"
                    type="text"
                    placeholder="Informe o Nome do Titular"
                    required
                    v-model="bankAccount.holder"
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800 focus:outline-none
                      py-2
                      px-4
                    "
                    :disabled="!modeBank"
                  />
                </div>
                <div class="w-full md:w-1/2 my-4 md:my-0">
                  <label
                    class="block text-gray-600 text-sm font-bold mb-2"
                    for="agency"
                  >
                    Documento associado
                  </label>
                  <input
                    minlength="14"
                    id="document"
                    name="document"
                    @keyup="mDoc()"
                    v-model="bankAccount.document"
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800 focus:outline-none
                      py-2
                      px-4
                    "
                    disabled
                    placeholder="CPF / CNPJ"
                    required
                  />
                </div>
              </div>
              <div class="flex-none md:flex md:space-x-4 md:my-4">
                <div class="w-full md:w-1/2 my-4 md:my-0">
                  <label
                    class="block text-gray-600 text-sm font-bold mb-2"
                    for="bank"
                  >
                    Instituição Bancária
                  </label>
                  <select
                    :disabled="!modeBank"
                    v-model="bankAccount.id_bank"
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800 focus:outline-none
                      py-2
                      px-4
                    "
                  >
                    <option
                      v-for="bank in banks"
                      :key="bank.id"
                      :value="bank.id"
                    >
                      {{ bank.code }} - {{ bank.name }}
                    </option>
                  </select>
                </div>
                <div>

                </div>
                <div class="w-full md:w-1/2 my-4 md:my-0">
                  <label
                    class="block text-gray-600 text-sm font-bold mb-2"
                    for="agency"
                  >
                    Agência
                  </label>
                  <input
                    name="agency"
                    type="number"
                    placeholder="Informe a Agência"
                    required
                    v-model="bankAccount.agency"
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800 focus:outline-none
                      py-2
                      px-4
                    "
                    :disabled="!modeBank"
                  />
                </div>
                <div class="w-full md:w-1/12 my-4 md:my-0">
                  <label
                    class="block text-gray-600 text-sm font-bold mb-2"
                    for="account"
                  >
                    Dígito
                  </label>
                  <input
                    value=""
                    name="agency_dv"
                    type="text"
                    minlength="1"
                    maxlength="1"
                    placeholder="Informe o dígito da conta"
                    v-model="bankAccount.agency_dv"
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800 focus:outline-none
                      py-2
                      px-4
                    "
                    :disabled="!modeBank"
                  />
                </div>
              </div>
              <div class="flex-none md:flex md:space-x-4 md:my-4">
                <div class="w-full md:w-6/12 my-4 md:my-0">
                  <label
                    class="block text-gray-600 text-sm font-bold mb-2"
                    for="account"
                  >
                    Número da Conta
                  </label>
                  <input
                    name="account"
                    type="number"
                    placeholder="Informe o número da conta"
                    required
                    v-model="bankAccount.account"
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800 focus:outline-none
                      py-2
                      px-4
                    "
                    :disabled="!modeBank"
                  />
                </div>
                <div class="w-full md:w-1/12 my-4 md:my-0">
                  <label
                    class="block text-gray-600 text-sm font-bold mb-2"
                    for="account"
                  >
                    Dígito
                  </label>
                  <input
                    name="digit"
                    type="text"
                    minlength="1"
                    maxlength="1"
                    placeholder="Informe o número da conta"
                    required
                    v-model="bankAccount.account_dv"
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800 focus:outline-none
                      py-2
                      px-4
                    "
                    :disabled="!modeBank"
                  />
                </div>
                <div class="w-full md:w-1/2 my-4 md:my-0">
                  <label
                    class="block text-gray-600 text-sm font-bold mb-2"
                    for="account_type"
                  >
                    Tipo da conta
                  </label>
                  <select
                    v-model="bankAccount.type"
                    name="account_type"
                    required
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800 focus:outline-none
                      py-2
                      px-4
                    "
                    :disabled="!modeBank"
                  >
                    <option value="CCI" selected>
                      Conta Corrente Individual
                    </option>
                    <option value="CCJ">Conta Corrente Conjunta</option>
                    <option value="CPI">Conta Poupança Individual</option>
                    <option value="CPJ">Conta Poupança Conjunta</option>
                  </select>
                </div>
              </div>
              <div v-if="modeBank">
                <button
                  type="submit"
                  class="
                    transition
                    duration-150
                    py-2
                    px-4
                    bg-red-800
                    hover:bg-red-800
                    text-white
                    font-bold
                    border-b-4 border-red-800
                    focus:outline-none
                    rounded
                    w-full
                    mt-6
                  "
                >
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
          <div
            v-else-if="
              createBank &&
              $store.state.user.user.type != 'C' &&
              $store.state.user.user.type != 'A'
            "
          >
            <hr class="text-gray-500 my-4" />
            <h2 class="text-xl lg:text-2xl text-gray-800 mb-2">
              Dados Bancários
            </h2>
            <div class="bg-gray-300 p-2 my-4 rounded-md">
              <span class="text-gray-600"
                ><b class="text-gray-700"
                  ><i class="fas fa-exclamation-triangle"></i> Atenção:</b
                >
                O valor arrecadado nas vendas será enviado para a conta bancária
                informada. Certifique-se de que os dados informados estão
                corretos!</span
              >
            </div>

            <!-- Conta Bancária -->

            <form @submit.prevent="createBank()">
              <div class="flex-none md:flex md:space-x-4 md:my-4">
                <div class="w-full md:w-1/2 my-4 md:my-0">
                  <label
                    class="block text-gray-600 text-sm font-bold mb-2"
                    for="holder"
                  >
                    Titular da Conta
                  </label>
                  <input
                    name="holder"
                    type="text"
                    placeholder="Informe o Nome do Titular"
                    required
                    v-model="bankAccount.holder"
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800 focus:outline-none
                      py-2
                      px-4
                    "
                  />
                </div>
                <div class="w-full md:w-1/2 my-4 md:my-0">
                  <label
                    class="block text-gray-600 text-sm font-bold mb-2"
                    for="agency"
                  >
                    Documento associado
                  </label>
                  <input
                    minlength="14"
                    id="document"
                    name="document"
                    @keyup="mDoc()"
                    v-model="bankAccount.document"
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800 focus:outline-none
                      py-2
                      px-4
                    "
                    placeholder="CPF / CNPJ"
                    required
                  />
                </div>
              </div>
              <div class="flex-none md:flex md:space-x-4 md:my-4">
                <div class="w-full md:w-1/2 my-4 md:my-0">
                  <label
                    class="block text-gray-600 text-sm font-bold mb-2"
                    for="bank"
                  >
                    Instituição Bancária
                  </label>
                  <select
                    v-model="bankAccount.id_bank"
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800 focus:outline-none
                      py-2
                      px-4
                    "
                  >
                    <option
                      v-for="bank in banks"
                      :key="bank.id"
                      :value="bank.id"
                    >
                      {{ bank.name }} - {{ bank.code }}
                    </option>
                  </select>
                </div>
                <div class="w-full md:w-1/2 my-4 md:my-0">
                  <label
                    class="block text-gray-600 text-sm font-bold mb-2"
                    for="agency"
                  >
                    Agência
                  </label>
                  <input
                    name="agency"
                    type="number"
                    placeholder="Informe a Agência"
                    required
                    v-model="bankAccount.agency"
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800 focus:outline-none
                      py-2
                      px-4
                    "
                  />
                </div>
              </div>
              <div class="flex-none md:flex md:space-x-4 md:my-4">
                <div class="w-full md:w-6/12 my-4 md:my-0">
                  <label
                    class="block text-gray-600 text-sm font-bold mb-2"
                    for="account"
                  >
                    Número da Conta
                  </label>
                  <input
                    name="account"
                    type="number"
                    placeholder="Informe o número da conta"
                    required
                    v-model="bankAccount.account"
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800 focus:outline-none
                      py-2
                      px-4
                    "
                  />
                </div>
                <div class="w-full md:w-1/12 my-4 md:my-0">
                  <label
                    class="block text-gray-600 text-sm font-bold mb-2"
                    for="account"
                  >
                    Dígito
                  </label>
                  <input
                    name="account"
                    type="text"
                    minlength="1"
                    maxlength="1"
                    placeholder="Dígito"
                    required
                    v-model="bankAccount.account_dv"
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800 focus:outline-none
                      py-2
                      px-4
                    "
                  />
                </div>
                <div class="w-full md:w-5/12 my-4 md:my-0">
                  <label
                    class="block text-gray-600 text-sm font-bold mb-2"
                    for="account_type"
                  >
                    Tipo da conta
                  </label>
                  <select
                    v-model="bankAccount.type"
                    name="account_type"
                    required
                    class="
                      text-sm
                      sm:text-sm
                      w-full
                      border
                      rounded
                      text-gray-800
                      placeholder-gray-500
                      focus:border-red-800 focus:outline-none
                      py-2
                      px-4
                    "
                  >
                    <option value="CCI" selected>
                      Conta Corrente Individual
                    </option>
                    <option value="CCJ">Conta Corrente Conjunta</option>
                    <option value="CPI">Conta Poupança Individual</option>
                    <option value="CPJ">Conta Poupança Conjunta</option>
                  </select>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  class="
                    transition
                    duration-150
                    py-2
                    px-4
                    bg-red-800
                    hover:bg-red-800
                    text-white
                    font-bold
                    border-b-4 border-red-800
                    focus:outline-none
                    rounded
                    w-full
                    mt-6
                  "
                >
                  Criar conta bancária
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="w-full lg:w-1/3 bg-white mt-4 rounded-lg p-6">
          <h4 class="text-lg lg:text-xl text-gray-800 mb-4">Endereços</h4>
          <div class="overflow-y-auto h-80">
            <template v-if="!notAddress">
              <div
                v-for="(address, index) in addresses"
                :key="index"
                class="bg-gray-200 rounded-lg mr-2 p-4 flex mb-3"
              >
                <p class="text-gray-600 truncate mr-4 my-auto align-middle">
                  {{ address.alias }}
                </p>
                <div class="ml-auto text-red-800">
                  <button @click="modalEdit(index)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <br />
                  <button
                    v-if="$store.state.user.user.type != 'V'"
                    @click="modalDelete(index)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div
                v-if="$store.state.user.user.type != 'V'"
                class="mt-5 rounded"
                align="center"
              >
                <div
                  @click="openRegisterAddress = true"
                  class="
                    cursor-pointer
                    mt-4
                    rounded-lg
                    w-24
                    h-24
                    border border-solid border-red-800
                    font-normal
                    text-red-800
                  "
                >
                  <p class="text-center mt-5 mb-1 w-full">Adicionar</p>
                  <p class="text-center">
                    <i
                      class="
                        fas
                        fa-map-marked-alt
                        text-red-800 text-center text-2xl text-light
                      "
                    ></i>
                  </p>
                </div>
              </div>
            </template>
            <div class="mt-5 rounded" align="center" v-else>
              <p>Nenhum endereço cadastrado ainda.</p>
              <div
                @click="openRegisterAddress = true"
                class="
                  cursor-pointer
                  mt-4
                  rounded-lg
                  w-24
                  h-24
                  border border-solid border-red-800
                  font-normal
                  text-red-800
                "
              >
                <p class="text-center mt-5 mb-1 w-full">Adicionar</p>
                <p class="text-center">
                  <i
                    class="
                      fas
                      fa-map-marked-alt
                      text-red-800 text-center text-2xl text-light
                    "
                  ></i>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg">
        <h2 class="text-xl lg:text-2xl text-gray-800 mb-2">Desativar Conta</h2>
        <div class="my-8 p-2 bg-red-800 rounded-md">
          <p class="text-white">
            <span class="text-xl"><i class="fas fa-radiation fa-spin"></i></span
            > Caso deseje remover sua conta, entre em <a href="mailto:contato@istonesapp.com.br"><strong>contato</strong></a>.
          </p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from "../components/Footer.vue";
import MessageCardFixed from "../components/MessageCardFixed.vue";

import { mapActions } from "vuex";

import Salesman from "../services/Salesman";
import Client from "../services/Client";
import User from "../services/User";
import Address from "../services/Address";
import Bank from "../services/Bank";
import BankAccount from "../services/BankAccount";

export default {
  data() {
    return {
      mode: false,
      modeBank: false,
      user: {
        name: "",
        surname: "",
        email: "",
        cnpj: "",
        cpf: "",
        business_name: "",
        created_at: "",
        birthdate: undefined,
      },

      bankAccount: {
        id_bank: "",
        agency: "",
        agency_dv: "",
        account: "",
        account_dv: "",
        type: "",
        holder: "",
      },
      editUser: {
        name: "",
        surname: "",
        email: "",
        business_name: "",
      },

      title: "",
      type: "none",
      message: "",

      editAddress: {
        alias: undefined,
        id: undefined,
        zipcode: undefined,
        street: undefined,
        neigh: undefined,
        complement: undefined,
        city: undefined,
        state: undefined,
        country: undefined,
        num: undefined,
      },

      newAddress: {
        alias: undefined,
        id: undefined,
        zipcode: undefined,
        street: undefined,
        neigh: undefined,
        complement: undefined,
        city: undefined,
        state: undefined,
        country: undefined,
        num: undefined,
      },

      notAddress: false,

      openDeleteAddress: false,
      openEditAddress: false,
      openRegisterAddress: false,

      openDesactivateAccount: false,

      addresses: [],

      createBankAccount: false,

      loading: true,
    };
  },
  methods: {
    ...mapActions(["logout"]),
    async createBank() {
      const result = await BankAccount.create({
        ...this.bankAccount,
        id_salesman: this.$store.state.user.user.id_salesman,
      });
  
      if (result.success) {
        this.setMessage(
          "Sucesso!",
          "success",
          "Conta cadastrada com sucesso!",
          3000
        );
        this.createBankAccount = false;
      } else this.setMessage("Erro!", "error", result.message, 3000);
    },
    mDoc() {
      let doc = this.bankAccount.document;

      if (doc.length > 14) {
        doc = doc.replace(/\D+/g, "");
        doc = doc.replace(/^(\d{2})(\d)/, "$1.$2");
        doc = doc.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        doc = doc.replace(/\.(\d{3})(\d)/, ".$1/$2");
        doc = doc.replace(/(\d{4})(\d)/, "$1-$2");
      } else {
        doc = doc.replace(/\D/g, "");
        doc = doc.replace(/(\d{3})(\d)/, "$1.$2");
        doc = doc.replace(/(\d{3})(\d)/, "$1.$2");
        doc = doc.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      }

      this.bankAccount.document = doc;
    },
    async updateBank() {
      const result = await BankAccount.update(this.bankAccount);

      if (result.success) {
        this.setMessage(
          "Sucesso!",
          "success",
          "Conta editada com sucesso!",
          3000
        );
        this.modeBank = false;
      } else this.setMessage("Erro!", "error", result.message, 3000);
    },
    setMessage(title, type, message, miliseconds) {
      this.message = message;
      this.type = type;
      this.title = title;
      setTimeout(() => {
        this.type = "none";
      }, miliseconds);
    },
    async saveAlterationsUser() {
      const { name, surname, business_name } = this.editUser;

      let data = {
        name,
        surname,
      };

      let result;
      if (this.user.type == "V") {
        data["id"] = this.user.id_salesman;
        result = await Salesman.update(data);
      } else if (this.user.type == "C") {
        //console.log("EWntrou");
        data["id_client"] = this.user.id_client;
        result = await Client.update(data);
      } else {
        data["id"] = this.user.id;
        result = await User.update(data);
      }

      //console.log(data, this.user);

      result.success
        ? this.setMessage("Sucesso!", "success", "Perfil atualizado!", 3000)
        : this.setMessage("Erro!", "error", result.message, 3000);
      this.mode = false;
    },
    async saveAlterationsAddress() {
      let data = {
        alias: this.editAddress.alias,
        id: this.editAddress.id,
        zipcode: this.editAddress.zipcode.replace("-", ""),
        street: this.editAddress.street,
        neigh: this.editAddress.neigh,
        complement: this.editAddress.complement,
        city: this.editAddress.city,
        state: this.editAddress.state,
        num: this.editAddress.num,
      };

      const result = await Address.update(data);

      if (result.success) {
        this.addresses = this.addresses.map((address) => {
          if (address.id == data.id) return result.address;
          else return;
        });
        this.setMessage("Sucesso!", "success", "Endereço atualizado!", 3000);
      } else {
        this.setMessage("Erro!", "error", "Endereço não atualizado!", 3000);
      }
      this.openEditAddress = false;
    },
    async createAddress() {
      this.newAddress.zipcode = this.newAddress.zipcode.replace("-", "");
      const result = await Address.create({
        ...this.newAddress,
        country: "BR",
        id_user: this.$store.state.user.user.id_user,
      });

      if (result.success) {
        this.addresses.push(result.address);
        this.setMessage("Sucesso!", "success", "Endereço cadastrado!", 3000);
        this.notAddress = false;
      } else this.setMessage("Erro!", "error", result.message, 3000);
      this.openRegisterAddress = false;

      this.newAddress = {
        alias: undefined,
        id: undefined,
        zipcode: undefined,
        street: undefined,
        neigh: undefined,
        complement: undefined,
        city: undefined,
        state: undefined,
        country: undefined,
        num: undefined,
      };
    },
    async deleteAddress() {
      const result = await Address.destroy(this.editAddress.id);
      //console.log(result);
      if (result.success) {
        this.addresses = this.addresses.filter(
          (address) => address.id != this.editAddress.id
        );
        this.setMessage("Sucesso!", "success", "Endereço apagado!", 3000);
      } else this.setMessage("Erro!", "error", "Endereço não apagado!", 3000);
      this.openDeleteAddress = false;

      if (!this.addresses.length) this.notAddress = true;
    },
    modalDelete(id) {
      this.editAddress.id = this.addresses[id].id;
      this.editAddress.alias = this.addresses[id].alias;

      this.openDeleteAddress = true;
    },
    modalEdit(id) {
      this.editAddress = { ...this.addresses[id] };

      this.openEditAddress = true;
    },
    modalDesactivateAccount() {
      this.openDesactivateAccount = true;
    },
    mCPF(cpf) {
      cpf = cpf.replace(/\D/g, "");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      return cpf;
    },
    mCNPJ(cnpj) {
      cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
      cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2");
      cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2");
      return cnpj;
    },
    formatUserData() {
      this.user.cpf ? (this.user.cpf = this.mCPF(this.user.cpf)) : undefined;
      this.user.cnpj
        ? (this.user.cnpj = this.mCNPJ(this.user.cnpj))
        : undefined;

      let birth = new Date(this.user.birthdate);
      birth = birth.toLocaleDateString("pt-BR");
      let join = new Date(this.user.created_at);
      join = join.toLocaleDateString("pt-BR");
      this.user.birthdate = birth;
      this.user.created_at = join;
    },
    async desactavateAccount() {
      let result;
      if (this.$store.state.user.user.type == "V") {
        result = await Salesman.destroy(
          this.$store.state.user.user.id_salesman
        );
      } else if (this.$store.state.user.user.type == "C") {
        result = await Client.destroy(this.$store.state.user.user.id_client);
      } else
        return this.setMessage(
          "Erro!",
          "error",
          "Administradores não podem apagar suas contas!",
          3000
        );

      //console.log(result);
      if (result.success) {
        this.setMessage(
          "Sucesso!",
          "success",
          "Sua conta foi apagada, deslogando..."
        );
        await this.$store.dispatch("logout");
        return this.$router.push("/login");
      } else this.setMessage("Erro!", "error", result.message, 3000);
    },
  },
  components: {
    Footer,
    MessageCardFixed,
  },
  async created() {
    if (!this.$store.state.login.login.isLogged)
      return this.$router.push("/login");
    const type = this.$store.state.user.user.type;

    let user;

    if (this.$store.state.user.user.type == "V") {
      user = await Salesman.getSalesmanById(
        this.$store.state.user.user.id_salesman
      );
      if (!user.salesman.id_bank_account) this.createBankAccount = true;
      else {
        const bankAccount = await BankAccount.getBankAccountByIdSalesman(
          user.salesman.id_salesman
        );
        if (bankAccount.success) {
          console.log(bankAccount.bankAccount);
          this.bankAccount = bankAccount.bankAccount;
          delete this.bankAccount.created_at;
          delete this.bankAccount.id_rec_bank_account;
          delete this.bankAccount.id_recipient;
          delete this.bankAccount.is_deleted;
          delete this.bankAccount.updated_at;
          delete this.bankAccount.id_salesman;
          this.bankAccount.id_bank_account = this.bankAccount.id;
          delete this.bankAccount.id;

          //console.log(this.bankAccount);
        } else return this.$router.push("/");
      }
    } else if (this.$store.state.user.user.type == "C")
      user = await Client.getClientById(this.$store.state.user.user.id_client);
    else user = await User.getUserById(this.$store.state.user.user.id_user);
    this.user = user[Object.keys(user)[1]];

    if (!user.success) {
      await this.$store.dispatch("logout");
      this.$router.push("/login");
      return;
    }

    this.editUser.name = this.user.name;
    this.editUser.surname = this.user.surname;
    this.editUser.email = this.user.email;
    this.user.business_name
      ? (this.editUser.business_name = this.user.business_name)
      : undefined;

    this.formatUserData();

    const banks = await Bank.getAll();
    if (!banks.success) this.$router.push("/");
    this.banks = banks.bank;

    const addresses = await Address.getAll(this.$store.state.user.user.id_user);
    addresses.success
      ? (this.addresses = addresses.address.data)
      : (this.notAddress = true);

    this.loading = false;
  },
  watch: {
    async "editAddress.zipcode"(newCep, oldCep) {
      if (newCep.length == 8) {
        newCep = newCep.substring(0, 5) + "-" + newCep.substring(5);
        const addr = await Address.getCEPInfo(newCep);
        this.editAddress.zipcode = newCep;
        //console.log(addr);
        if (addr.success) {
          addr.cep.logradouro
            ? (this.editAddress.street = addr.cep.logradouro)
            : undefined;
          addr.cep.bairro
            ? (this.editAddress.neigh = addr.cep.bairro)
            : undefined;
          addr.cep.localidade
            ? (this.editAddress.city = addr.cep.localidade)
            : undefined;
          addr.cep.uf ? (this.editAddress.state = addr.cep.uf) : undefined;
        }
      } else if (newCep.length > 9) {
        this.editAddress.zipcode = oldCep;
      }
    },
    async "newAddress.zipcode"(newCep, oldCep) {
      if (newCep && newCep.length == 8) {
        newCep = newCep.substring(0, 5) + "-" + newCep.substring(5);
        const addr = await Address.getCEPInfo(newCep);
        this.newAddress.zipcode = newCep;
        //console.log(addr);
        if (addr.success) {
          addr.cep.logradouro
            ? (this.newAddress.street = addr.cep.logradouro)
            : undefined;
          addr.cep.bairro
            ? (this.newAddress.neigh = addr.cep.bairro)
            : undefined;
          addr.cep.localidade
            ? (this.newAddress.city = addr.cep.localidade)
            : undefined;
          addr.cep.uf ? (this.newAddress.state = addr.cep.uf) : undefined;
        }
      } else if (newCep && newCep.length > 9) {
        this.editAddress.zipcode = oldCep;
      }
    },
  },
};
</script>

<style>
/* The switch - the box around the slider */
.h-80 {
  height: 22rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #e53e3e;
}

input:focus + .slider {
  box-shadow: 0 0 1px #e53e3e;
}

input:checked + .slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
