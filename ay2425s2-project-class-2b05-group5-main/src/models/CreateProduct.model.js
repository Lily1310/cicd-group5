const prisma = require('./prismaClient');

//check if the supplier exist
module.exports.checkSupplierExist = function checkSupplierExist(supplierId) {
    return prisma.supplier
      .findUnique({
        where: { id: supplierId },
      })
      .then((supplier) => {
        if (!supplier) {
          throw new Error(`Supplier with ID ${supplierId} does not exist.`);
        }
        console.log(`Supplier with ID ${supplierId} exists.`);
        return supplier.id;
      });
  };
  
// Check for supplier admin conflicts
module.exports.checkConflictProName = function checkConflictProName(ProductName) {
    return prisma.product
      .findMany({
        where: { ProductName },
      })
      .then((product) => {
        if (product.length > 0) {
          throw new Error(`Product with name ${ProductName} already exists.`);
        }
        console.log(`No conflict for product name ${ProductName}.`);
        return ProductName;
      });
  };
  //create product and supplier relationship
  module.exports.CreateNewSupplierPro= function CreateNewSupplierPro(supplierId,productId) {
    return this.checkSupplierExist(supplierId)
      .then(() =>
        prisma.suppProRe.create({
          data: { supplierId,productId},
        })
      )
      .then((suproduct) => {
        console.log(`supplier with Id ${supplierId} create product ${productId}`);
        return suproduct;
      })
      .catch((error) => {
        if (error instanceof prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2003') {
            throw new Error('Foreign key constraint failed.');
          }
        }
        throw error;
      });
  };
  // create new product 
  module.exports.CreateNewPro= function CreateNewPro(supplierId,name, description, unitPrice, stockQuantity,country,productType) {
    if (!Number.isInteger(stockQuantity) || stockQuantity <= 0) {
      return Promise.reject(new Error(`Quantity ${stockQuantity} is invaild,please enter positive integer and greater than 0`));
  }else if (unitPrice <= 0){
    return Promise.reject(new Error(`Unit price ${unitPrice} is invaild, price should be greater than 0`))
  }
    return this.checkConflictProName(name)
      .then(() => this.checkSupplierExist(supplierId))
      .then(() =>
        prisma.product.create({
          data: { name, description, unitPrice, stockQuantity,country,productType},
        })
      )
      .then((product) => {
        console.log('product created:', product);
        return product;
      })
      .then((product)=>this.CreateNewSupplierPro(supplierId,product.id)
    )
      .catch((error) => {
        if (error instanceof prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2003') {
            throw new Error('Foreign key constraint failed.');
          }
        }      
        throw error;
      });
  };

  //update product by product id
  module.exports.updateProductById = function updateProductById(Id,name, description, unitPrice, stockQuantity,country,productType) {
    return  this.checkConflictProName(name)
    .then(() =>
    prisma.product
      .updateMany({
        where: { id: Id },
        data: { name, description, unitPrice, stockQuantity,country,productType},
      }))
      .then((result) => {
        if (result.count === 0) {
          throw new Error('product not found.');
        }
        console.log(`product ${Id} application updated successfully.`);
        return { message: 'Product updated successfully.' };
      });
  };
  //delete product by product id
  module.exports.deleteProductById = function deleteProductById(productId) {
    return prisma.product
      .delete({
        where: { id: productId},
      })
      .then((product) => {
        console.log('Product deleted:', product);
        return product;
      });
  };