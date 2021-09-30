import { mount as mountProducts } from 'products/ProductsIndex'
import { mount as mountCart } from 'cart/CartShow'

console.log('container bootstrap')

const productsContainer = document.querySelector('#products-app')
mountProducts(productsContainer)

const cartContainer = document.querySelector('#cart-app')
mountCart(cartContainer)