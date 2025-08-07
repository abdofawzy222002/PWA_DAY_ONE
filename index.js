const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
btn1.addEventListener("click", function () {
  async function fetchProducts() {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      console.log(data);
      const dropDown = document.getElementById("dropdown");
      dropDown.innerHTML = `<option value="">Select a product from the List </option>`;
      data.forEach((product) => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.title;
        dropDown.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
  fetchProducts();
});

btn2.addEventListener("click", function () {
  async function fetchProductDetails() {
    try {
      const option = document.getElementById("dropdown").selectedOptions[0];
      const productId = option.value;
      const response = await fetch(
        `https://fakestoreapi.com/products/${productId}`
      );
      const product = await response.json();
      console.log(product);
      document.getElementById("productDetails").innerHTML = `
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <img src="${product.image}">
        `;
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  }
  fetchProductDetails();
});
