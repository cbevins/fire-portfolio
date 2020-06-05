/** @format */

import App from './App.svelte'
// import { Products } from 'behaveplus-core'
import { Product } from './products/Product.js'

const products = new Product()

const app = new App({
  target: document.body,
  props: {
    products: products,
    title: 'Wildland Fire Portfolio',
    author: 'Collin D Bevins'
  }
})

export default app
