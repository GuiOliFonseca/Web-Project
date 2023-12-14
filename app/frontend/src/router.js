import { createRouter, createWebHistory } from 'vue-router';

import Login from './views/Login.vue';
import Register from './views/Register.vue';
import ConfirmRegister from './views/ConfirmRegister.vue';

import Home from './views/Home.vue';
import ShoppingCart from './views/ShoppingCart.vue';
import Profile from './views/Profile.vue';
import Users from './views/Users.vue';

import ProductSearch from './views/ProductSearch.vue';
import ProductGeneral from './views/ProductGeneral.vue';
import ProductRegistration from './views/ProductRegistration.vue';
import ProductAlteration from './views/ProductAlteration.vue';
import ProductSalesman from './views/ProductSalesman.vue';

import SalesmanMarket from './views/SalesmanMarket.vue';
import NotFound from './views/NotFound.vue';

import Orders from './views/Orders.vue';
import OrderDetails from './views/OrderDetails.vue';

import SaleDetails from './views/SaleDetails.vue';
import Sales from './views/Sales.vue';

const routes = [{
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { layout: 'empty' },
    },
    {
        path: '/cadastrar',
        name: 'Register',
        component: Register,
        meta: { layout: 'empty' }
    },
    {
        path: '/confirme',
        name: 'Confirm',
        component: ConfirmRegister,
        meta: { layout: 'empty' }
    },
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/busca',
        name: 'ProductSearch',
        component: ProductSearch
    },
    {
        path: '/perfil',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/produto/:id_product',
        name: 'ProductGeneral',
        component: ProductGeneral
    },
    {
        path: '/loja/:id_salesman',
        name: 'SalesmanMarket',
        component: SalesmanMarket
    },
    {
        path: '/produto/cadastrar',
        name: 'ProductRegistration',
        component: ProductRegistration
    },
    {
        path: '/produto/editar/:id',
        name: 'ProductAlteration',
        component: ProductAlteration
    },
    {
        path: '/carrinho',
        name: 'ShoppingCart',
        component: ShoppingCart,
    },
    {
        path: '/suas-compras',
        name: 'Orders',
        component: Orders
    },
    {
        path: '/suas-vendas',
        name: 'Sales',
        component: Sales
    },
    {
        path: '/suas-vendas/detalhes/:id',
        name: 'SaleDetails',
        component: SaleDetails
    },
    {
        path: '/suas-compras/detalhes/:id',
        name: 'OrderDetails',
        component: OrderDetails
    },
    {
        path: '/seus-produtos/',
        name: 'Products',
        component: ProductSalesman
    },
    {
        path: '/usuarios/',
        name: 'Users',
        component: Users
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
        meta: { layout: 'empty' }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition && to.name == 'ProductSearch') return savedPosition;
        else if (savedPosition && to.name == 'ProductSearch' && to.nome == from.name) return { top: 0, left: 0, x: 0, y: 0 }
        else return { x: 0, y: 0 }
    }
});

export default router;