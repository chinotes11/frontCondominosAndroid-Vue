import { defineAsyncComponent } from 'vue'

const routes = [
  {
    name: 'Inicio',
    path: '/',
    component: () => import('pages/Inicio.vue')
  },
  {
    path: '/condominos',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      //{ path: '', component: () => import('pages/Index.vue') },
      { path: '/condominos/dashboard', component: () => import('pages/dashboard/Index'), meta: { requireLogin: true } }, 
      { path: '/condominos/flex', component: () => import('pages/dashboard/Flex'), meta: { requireLogin: true } }, 
      { path: '/condominos/perfil', component: () => import('pages/dashboard/Perfil'), meta: { requireLogin: true } }, 
      { path: '/condominos/pagos', component: () => import('pages/dashboard/Pagos'), meta: { requireLogin: true } }, 
      ///////////////////////////////////////////////////  
      { path: '/condominos/admin', component: () => import('pages/admin/Index'), meta: { requireLogin: true } },
      { path: '/condominos/calendariopagos', component: () => import('pages/admin/CalendarioPagos'), meta: { requireLogin: true } }
    ]
  },
  {
    name: 'LoginIn',
    path: '/login',
    component: () => import('pages/Login.vue')
  },
  {
    name: 'Register',
    path: '/register',
    component: () => import('pages/Register.vue')
  },
  {
    name: 'RegisterAsoc',
    path: '/registerasoc',
    component: () => import('pages/RegisterAsoc.vue')
  },
  {
    name: 'Activar',
    path: '/activar/:tok/:id/:toke',
    component: () => import('pages/Activar.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
