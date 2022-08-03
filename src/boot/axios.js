import { boot } from 'quasar/wrappers'
import axios from 'axios'

let nomhref = window.location.href.indexOf(":8080");
let urlhref = window.location.href.substring(0,nomhref);
console.log(urlhref);

//const api = axios.create({ baseURL: 'http://localhost:8085/' })
const api = axios.create({ baseURL: `${urlhref}:8085/` })

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }
