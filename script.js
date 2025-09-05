let currentUser = null;

function register() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const address = document.getElementById("regAddress").value;
  const postal = document.getElementById("regPostal").value;

  const userData = { name, email, password, address, postal };
  localStorage.setItem("trustbuy_user_" + email, JSON.stringify(userData));
  alert("Registered successfully! Please login.");
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const stored = localStorage.getItem("trustbuy_user_" + email);
  if (!stored) return alert("No user found!");
  const userData = JSON.parse(stored);
  if (userData.password !== password) return alert("Incorrect password!");
  currentUser = userData;
  alert("Logged in as " + currentUser.name);
  showSection('buy');
}

function showSection(id) {
  sections.forEach(sec => {
    sec.classList.remove('active');
    sec.classList.add('hidden');
  });
  const section = document.getElementById(id);
  section.classList.remove('hidden');
  section.classList.add('active');

  if (!currentUser && id !== 'auth') {
    alert("Please log in first.");
    showSection('auth');
    return;
  }

  if (id === 'profile') {
    document.getElementById('userInfo').innerHTML = `<p>Name: ${currentUser.name}</p><p>Email: ${currentUser.email}</p>`;
  }

  if (id === 'orders') {
    renderOrders();
  }

  if (id === 'cart') {
    renderCart();
  }

  if (id === 'buy') {
    renderProducts();
  }
}

const sections = document.querySelectorAll('.section');
let cart = [];
let orders = [];
products = [
  {
    name: "iPhone 13",
    price: 599,
    seller: "Alice",
    image: "https://tse1.mm.bing.net/th/id/OIP.wgauSbRtaJqfDyP4ohO_PAHaFA?rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "This iPhone 13 is in excellent condition, strong battery, sharp camera, and smooth performance for all your needs."
  },
  {
    name: "MacBook Air",
    price: 999,
    seller: "Bob",
    image: "https://cdn.mos.cms.futurecdn.net/Mqn4Ck4BndEpuKXAY6ofyE.jpg",
    description: "Lightweight MacBook Air with long battery life, perfect for studying and mobile work, looks like new."
  },
  {
    name: "Used Physics Book",
    price: 15,
    seller: "Charlie",
    image: "https://tse3.mm.bing.net/th/id/OIP.10cwccaDHagLga1_uj7KwwHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "Second-hand Physics book, complete content, ideal for exam preparation, affordable for students."
  },
  {
    name: "HP Laptop",
    price: 420,
    seller: "David",
    image: "https://tse1.mm.bing.net/th/id/OIP.nDwJFqTxYNDh2k_nPJokYAHaJ4?w=1536&h=2048&rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "HP laptop with good specs, suitable for studying and office work, still in great appearance."
  }
];

document.getElementById('sellForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  const seller = document.getElementById('sellerName').value;
  const description = document.getElementById('productDescription').value;
  const imageInput = document.getElementById('productImage');
  const image = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : '';
  products.push({ name, price, seller, image, description });
  alert("Product listed!");
  document.getElementById('sellForm').reset();
});

function renderProducts() {
  const list = document.getElementById('productList');
  list.innerHTML = "";
  list.style.display = "flex";
  list.style.flexWrap = "wrap";
  list.style.gap = "32px";
  list.style.justifyContent = "flex-start";
  list.style.alignItems = "stretch";
  products.forEach((p, i) => {
    if (p.sold) return;
    // English-only description fallback
    const desc = p.description && /[a-zA-Z]/.test(p.description)
      ? p.description
      : "A quality product at a great price. Contact now for more details!";
    list.innerHTML += `
      <div class="product-card">
        ${p.image ? `<img src='${p.image}' alt='${p.name}' />` : ""}
        <h3>${p.name}</h3>
        <div class="price">$${p.price}</div>
        <div class="seller">Seller: <b>${p.seller}</b></div>
        <hr class="divider"/>
        <div class="description">${desc}</div>
        <button onclick="addToCart(${i})">Add to Cart</button>
      </div>
    `;
  });
}

function addToCart(i) {
  cart.push(products[i]);
  alert("Added to cart");
}

function renderCart() {
  const cartDiv = document.getElementById('cartItems');
  cartDiv.innerHTML = cart.map((item, i) =>
    `<div><h4>${item.name}</h4><p>$${item.price}</p><img src='${item.image}' style='width:100px'><p>${item.description}</p><button onclick='removeFromCart(${i})'>Remove</button></div>`
  ).join('');
}

function checkout() {
  if (cart.length === 0) return alert("Cart is empty!");
  const shippingAddress = document.getElementById("shipAddress").value;
  const postalCode = document.getElementById("shipPostal").value;
  const paymentMethod = document.getElementById("paymentMethod").value;
  const paymentInfo = document.getElementById("paymentInfo").value;
  if (!shippingAddress || !postalCode || !paymentInfo) return alert("Enter shipping and payment info!");
  cart.forEach(item => {
    const index = products.findIndex(p => p.name === item.name && p.price === item.price && p.seller === item.seller);
    if (index > -1) {
      products[index].sold = true;
    }
  });
  cart = [];
  orders.push({
    id: Date.now(),
    items: [...cart],
    status: "Shipped",
    shippingAddress,
    postalCode,
    paymentMethod,
    paymentInfo
  });
  cart = [];
  alert("Order placed!");
}

function renderOrders() {
  const orderDiv = document.getElementById('orderStatus');
  orderDiv.innerHTML = orders.map(order =>
    `<div><p>Order #${order.id}</p><p>Status: ${order.status}</p><p>Shipping: ${order.shippingAddress}, ${order.postalCode}</p><p>Payment: ${order.paymentMethod}</p></div>`
  ).join('');
}

document.getElementById('productImage').addEventListener('change', function (e) {
  const file = e.target.files[0];
  const preview = document.getElementById('imagePreview');
  if (file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      preview.innerHTML = `<img src="${evt.target.result}" style="max-width: 200px;" />`;
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = '';
  }
});

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

window.addEventListener("load", () => {
  showSection('auth');
});
document.getElementById('logoTitle').addEventListener('click', function() {
  showSection('buy');
});
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.background = type === "error"
    ? "rgba(255, 80, 80, 0.97)"
    : type === "success"
      ? "rgba(0, 200, 120, 0.97)"
      : "rgba(0, 198, 255, 0.95)";
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}
