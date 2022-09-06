import {
  dataToSocket,
  dataToDataBase,
  renderProductsOnTable,
} from './helpers.js';

const postBtn = document.querySelector('#postBtn');
const updateBtn = document.querySelector('#putBtn');
const deleteBtn = document.querySelector('#deleteBtn');
const idProduct = document.querySelector('#productId');
const product = document.querySelector('#product');
const price = document.querySelector('#price');
const image = document.querySelector('#image');
const errorContainer = document.querySelector('#errorContainer');
const productContainer = document.querySelector('#productsContainer');
const emailUser = document.querySelector('#emailUser');
const messageUser = document.querySelector('#messageUser');
const btnSendChatMessage = document.querySelector('#btnSendChatMessage');
const messagesContainer = document.querySelector('#messages');

const socket = io.connect();

document.addEventListener('DOMContentLoaded', () => {
  socket.on('initialLoad', async (data) => {
    if (data.error) {
      errorContainer.classList.add('errorContainer');
      errorContainer.classList.remove('hidden');
      return (errorContainer.innerHTML = data.error);
    }
    const tableToHTML = await renderProductsOnTable(data);
    productContainer.innerHTML = tableToHTML;
  });
  socket.on('initialMessageLoad', (data) => {
    if (!data.length) return;
    data.forEach((message) => {
      let p = document.createElement('p');
      p.classList.add('messageChat');
      p.innerHTML = `<span class="email">${message.email}</span><span class= "date"> [${message.date}]:</span> <span class= "message">${message.message}</span>`;
      messagesContainer.prepend(p);
    });
  });
});

socket.on('prueba', async (data) => {
  if (data.error) {
    errorContainer.classList.add('errorContainer');
    errorContainer.classList.remove('hidden');
    return (errorContainer.innerHTML = data.error);
  }
  const tableToHTML = await renderProductsOnTable(data);
  productContainer.innerHTML = tableToHTML;
});

socket.on('newDataAfterDeletion', async (data) => {
  if (data.error) {
    errorContainer.classList.add('errorContainer');
    errorContainer.classList.remove('hidden');
    return (errorContainer.innerHTML = data.error);
  }
  const tableToHTML = await renderProductsOnTable(data);
  productContainer.innerHTML = tableToHTML;
});

socket.on('dataUpdated', async (data) => {
  if (data.error) {
    errorContainer.classList.add('errorContainer');
    errorContainer.classList.remove('hidden');
    return (errorContainer.innerHTML = data.error);
  }
  const tableToHTML = await renderProductsOnTable(data);
  productContainer.innerHTML = tableToHTML;
});

socket.on('newMessageToChat', (message) => {
  let p = document.createElement('p');
  p.classList.add('messageChat');
  p.innerHTML = `<span class="email">${message.email}</span><span class= "date"> [${message.date}]:</span> <span class= "message">${message.message}</span>`;
  messagesContainer.prepend(p);
});

emailUser.addEventListener('keyup', () => {
  if (emailUser.value !== '') {
    emailUser.classList.remove('alert');
  }
  return;
});

messageUser.addEventListener('keyup', () => {
  if (messageUser.value !== '') {
    messageUser.classList.remove('alert');
  }
  return;
});

emailUser.addEventListener('blur', () => {
  if (emailUser.value !== '') return;
  emailUser.classList.add('alert');
  return;
});

messageUser.addEventListener('blur', () => {
  if (messageUser.value !== '') return;
  messageUser.classList.add('alert');
  return;
});

btnSendChatMessage.addEventListener('click', (e) => {
  e.preventDefault();
  if (emailUser.value === '' || messageUser.value === '') {
    emailUser.classList.add('alert');
    messageUser.classList.add('alert');
  }
  const messageToSocket = {
    email: emailUser.value,
    message: messageUser.value,
  };
  socket.emit('newMessageFromChat', messageToSocket);
  emailUser.value = '';
  messageUser.value = '';
});

postBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const newProductToDataBase = dataToDataBase(
    image.files,
    product.value,
    price.value
  );
  const newProductToSocket = dataToSocket(
    image.value,
    product.value,
    price.value
  );
  const response = await fetch(`http://localhost:8080/api/v1/productos`, {
    method: 'POST',
    body: newProductToDataBase,
  });
  if (!response.ok) {
    errorContainer.classList.add('errorContainer');
    errorContainer.classList.remove('hidden');
    errorContainer.innerHTML = 'Error: Something went wrong.';
  } else {
    socket.emit('sendOneProduct', newProductToSocket);
  }
  product.value = '';
  price.value = '';
});

deleteBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const productId = idProduct.value;
  const response = await fetch(
    `http://localhost:8080/api/v1/productos/${productId}`,
    {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      body: null,
    }
  );
  if (!response.ok) {
    errorContainer.classList.add('errorContainer');
    errorContainer.classList.remove('hidden');
    errorContainer.innerHTML = 'Error: Something went wrong.';
  } else {
    socket.emit('productDeleted', productId);
  }

  idProduct.value = '';
});

updateBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  let productId = idProduct.value;
  if (!productId)
    throw new Error('Debe ingresar el id del producto a actualizar');

  const productUpdatedToDataBase = dataToDataBase(
    image.files,
    product.value,
    price.value
  );

  const productUpdatedToSocket = dataToSocket(
    image.value,
    product.value,
    price.value
  );

  const response = await fetch(
    `http://localhost:8080/api/v1/productos/${productId}`,
    {
      method: 'PUT',
      body: productUpdatedToDataBase,
    }
  );
  if (!response.ok) {
    errorContainer.classList.add('errorContainer');
    errorContainer.classList.remove('hidden');
    errorContainer.innerHTML = 'Error: Something went wrong.';
  } else {
    socket.emit('productUpdate', { productId, ...productUpdatedToSocket });
  }
  product.value = '';
  price.value = '';
  idProduct.value = '';
});
