const socket = io();

//Defino constantes de formulario mensajes
const messageForm = document.getElementById("messageForm");
const usernameInput = document.getElementById("usernameInput");
const messageInput = document.getElementById("messageInput");
const messagesPool = document.getElementById("messagesPool");

//Defino constantes de formulario productos
const productForm = document.getElementById("productForm");
const productInput = document.getElementById("productInput");
const priceInput = document.getElementById("priceInput");
const imgInput = document.getElementById("imgInput");
const categoryInput = document.getElementById("categoryInput");
const productsContainer = document.getElementById("productsContainer");

//Defino la funcion q manda los products
const sendProduct = (product) => {
  //Emito el evento "client:product" para mandar la info del product nuevo al back a traves de socket
  socket.emit("client:product", product);
};

//Defino funcion q renderiza productos
const renderProduct = (productData) => {
  const html = productData.map((productInfo) => {
    return `
            <tr >
                <td>${productInfo.title}</td>
                <td>$${productInfo.price}</td>
                <td><img src="${productInfo.thumbnail}" alt="${productInfo.thumbnail}" width="100px" height="100px"></td>
                
            </tr>
            `;
  });
  productsContainer.innerHTML = html;
};

// Defino la funcion submit handler, se ejecuta cuando dispara el evento submit del form
const formProductsHandler = (event) => {
  //Ejecutamos la funcion preventDefault() para evitar que se recargue la pagina
  event.preventDefault();

  const productInfo = {
    title: productInput.value,
    thumbnail: imgInput.value,
    price: priceInput.value,
    category: categoryInput.value,
  };
  sendProduct(productInfo);

  //Vaciamos los inputs para q quede libre para escribir otro producto
  productInput.value = "";
  priceInput.value = "";
  imgInput.value = "";
  categoryInput.value = "";
};

//Renderizamos los prodcuts
socket.on("server:product", renderProduct);

//Defino la funcion q manda los products
const sendMessage = async (messageInfo) => {
  socket.emit("client:message", messageInfo);
};

// Defino la funcion q renderiza los mensajes
const renderMessage = (messagesData) => {
  const html = messagesData.map((messageInfo) => {
    return `
            <div class="d-flex justify-content-center ">
                <p class="m-1" style="color: blue;"> ${messageInfo.username}</p> 
                <span class="m-1" style="color: brown;">[${messageInfo.time}]:</span> 
                <span class="m-1" style="color: green; font-style: italic;">${messageInfo.message}</span>
            </div>
    
            `;
  });

  messagesPool.innerHTML = html.join(" ");
};

// Defino la funcion submit handler, se ejecuta cuando dispara el evento submit del form
const submitHandler = (event) => {
  event.preventDefault();

  const messageInfo = {
    username: usernameInput.value,
    message: messageInput.value,
  };

  sendMessage(messageInfo);

  //Vaciamos los inputs para q quede libre para escribir otro producto
  messageInput.value = "";
  usernameInput.readOnly = true;
};

//le genero un evento al form para q registre cuando tocamos en enviar y ejecute la funcion submitHandler
productForm.addEventListener("submit", formProductsHandler);

//le genero un evento al form para q registre cuando tocamos en enviar y ejecute la funcion submitHandler
messageForm.addEventListener("submit", submitHandler);

//Renderizamos los messages
socket.on("server:message", renderMessage);
