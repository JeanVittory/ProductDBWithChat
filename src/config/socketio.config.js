import { app } from './app.config.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { chatServices } from '../test.js';
import { productsServices } from '../test.js';

const serverHttp = createServer(app);
const io = new Server(serverHttp);

io.on('connection', async (socket) => {
  console.log('user connect');
  let globalProductsFetched = await productsServices.getAllProducts();
  console.log(globalProductsFetched);
  const globalMessagesChat = await chatServices.getAllMessages();
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  try {
    if (globalProductsFetched.message)
      throw Error('Error on server, please try it later');
    socket.emit('initialLoad', globalProductsFetched);
    socket.emit('initialMessageLoad', globalMessagesChat);
  } catch (error) {
    socket.emit('initialLoad', { error: error.message });
  }

  socket.on('sendOneProduct', async (dataToPost) => {
    try {
      if (!dataToPost) throw Error('Something went wrong, please try it later');
      const newProductFetched = await productsServices.getByName(
        dataToPost.product
      );
      if (newProductFetched.message)
        throw Error('Error on server, please try it later');
      globalProductsFetched.push(...newProductFetched);
      io.sockets.emit('prueba', globalProductsFetched);
    } catch (error) {
      io.sockets.emit('prueba', { error: error.message });
    }
  });

  socket.on('productDeleted', async (idOfProductDeleted) => {
    try {
      if (!idOfProductDeleted)
        throw Error('Something went wrong, please try it later');
      const listOfProductsFiltered = globalProductsFetched.filter(
        (product) => product.id !== +idOfProductDeleted
      );
      globalProductsFetched = [...listOfProductsFiltered];
      io.sockets.emit('newDataAfterDeletion', listOfProductsFiltered);
    } catch (error) {
      io.sockets.emit('newDataAfterDeletion', { error: error.message });
    }
  });

  socket.on('productUpdate', async (productToBeUpdated) => {
    try {
      if (
        productToBeUpdated.product === '' &&
        productToBeUpdated.price === '' &&
        productToBeUpdated.thumbnail === ''
      ) {
        throw Error('Something went wrong with the data, please try it later');
      }
      let isInDB = globalProductsFetched.find(
        (product) => product.id === +productToBeUpdated.productId && product
      );
      if (!isInDB) {
        throw Error(
          'Something went wrong, the product do not exist please try it again'
        );
      }
      isInDB = {
        productName: productToBeUpdated.product || isInDB.productName,
        price: productToBeUpdated.price || isInDB.price,
        thumbnail: productToBeUpdated.thumbnail || isInDB.thumbnail,
        id: +productToBeUpdated.productId,
      };
      const newArrayUpdated = globalProductsFetched.map((product) => {
        if (product.id === isInDB.id) {
          return isInDB;
        }
        return product;
      });
      io.sockets.emit('dataUpdated', newArrayUpdated);
    } catch (error) {
      io.sockets.emit('dataUpdated', { error: error.message });
    }
  });

  socket.on('newMessageFromChat', async (message) => {
    try {
      if (!message.email || !message.message)
        throw Error('Something went wrong white the message');
      const responseFromDBofChat = await chatServices.addMessage(message);
      if (responseFromDBofChat.message)
        throw Error('Something went wrong with the server');
      io.sockets.emit('newMessageToChat', message);
    } catch (error) {
      socket.emit('errorReceivingMessage', { error: error.message });
    }
  });
});

export { serverHttp, io };
