import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import BounceLoading from "../components/BounceLoading";
import { ItemType } from "../utils/types";
import { addItem } from "../fetch/item";
import { useState } from "react";
import ImageContainter from "../components/ImageContainer";

export type AddItemType = Omit<Omit<ItemType, "_id">, "image_url"> & {
  shop: string;
  image: FileList;
};

export default function AddItem() {
  const categories: string[] = ["Snacks", "Dessert", "Soup", "Salads"];
  const [isVegRadio, setIsVegRadio] = useState<boolean | undefined>(undefined);
  const [imageFile, setImageFile] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddItemType>();

  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const [searchParams] = useSearchParams();
  const shop_id = searchParams.get("shop_id");
  if (!shop_id) {
    navigate("/");
    return;
  }

  const mutation = useMutation(addItem, {
    onSuccess() {
      navigate(`/shop-owner?shop_id=${shop_id}`);
      showToast("Item Added", "SUCCESS");
    },
    onError(error: Error) {
      showToast(error.message, "ERROR");
    },
  });

  const onSubmit = handleSubmit((data) => {
    data.isVegetarian = String(data.isVegetarian) === "Veg";
    const formData = new FormData();

    formData.append("shop_id", shop_id);
    formData.append("name", data.name);
    formData.append("price", String(data.price));
    formData.append("category", data.category);
    formData.append("isVegetarian", String(data.isVegetarian));
    formData.append("image", data.image[0]);

    if (!mutation.isLoading) mutation.mutate(formData);
  });

  return (
    <form
      className="container bg-slate-700 text-white flex flex-col gap-4 mx-auto max-w-screen-md"
      onSubmit={onSubmit}
    >
      <h2 className="text-2xl font-bold">Add Item</h2>
      <div className="flex flex-col gap-2">
        <label className="text-base font-bold flex-1">
          Name
          <input
            className="text-input"
            {...register("name", { required: "Name is required" })}
          ></input>
          {errors.name && (
            <p className="text-red-600 font-normal">{errors.name.message}</p>
          )}
        </label>
        <label className="text-base font-bold flex-1">
          Price
          <input
            type="number"
            className="text-input"
            {...register("price", { required: "Price is required" })}
          ></input>
          {errors.price && (
            <p className="text-red-600 font-normal">{errors.price.message}</p>
          )}
        </label>
        <div className="font-bold">Catergories</div>
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((category) => {
            return (
              <label className="text-input w-fit cursor-pointer" key={category}>
                {category}
                <input
                  className="ml-3"
                  type="checkbox"
                  value={category}
                  {...register("category", { required: "Select at least one" })}
                ></input>
              </label>
            );
          })}
        </div>
        {errors.category && (
          <p className="text-red-600 font-normal">{errors.category.message}</p>
        )}
        <div className="font-bold">Vegetarian</div>
        <div className="flex items-center gap-2 flex-wrap">
          {[true, false].map((category) => (
            <label
              key={category ? "Veg" : "Non Veg"}
              className="text-input w-fit cursor-pointer font-bold"
              style={{
                backgroundColor:
                  isVegRadio === category
                    ? category
                      ? "green"
                      : "red"
                    : undefined,
                color: isVegRadio === category ? "white" : undefined,
              }}
            >
              {category ? "Veg" : "Non Veg"}
              <input
                className="ml-3"
                type="radio"
                value={category ? "Veg" : "Non Veg"}
                {...register("isVegetarian", {
                  required: "Select one from veg or non veg",
                })}
                onChange={() => {
                  setIsVegRadio(category);
                }}
              ></input>
            </label>
          ))}
        </div>
        {errors.isVegetarian && (
          <p className="text-red-600 font-normal">
            {errors.isVegetarian.message}
          </p>
        )}
        <label className="text-base font-bold flex-1">
          Image
          <input
            type="file"
            className="text-input file:bg-slate-300 file:rounded file:border-none cursor-pointer file:cursor-pointer"
            {...register("image", {
              required: "Image is required",
              validate: {
                lessThan0_5MB: (files) =>
                  (files[0] && files[0].size < 500000) ||
                  "File size should be less than 0.5MB",
                acceptedFormats: (files) =>
                  (files[0] &&
                    ["image/jpeg", "image/png", "image/gif"].includes(
                      files[0].type
                    )) ||
                  "Only JPEG, PNG, and GIF formats are allowed",
              },
            })}
            onChange={(e) => {
              setImageFile(
                e.target.files && e.target.files[0]
                  ? URL.createObjectURL(e.target.files[0])
                  : undefined
              );
            }}
          ></input>
          {errors.image && (
            <p className="text-red-600 font-normal">{errors.image.message}</p>
          )}
        </label>
        {imageFile && <ImageContainter url={imageFile} id={imageFile} />}
        <button type="submit" className="btn" disabled={mutation.isLoading}>
          {mutation.isLoading ? <BounceLoading /> : "Add Item"}
        </button>
      </div>
    </form>
  );
}
