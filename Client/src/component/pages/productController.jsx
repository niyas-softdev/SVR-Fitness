import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdSystemUpdateAlt, MdDelete, MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductController() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const categories = ["Cardio", "Strength", "Yoga", "Supplements", "Accessories"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5174/api/product/get");
      setProducts(response.data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products");
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingProduct) return;

    const id = editingProduct._id;

    const updatedProduct = {
      name: name || editingProduct.name,
      price: price || editingProduct.price,
      description: description || editingProduct.description,
      imageUrl: image || editingProduct.image,
      category: category || editingProduct.category,
    };

    try {
      const response = await axios.put(
        `http://localhost:5174/api/product/update/${id}`,
        updatedProduct,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (response.status === 200) {
        toast.success("Product successfully updated", { autoClose: 2000 });
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5174/api/product/delete/${id}`
      );
      if (response.status === 200) {
        toast.success("Product successfully deleted", { autoClose: 2000 });
        setProducts(products.filter((product) => product._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    const newProduct = {
      name: name,
      price: price,
      description: description,
      image: image,
      category: category,
    };

    try {
      const response = await axios.post(
        "http://localhost:5174/api/product/create",
        newProduct,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (response.status === 201) {
        toast.success("Product successfully added", { autoClose: 2000 });
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("Add failed");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setImage(product.image);
    setCategory(product.category);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setImage("");
    setCategory("");
    setAddingProduct(false);
    setEditingProduct(null);
  };

  const handleGoToHome = () => {
    resetForm();
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  return (
    <div className="container mx-auto py-5">
      {/* Add Product Button */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          onClick={() => setAddingProduct(!addingProduct)}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 flex items-center"
        >
          <MdAdd className="mr-2" /> Add Product
        </button>
      </div>

      {/* Product Form for Adding or Editing */}
      {addingProduct || editingProduct ? (
        <div className="flex justify-center items-center py-10 bg-gray-50 min-h-screen">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-4 text-center">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>
            <form onSubmit={editingProduct ? handleUpdate : handleAddProduct}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  placeholder="Enter Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Enter Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  rows="3"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="Image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                {image && (
                  <div className="w-full flex justify-center mb-4">
                    <img
                      src={image}
                      alt="Preview"
                      className="max-w-full h-auto border border-gray-300 rounded-lg"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/150?text=Image+Not+Available")
                      }
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={handleGoToHome}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white shadow-lg rounded-lg p-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover mb-4 rounded-lg"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/150?text=Image+Not+Available")
                }
              />
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-700 mb-2">{product.description}</p>
              <p className="text-gray-900 font-bold mb-4">${product.price}</p>
              <p className="text-sm text-gray-600 mb-4">
                Category: {product.category}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 flex items-center"
                >
                  <MdSystemUpdateAlt className="mr-2" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 flex items-center"
                >
                  <MdDelete className="mr-2" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default ProductController;
