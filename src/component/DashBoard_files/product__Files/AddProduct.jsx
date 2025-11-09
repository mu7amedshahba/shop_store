import React, { useCallback, useEffect, useRef, useState } from "react";
import { Axios } from "../../../assets/Auth/Axios";
import { CAT, Prod } from "../../../assets/Auth/authPaths";
import { useNavigate } from "react-router-dom";
import SpinnerLoad from "./../../UI/ReUsable/SpinnerLoad/SpinnerLoad";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit,
  FiImage,
  FiUpload,
  FiTrash2,
  FiXCircle,
  FiUser,
  FiDollarSign,
  FiTag,
  FiFileText,
  FiInfo,
} from "react-icons/fi";

const productFormInputs = [
  {
    id: "title",
    label: "Title",
    name: "title",
    type: "text",
    placeholder: "Enter product title",
    icon: <FiEdit className="text-gray-400" />,
    required: true,
  },
  {
    id: "description",
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter product description",
    icon: <FiFileText className="text-gray-400" />,
    required: true,
  },
  {
    id: "price",
    name: "price",
    label: "Price",
    type: "number",
    placeholder: "Enter price",
    icon: <FiDollarSign className="text-gray-400" />,
    min: 0,
    step: 0.01,
    required: true,
  },
  {
    id: "discount",
    name: "discount",
    label: "Discount (%)",
    type: "number",
    placeholder: "Enter discount percentage",
    icon: <FiTag className="text-gray-400" />,
    min: 0,
    max: 100,
    step: 1,
  },
  {
    id: "about",
    name: "About",
    label: "Additional Info",
    type: "text",
    placeholder: "Enter additional information",
    icon: <FiInfo className="text-gray-400" />,
  },
];

const AddProduct = () => {
  const [category, setCategory] = useState([]);
  const [images, setImages] = useState([]);
  const [isSubmitting, setSubmitting] = useState(false);
  const [validImages, setValidImages] = useState(false);
  const [id, setId] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    price: "",
    discount: "",
    About: "",
  });

  const dummyData = {
    category: formData.category,
    title: "dummy",
    description: "dummy",
    price: 255,
    discount: 0,
    About: "dummy",
  };

  const imagesRef = useRef();
  const progressElement = useRef({});

  useEffect(() => {
    const getCategory = async () => {
      setLoading(true);
      try {
        const res = await Axios.get(`${CAT}`);
        setCategory(res.data);
        console.log(res.data)
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getCategory();
  }, []);

  useEffect(() => {
    if (formData.category) sendDummyData();
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = async (e) => {
    const selectedImages = Array.from(e.target.files);
    if (!selectedImages.length) return;
    
    const previewImages = selectedImages.map((img) => ({
      ...img,
      uId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${img.name}`,
      preview: URL.createObjectURL(img),
      size: img.size,
      state: "pending",
      percent: 0,
    }));

    setImages((prev) => {
      const existImages = new Set(prev.map((item) => item.uId));
      const newImages = previewImages.filter(
        (img) => !existImages.has(img.uId)
      );
      return [...prev, ...newImages];
    });

    for (let i = 0; i < selectedImages.length; i++) {
      const file = selectedImages[i];
      const imageFile = previewImages[i];

      // Check duplicate with name and size
      const isDuplicate = images.some(
        (img) => img.name === file.name && img.size === file.size
      );
      
      if (isDuplicate) {
        setImages((prev) =>
          prev.map((img) =>
            img.uId === imageFile.uId ? { ...img, state: "duplicated" } : img
          )
        );
        continue;
      }

      const uploadFormData = new FormData();
      uploadFormData.append("image", file);
      uploadFormData.append("product_id", id);

      try {
        setImages((prev) =>
          prev.map((img) =>
            img.uId === imageFile.uId ? { ...img, state: "uploading" } : img
          )
        );
        
        await Axios.post(`product-img/add`, uploadFormData, {
          onUploadProgress: (progressEvent) => {
            const { total, loaded } = progressEvent;
            const percent = Math.floor((loaded * 100) / total) || 0;
            console.log(percent);
            
            setImages((prev) =>
              prev.map((img) =>
                img.uId === imageFile.uId
                  ? { ...img, percent, state: "uploading" }
                  : img
              )
            );
            
            const progressItem = progressElement.current?.[imageFile.uId];
            if (progressItem) {
              progressItem.style.width = `${percent}%`;
              progressItem.innerHTML = `${percent}%`;
            }
          },
        });

        setImages((prev) =>
          prev.map((img) =>
            img.uId === imageFile.uId
              ? { ...img, state: "completed", percent: 100 }
              : img
          )
        );
        sendDummyData();
      } catch (error) { // Fixed: Changed 'err' to 'error'
        console.error("Image upload error:", error);
        setImages((prev) =>
          prev.map((img) =>
            img.uId === imageFile.uId
              ? { ...img, state: "error", error: error.message }
              : img
          )
        );
        setError(error.message);
      }
    }
  };

  const sendDummyData = useCallback(async () => {
    try {
      setValidImages(true);
      const res = await Axios.post(`${Prod}/add`, dummyData);
      setId(res.data.id);
      console.log("dummy data added");
    } catch (error) {
      setError(error.message);
    }
  }, [formData.category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      setLoading(true);
      
      // Ensure the data types are correct for the API
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        discount: formData.discount ? parseInt(formData.discount) : 0,
      };

      await Axios.post(`${Prod}/edit/${id}`, submitData);
      navigate("/dashboard/products");
    } catch (error) {
      console.error("Submit error:", error);
      setError(error.response?.data?.message || error.message || "Failed to add product");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleDelete = (uId) => {
    const filteredImages = images.filter((img) => img.uId !== uId);
    setImages(filteredImages);
    
    // Revoke the object URL to prevent memory leaks
    const imageToDelete = images.find(img => img.uId === uId);
    if (imageToDelete && imageToDelete.preview) {
      URL.revokeObjectURL(imageToDelete.preview);
    }
  };

  // Clean up object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.preview && img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, []);

  if (loading) return <SpinnerLoad />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={formData.category}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2.5 rounded-lg border ${
                  error ? "border-red-300" : "border-gray-300"
                } focus:ring-blue-500 focus:border-blue-500`}
                name="category"
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {category.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Inputs */}
          {productFormInputs.map((item) => (
            <div key={item.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {item.label}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {item.icon}
                </div>
                {item.type === "textarea" ? (
                  <textarea
                    name={item.name}
                    value={formData[item.name]}
                    onChange={handleChange}
                    placeholder={item.placeholder}
                    required={item.required}
                    rows={3}
                    className={`block w-full pl-10 pr-3 py-2.5 rounded-lg border ${
                      error ? "border-red-300" : "border-gray-300"
                    } focus:ring-blue-500 focus:border-blue-500`}
                  />
                ) : (
                  <input
                    type={item.type}
                    name={item.name}
                    value={formData[item.name]}
                    onChange={handleChange}
                    placeholder={item.placeholder}
                    required={item.required}
                    min={item.min}
                    max={item.max}
                    step={item.step}
                    className={`block w-full pl-10 pr-3 py-2.5 rounded-lg border ${
                      error ? "border-red-300" : "border-gray-300"
                    } focus:ring-blue-500 focus:border-blue-500`}
                  />
                )}
              </div>
            </div>
          ))}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <input
              type="file"
              name="images"
              hidden
              multiple
              onChange={handleImagesChange}
              ref={imagesRef}
              disabled={!validImages}
              accept="image/*"
            />
            <motion.div
              whileHover={validImages ? { scale: 1.01 } : {}}
              onClick={() => validImages && imagesRef.current.click()}
              className={`
                w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center
                ${
                  validImages
                    ? "border-blue-300 bg-blue-50 cursor-pointer hover:border-blue-500"
                    : "border-gray-300 bg-gray-50 cursor-not-allowed"
                }
              `}
            >
              <div className="text-center p-4">
                <FiImage
                  className={`mx-auto h-12 w-12 mb-3 ${
                    validImages ? "text-blue-400" : "text-gray-300"
                  }`}
                />
                <p
                  className={`text-sm ${
                    validImages ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {validImages
                    ? "Click to upload images"
                    : "Select a category first"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </div>
            </motion.div>
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">
                Uploading ({images.length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto p-1">
                <AnimatePresence>
                  {images.map((item) => {
                    const formattedSize =
                      item.size >= 1024 * 1024
                        ? `${(item.size / (1024 * 1024)).toFixed(2)} MB`
                        : `${(item.size / 1024).toFixed(2)} KB`;

                    return (
                      <motion.div
                        key={item.uId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="border border-gray-200 rounded-lg p-3 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.preview}
                              alt="Preview"
                              className="w-12 h-12 rounded-md object-cover"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxOUwxOSAyMkwyMiAxOUgyMloiIGZpbGw9IiM5Q0EwQUQiLz4KPHBhdGggZD0iTTE2IDE5TDE5IDIyTDIyIDE5SDIyWiIgc3Ryb2tlPSIjOUNBMEFEIiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZD0iTTM2IDI4SDM0VjM2SDM2VjI4WiIgZmlsbD0iIzlDQTBBRCIvPgo8L3N2Zz4K';
                              }}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formattedSize} - {item.state}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.uId)}
                            className="p-2 text-red-500 hover:text-red-700 rounded-full"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {(item.state === "uploading" || item.state === "completed") && (
                          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              ref={(el) => (progressElement.current[item.uId] = el)}
                              className={`h-full rounded-full transition-all duration-300 ${
                                item.state === "completed" ? "bg-green-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${item.percent}%` }}
                            >
                              <span className="text-xs text-white px-1">
                                {item.percent}%
                              </span>
                            </div>
                          </div>
                        )}
                        {item.state === "error" && (
                          <p className="text-xs text-red-500 mt-1">{item.error}</p>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-start"
            >
              <FiXCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting || !id}
              className={`w-full flex justify-center items-center py-3 px-6 rounded-lg text-white font-medium ${
                isSubmitting || !id
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiUpload className="mr-2" />
                  {!id ? "Preparing..." : "Add Product"}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProduct;