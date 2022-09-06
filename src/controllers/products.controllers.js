import { productsServices } from '../test.js';

const getProducts = async (req, res) => {
  try {
    const data = await productsServices.getAll();
    res.status(200).render('main', {
      layout: 'index',
      data,
      isEmpty: data ? false : true,
    });
  } catch (error) {
    console.log(error);
  }
};

const getProductsById = async (req, res) => {
  const { id } = req.params;
  const responseFromGetByIdController = await productsServices.getById(+id);
  if (responseFromGetByIdController.message) {
    res.status(404).json({ error: responseFromGetByIdController.message });
  } else {
    res.status(200).json(responseFromGetByIdController);
  }
};

const postProducts = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'ingrese una imágen del producto' });
      throw new Error('Error 400. Debe ingresar una imágen del producto');
    }
    if (!req.body.productName || !req.body.price) {
      res.status(404).json({
        error: 'Debe ingresar el nombre del producto y su respectivo precio',
      });
      throw new Error({
        error: 'Debe ingresar el nombre del producto y su respectivo precio',
      });
    }
    const newProduct = {
      ...req.body,
      price: req.body.price,
      thumbnail: req.file.originalname,
    };
    const responseFromSaveController = await productsServices.saveProduct(
      newProduct
    );
    if (responseFromSaveController?.message) {
      res.status(404).json({ error: responseFromSaveController.message });
    } else {
      res.status(201).json(responseFromSaveController);
    }
  } catch (error) {
    console.log('error en controlador postProducts', error);
  }
};

const putProductsById = async (req, res) => {
  const { id } = req.params;
  const { productName, price, thumbnail } = req.body;
  if (!id) {
    res.status(404).json({ error: 'Producto no encontrado' });
    throw new Error({ error: 'Producto no encontrado' });
  }

  if (!productName && !price && !thumbnail) {
    return res
      .status(400)
      .json({ error: 'Por favor ingresa un valor a ser actualizado' });
  }
  const product = {
    productName: productName || null,
    price: price || null,
    thumbnail: req.file?.originalname ?? null,
  };
  const responseFromUpdatecontroller = await productsServices.updateById(
    +id,
    product
  );

  if (responseFromUpdatecontroller?.message) {
    res.status(404).json({ error: responseFromUpdatecontroller.message });
  } else {
    res.status(200).json(responseFromUpdatecontroller);
  }
};
const deleteProductsById = async (req, res) => {
  const { id } = req.params;
  const responseFromDeleteController = await productsServices.deleteById(+id);
  console.log(responseFromDeleteController);
  if (responseFromDeleteController?.message) {
    res.status(404).json({ error: responseFromDeleteController.message });
  } else {
    res.status(200).json(responseFromDeleteController);
  }
};

export {
  getProducts,
  getProductsById,
  postProducts,
  putProductsById,
  deleteProductsById,
};
