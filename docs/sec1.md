## **What's micro frontends?**

Breaking major features from a monolithic application into smaller codebases, each app being responsible for distinct features of the product.

This way they work as two completetly separate apps - and teams - and simpler codebases.

Prevent direct communication between the projects, it rather have a common place (API) to fetch from.

### **Project overview**

E-commerce store with 3 MFE - Container, ProductsList and Cart.
Container is responsible for choosing what and when to show the other MFEs.

There is **3** types of integration (how MFE get assembled together):

- **Build-Time** (Compile time) -> Before container gets loaded in the browser it gets access to other MFE source codes.
- **Run-Time (Client side)** -> After container get loaded in the browser it gets access to other source codes.
- **Server Integration** -> While sending down JS to load up Container a srver decides on wether or not to include other MFE source code.

<br>

![Build, Time](/docs/assets/buildTimeInt.png)

- This looks like using a normal 3rd api library.
- Easy to setup and understand.
- Container has to be re-deployed every time Product List is updated (new version of npm package).
- Tightly couple container + ProductList.

<br>

![Run, Time](/docs/assets/RunTimeInt.png)
Deploy to a static file .js that is fetched after the container has been loaded in the browser.

- Can be deployed independetly at any time.
- Different versions can be deployed and Container chooses what to use (good for A/B).
- Tooling + Setup is more complicated.

<br>
Run-Time Integration using Webpack Module Federation -> Hardest to setup but most flexible and perfomant solution.
<br>
<br>

# **Webpack**

![Webpack](/docs/assets/webpack.png)
<br>

![Webpack](/docs/assets/WebPackJS.png)

- With HTML webpack it makes automatic to get the output js files and call them into the HTML]
- With this all outputs will be loaded correctly and automaticly into the index.html

```plugins: [
new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
```

## **Module Federation**

![Webpack](/docs/assets/IntegrationModuleFed.png)

- Host is the **container** and remote is **products**;
- Products will make _index.js_ available to other projects;
- ```
    // In the webpack for products
    new ModuleFederationPlugin({
    name: 'products',
    filename: 'remoteEntry.js',
    exposes: {
                './ProductsIndex' : './src/index.js'
            }
    })
  ```
- The container will get access to products index.js;
- ```
    // Inside host container
    new ModuleFederationPlugin({
            name: 'container',
            remotes: {
                products: 'products@http://localhost:8081/remoteEntry.js'
            }
        }),
  ```
- In host refactor to use a boostrap file and import the products/ProductIndex

**Development Process**

![Webpack](/docs/assets/DevelopmentProcess.png)

- Index.html are only used during their own development. While index.html for **container** is use during development+production.

<br>

## Using Shared Modules

Currently Cart and Products make use of Faker =>

With **Module Federation Plugin** we can make it fetch only once.
Container will notices that both require Faker and choose to load only copy from either Cart or Products and then share the single copy.

```
// Adding shared in both webpack config
 new ModuleFederationPlugin({
            name: 'cart',
            filename: 'remoteEntry.js',
            exposes: {
                './CartShow': './src/index.js'
            },
            shared: ['faker']
        }),
```

But when trying to use the Product project standalone it shows:

`Uncaught Error: Shared module is not available for eager consumption: webpack/sharing/consume/default/faker/faker`

That happens because when it marked as shared **it loaded async** so it's not avaiable before the remoteEntry.js (unlike when running the container).

**Async Loading Script**

Adding a bootstrap.js file and then calling it on the index.js so the project knows it has to be loaded async and is able to fetch what it needs before it runs.

<br>

**This way the project share the very SAME copy of the Faker, but what if one of them change the version?**

The Module Federation Plugin takes care of it. It looks inside the package.json versions for each dependency and only and check if it matches are able to be shared. _E.g: ^4.1.0 and 4.6 MATCH but 4.1 and 5.1 no._

<br>

**Singleton Loading**

With singleton it only load one single copy of it no matter what. It's important for dependencies like **React**.

If versions aren't loaded as expected (Different version + Singleton) it throws a warning in the console.

```
 shared: {
            faker: {
                singleton: true
            }
        }
```

**Sub-App execution Context**

**Context/Situation #1**

We're running this file in development in isolation

Local index.html which defintely has an div with id dev-products

We want to render our into that element.

**Situation #2**

We're running this file in dev or production throught container app.

No guarantee that an element with that id of 'dev-products'

We DON'T want to immeddiately render the app (it might break)

Solution:

```
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

```

```
# Situation 1
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
```
