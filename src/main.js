import App from './App.svelte'
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Products } from 'behaveplus-core'

const products = new Products.Product()

const app = new App({
  target: document.body,
  props: {
    products: products,
    title: 'Wildland Fire Portfolio',
    author: 'Collin D Bevins'
  }
})

export default app
