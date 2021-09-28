import faker from 'faker'

const cartText = `
<div> You have ${faker.datatype.number()} items in your cart
</div>
`

document.getElementById('dev-cart').innerHTML = cartText;