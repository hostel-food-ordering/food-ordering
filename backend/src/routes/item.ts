import { Router, Request, Response } from "express";
import Item from "../../models/item";
import Shop from "../../models/shop";

const router = Router();

router.post("/item/:shop_id", async (req: Request, res: Response) => {
  const { name, price, image_url } = req.body;
  const { shop_id } = req.params;

  try {
    const item = await Item.findOne({ name: name, shop: shop_id });
    if (item) {
      return res
        .status(400)
        .send({ message: "Item already exist in this shop" });
    }

    const newItem = new Item({
      name,
      price,
      image_url,
      shop: shop_id,
    });

    let shop = await Shop.findOne({ _id: shop_id });
    if (!shop) {
      return res.status(404).send({
        message: "Shop not found",
      });
    }

    shop.items.push(newItem._id);

    await shop.save();
    await newItem.save();

    res.status(200).send({ message: "Item Created Successfully!" });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Something went wrong!",
    });
  }
});

export default router;
