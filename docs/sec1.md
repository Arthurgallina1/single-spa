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
