import { Request, Response } from "express";
import { db } from "../database/connections";
import { Order, Sequelize, Transaction } from "sequelize";
import multer from "multer";

export class productController {
  static viewImage = async (req: Request, res: Response) => {
    // console.log("file",req.file)
    return res.status(200).send({ url: `${req.file!.filename}` });
  };

  static viewImages = async (req: Request, res: Response) => {
    // console.log("file",req.files) //file{}[]
    let files = req.files as Express.Multer.File[];
    let urls: string[] = [];
    files.map((file) => {
      urls.push(`${file.filename}`);
    });
    return res.status(200).send({ urls: urls });
  };

  static addProduct = async (req: Request, res: Response) => {
    let transaction: Transaction = await db.transaction();
    try {
      const doesProductExist = await db.dbInterface.models.Product.findOne({ where: { productName: req.body.productName } });
      if (doesProductExist) return res.status(400).send({ message: "Product with same name already exists" });
      const { productName, productDesc, orderIndex, category, isFeatured, productEntries } = req.body;
      const newProduct = await db.dbInterface.models.Product.create(
        {
          productName,
          productDesc,
          orderIndex: 0,
          category,
          isFeatured,
        },
        { returning: true, transaction }
      );
      let NewproductEntries = [...productEntries];
      for (let index = 0; index < NewproductEntries.length; index++) {
        NewproductEntries[index]["productId"] = newProduct.id;
        NewproductEntries[index]["sizeId"] = (await db.dbInterface.models.Size.findOne({ where: { size_value: NewproductEntries[index]["ProductEntrySize"] } }))!.id;
        NewproductEntries[index]["colourId"] = (await db.dbInterface.models.Colour.findOne({ where: { colour_value: NewproductEntries[index]["ProductEntryColour"] } }))!.id;
        NewproductEntries[index]["productImage"] = NewproductEntries[index]["ProductEntryImage"];
        delete NewproductEntries[index]["ProductEntryImage"];
        NewproductEntries[index]["productPrice"] = NewproductEntries[index]["ProductEntryPrice"];
        delete NewproductEntries[index]["ProductEntryPrice"];
        NewproductEntries[index]["discountedPrice"] = NewproductEntries[index]["ProductEntryDiscountedPrice"];
        delete NewproductEntries[index]["ProductEntryDiscountedPrice"];
        NewproductEntries[index]["inStock"] = NewproductEntries[index]["ProductEntryInStock"];
        delete NewproductEntries[index]["ProductEntryInStock"];
        NewproductEntries[index]["title"] = NewproductEntries[index]["ProductEntrySize"] + newProduct.productName + NewproductEntries[index]["ProductEntryColour"];
        NewproductEntries[index]["qty"] = NewproductEntries[index]["ProductEntryQuantity"];
        delete NewproductEntries[index]["ProductEntryQuantity"];
      }

      const newProductEntry = await db.dbInterface.models.ProductEntry.bulkCreate(NewproductEntries, { transaction });
      await transaction.commit();
      return res.status(200).send({ message: "Product has been added", product: newProduct, entry: newProductEntry });
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return res.status(500).send({ message: "Product add error" });
    }
  };

  static viewProducts = async (req: Request, res: Response) => {
    try {
      const allProducts = await db.dbInterface.models.Product.findAll({
        order: ["orderIndex"],
        include: [
          {
            model: db.dbInterface.models.ProductEntry,
            attributes: ["id", "productPrice", "discountedPrice", "productImage", "qty", "inStock"],
            where: { inStock: true },
            include: [
              {
                model: db.dbInterface.models.Size,
                attributes: ["size_value"],
                required: true,
              },
              {
                model: db.dbInterface.models.Colour,
                attributes: ["colour_value"],
                required: true,
              },
            ],
            required: false,
          },
        ],
      });
      return res.status(200).send({ message: "Products are showing", products: allProducts });
    } catch (error) {
      return res.status(500).send({ message: "Product viewing error" });
    }
  };

  static updateProduct = async (req: Request, res: Response) => {
    let transaction: Transaction = await db.transaction();
    try {
      const doesProductExist = await db.dbInterface.models.Product.findOne({ where: { productName: req.body.oldProductName } });
      if (!doesProductExist) return res.status(400).send({ message: "Product with this name doesn't exists" });
      const { productName, productDesc, orderIndex, category, isFeatured, productEntries, newProductEntries } = req.body;
      const updatedProduct = await db.dbInterface.models.Product.update(
        {
          productName,
          productDesc,
          orderIndex,
          category,
          isFeatured,
        },
        { where: { productName: req.body.oldProductName }, transaction }
      );
      for (let index = 0; index < productEntries.length; index++) {
        productEntries[index]["sizeId"] = (await db.dbInterface.models.Size.findOne({ where: { size_value: productEntries[index]["Size"] } }))!.id;
        productEntries[index]["colourId"] = (await db.dbInterface.models.Colour.findOne({ where: { colour_value: productEntries[index]["Colour"] } }))!.id;
        productEntries[index]["title"] = productEntries[index]["Size"] + productName + productEntries[index]["Colour"];
        await db.dbInterface.models.ProductEntry.update(
          {
            productId: productEntries[index]["productId"],
            sizeId: productEntries[index]["sizeId"],
            colourId: productEntries[index]["colourId"],
            productImage: productEntries[index]["productImage"],
            productPrice: productEntries[index]["productPrice"],
            discountedPrice: productEntries[index]["discountedPrice"],
            inStock: productEntries[index]["inStock"],
            title: productEntries[index]["title"],
          },
          { where: { id: productEntries[index]["id"] }, transaction }
        );
      }
      let newEntries = [];
      let newProductEntry;
      if (newProductEntries.length !== 0) {
        newEntries = [...newProductEntries];
        for (let index = 0; index < newEntries.length; index++) {
          newEntries[index]["productId"] = doesProductExist.id;
          newEntries[index]["sizeId"] = (await db.dbInterface.models.Size.findOne({ where: { size_value: productEntries[index]["Size"] } }))!.id;
          newEntries[index]["colourId"] = (await db.dbInterface.models.Colour.findOne({ where: { colour_value: newEntries[index]["Colour"] } }))!.id;
          newEntries[index]["title"] = newEntries[index]["Size"] + productName + newEntries[index]["Colour"];
        }
        newProductEntry = await db.dbInterface.models.ProductEntry.bulkCreate(newEntries, { transaction });
      }
      await transaction.commit();
      return res.status(200).send({ message: "Product has been updated", newEntries: newProductEntry });
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return res.status(500).send({ message: "Product add error" });
    }
  };

  static updateProductOnly = async (req: Request, res: Response) => {
    let transaction: Transaction = await db.transaction();
    try {
      const doesProductExist = await db.dbInterface.models.Product.findOne({ where: { productName: req.body.oldProductName } });
      if (!doesProductExist) return res.status(400).send({ message: "Product with this name doesn't exists" });
      const { productName, productDesc, orderIndex, category, isFeatured } = req.body;
      const updatedProduct = await db.dbInterface.models.Product.update(
        {
          productName,
          productDesc,
          orderIndex,
          category,
          isFeatured,
        },
        { where: { productName: req.body.oldProductName }, transaction }
      );

      await transaction.commit();
      return res.status(200).send({ message: "Product has been updated" });
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return res.status(500).send({ message: "Product add error" });
    }
  };

  static viewFeaturedProducts = async (req: Request, res: Response) => {
    try {
      const allProducts = await db.dbInterface.models.Product.findAll({
        where: { isFeatured: true },
        attributes: { exclude: ["isAvailabe"] },
        order: ["orderIndex"],
        include: [
          {
            model: db.dbInterface.models.ProductEntry,
            where: { inStock: true },
            attributes: ["id", "productPrice", "discountedPrice", "productImage"],
            include: [
              {
                model: db.dbInterface.models.Size,
                attributes: ["size_value"],
                required: true,
              },
              {
                model: db.dbInterface.models.Colour,
                attributes: ["colour_value"],
                required: true,
              },
            ],
            required: true,
          },
        ],
      });
      return res.status(200).send({ message: "Featured Products are showing", products: allProducts });
    } catch (error) {
      return res.status(500).send({ message: "Featured Product viewing error" });
    }
  };

  static viewSingleProducts = async (req: Request, res: Response) => {
    try {
      const product = await db.dbInterface.models.Product.findOne({
        where: { productName: req.params.name },
        include: [
          {
            model: db.dbInterface.models.ProductEntry,
            where: { inStock: true },
            attributes: ["id", "productPrice", "discountedPrice", "productImage", "qty", "inStock"],
            include: [
              {
                model: db.dbInterface.models.Size,
                attributes: ["size_value"],
                required: true,
              },
              {
                model: db.dbInterface.models.Colour,
                attributes: ["colour_value"],
                required: true,
              },
            ],
            required: false,
          },
        ],
      });
      let sizes = ["S", "M", "L", "XL"];
      sizes = [...sizes.filter((size) => product?.ProductEntries.some((entry: any) => entry.Size.size_value == size))];
      return res.status(200).send({ message: "Product is showing", product: product, sizesAvl: sizes });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Product viewing error" });
    }
  };

  static deleteProducts = async (req: Request, res: Response) => {
    try {
      const doesProductExist = await db.dbInterface.models.Product.findOne({ where: { id: req.params.id } });
      if (!doesProductExist) return res.status(400).send({ message: "Product doesn't exists" });
      await db.dbInterface.models.ProductEntry.destroy({ where: { productId: doesProductExist.id } });
      await db.dbInterface.models.Product.destroy({ where: { id: doesProductExist.id } });
      return res.status(200).send({ message: `Product ${doesProductExist.productName} deleted` });
    } catch (error) {
      return res.status(500).send({ message: "Product deletion error" });
    }
  };

  static addAtributes = async (req: Request, res: Response) => {
    try {
      const { value, attribute } = req.body;
      if (attribute === "size") {
        let newAttribute = await db.dbInterface.models.Size.create({ size_value: value });
        return res.status(200).send(newAttribute);
      } else {
        let newAttribute = await db.dbInterface.models.Colour.create({ colour_value: value });
        return res.status(200).send(newAttribute);
      }
    } catch (error) {}
  };

  static addProdcutEntries = async (req: Request, res: Response) => {
    try {
      const { productId, sizeId, colourId, productImage, productPrice, discountedPrice, inStock, title, qty } = req.body;
      let newProductEntry = await db.dbInterface.models.ProductEntry.create({
        productId,
        sizeId,
        colourId,
        productImage,
        productPrice,
        discountedPrice,
        inStock,
        title,
        qty,
      });
      return res.status(200).send({ message: "Product Entry is showing", newProductEntry: newProductEntry });
    } catch (error) {
      console.log(error);
      return res.status(500).send("error at product entry");
    }
  };

  static viewProductEntryId = async (req: Request, res: Response) => {
    try {
      const size = req.params.size;
      const colour = req.params.colour;
      let productEntry = await db.dbInterface.models.ProductEntry.findOne({
        where: { id: req.params.productId },
        include: [
          {
            model: db.dbInterface.models.Size,
            where: { size },
            required: true,
          },
          {
            model: db.dbInterface.models.Colour,
            where: { colour },
            required: true,
          },
        ],
      });
    } catch (error) {}
  };
}
