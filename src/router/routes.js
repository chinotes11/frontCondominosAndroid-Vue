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
      ///////////////////////////////////////////////////  Administración
      { path: '/condominos/admin', component: () => import('pages/admin/Index'), meta: { requireLogin: true } },
      { path: '/condominos/calendariopagos', component: () => import('pages/admin/CalendarioPagos'), meta: { requireLogin: true } },
      { path: '/condominos/admincatalogos', component: () => import('pages/admin/AdminCatalogos'), meta: { requireLogin: true } },
      { path: '/condominos/documentos', component: () => import('pages/admin/Documentos'), meta: { requireLogin: true } },
      { path: '/condominos/avisos', component: () => import('pages/admin/Avisos'), meta: { requireLogin: true } },
    ]
  },
  ///////Pagina de Login
  {
    name: 'LoginIn',
    path: '/login',
    component: () => import('pages/Login.vue')
  },
  ///////Pagina de Registro de usuarios
  {
    name: 'Register',
    path: '/register',
    component: () => import('pages/Register.vue')
  },
  ///////Pagina de Registro de Condominio
  {
    name: 'RegisterAsoc',
    path: '/registerasoc',
    component: () => import('pages/RegisterAsoc.vue')
  },
  //Pagina para activar cuenta de usuario
  {
    name: 'Activar',
    path: '/activar/:tok/:id/:toke',
    component: () => import('pages/Activar.vue')
  },
  // Pagina de error
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
