import { Router, Request, Response } from "express";
import Shop from "../../models/shop";

const router = Router();

router.post("/shop", async (req: Request, res: Response) => {
  const { name, location, image_url, email } = req.body;

  try {
    const shop = new Shop({
      name,
      location,
      image_url,
      email,
    });

    await shop.save();

    res.status(200).send({ message: "Shop Created Successfully!" });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Something went wrong!",
    });
  }
});

export default router;
