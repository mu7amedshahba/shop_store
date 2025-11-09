import React, { useRef, useState } from "react";
import addImg from "../../../assets/images/add-images.png";
import { Axios } from "../../../assets/Auth/Axios";
import { AddCat } from "../../../assets/Auth/authPaths";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    image: null,
  });
  const navigate = useNavigate();
  //

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
  };


  //
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fromToSend = new FormData();
      fromToSend.append("title", formData.title);
      if (formData.image) {
        fromToSend.append("image", formData.image);
      }
      const res = await Axios.post(`${AddCat}/add`, fromToSend);
      if (res.status === 200) navigate("/dashboard/Category");
    } catch (error) {
      console.log(error);
    }
  };

  //

  const showImages = (
    <img
      src={formData.image}
      alt="Preview"
      className="w-full h-full object-cover rounded-md"
    />
  );
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Add New Category
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name
          </label>
          <input
            type="text"
            name="title"
            id="category"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter category name"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Category Image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            accept="image/*"
            className="hidden"
            multiple
          />
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <>
              <img
                src={addImg}
                alt="Add image"
                className={`w-50 mb-2 opacity-70 `}
              />
              <p className="text-gray-500">Click to upload an image</p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, JPEG up to 5MB
              </p>
            </>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Add Category
        </button>
      </form>

      {formData.image && <div className="show-images">{showImages}</div>}
    </div>
  );
};

export default AddCategory;
