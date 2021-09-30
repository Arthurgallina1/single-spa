import faker from 'faker'

// el = html element
const mount = (el) => {
  let products = ''

  for (let i = 0; i < 5; i++) {
    const name = faker.commerce.productName()
    products += `${name}<br>`
  }

  el.innerHTML = products
  //if react
  //React.render(<App />, el);
}

// Situation #1
//check if in dev mod
if (process.env.NODE_ENV === 'development') {
    //make sure if we're on isolation or in container
    const el = document.querySelector('#dev-products-dev')
    //this assumes container doesn't have this same id
    if (el) {
        mount(el)
    }
}

// Situation #2
export { mount } //Container can import the mount and decides when/where to use it.
