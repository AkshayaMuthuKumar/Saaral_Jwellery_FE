import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import API_URL from './config';

const AddProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    subcategory: "",
    price: "",
    stock: "",
    size: "",
    occasion: "",
    image: null,
  });

  const [occasions, setOccasions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [newOccasion, setNewOccasion] = useState("");
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [subcategorySuggestions, setSubcategorySuggestions] = useState([]);
  const [newSubCategoryImage, setNewSubCategoryImage] = useState(null);

  const [users, setUsers] = useState([]);

  // Fetch unique occasions and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const occasionsResponse = await axios.get(
          `${API_URL}/products/getOccasions`
        );
        const categoriesResponse = await axios.get(
          `${API_URL}/products/categories`
        );

        setOccasions(occasionsResponse.data.occasions);
        setCategories(categoriesResponse.data.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubCategoryImageChange = (e) => {
    setNewSubCategoryImage(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, category, subcategory, price, stock, size, occasion, image } = product;

    // Validate required fields
    if (!name || !category || !subcategory || !price || !stock || !occasion) {
      alert("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("subcategory", subcategory); // Include subcategory
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("size", size); // Optional field
    formData.append("occasion", occasion);
    if (image) formData.append("image", image);

    try {
      const response = await axios.post(`${API_URL}/products/addProduct`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);

      // Reset form fields to initial values after successful submission
      setProduct({
        name: "",
        category: "",
        subcategory: "", // Reset subcategory
        price: "",
        stock: "",
        size: "",
        occasion: "",
        image: null,
      });

    } catch (error) {
      alert("Error adding product: " + (error.response?.data?.message || error.message));
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!newCategory || !newSubCategory) {
      alert("Category and Subcategory names are required.");
      return;
    }

    const formData = new FormData();
    formData.append("category_name", newCategory);
    formData.append("subcategory_name", newSubCategory);

    if (newSubCategoryImage) {
      formData.append("image", newSubCategoryImage); // Attach the subcategory image
    }

    try {
      const response = await axios.post(
        `${API_URL}/products/category`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);

      // Update the state with the new category and subcategory
      setCategories((prev) => [
        ...prev,
        {
          id: response.data.id,
          category_name: newCategory,
          subcategories: [newSubCategory],
        },
      ]);

      // Reset the input fields and image
      setNewCategory("");
      setNewSubCategory("");
      setNewSubCategoryImage(null);

    } catch (error) {
      alert(error.response?.data?.message || "Error adding category.");
    }
  };



  const handleAddOccasion = async (e) => {
    e.preventDefault();
    if (!newOccasion) {
      alert("Occasion name is required.");
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/products/occasion`,
        { name: newOccasion }
      );
      alert(response.data.message);
      setOccasions((prev) => [...prev, { id: response.data.id, name: newOccasion }]);
      setNewOccasion(""); // Reset the input field
    } catch (error) {
      console.error("Error adding occasion:", error);
      alert("Error adding occasion.");
    }
  };

  // Handle category change
  const handleCategorySelect = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setProduct({ ...product, category: value, subcategory: "" }); // Reset subcategory when category changes
  };

  // For category suggestions in Add Category form
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setNewCategory(value);

    // Check if categories array exists and is not empty
    if (!categories || categories.length === 0) {
      setCategorySuggestions([]);
      return;
    }

    const filteredCategories = categories.filter(cat =>
      cat.category_name && cat.category_name.toLowerCase().startsWith(value.toLowerCase())
    );

    setCategorySuggestions(filteredCategories.map(cat => cat.category_name));
  };

  // For subcategory suggestions in Add Category form
  const handleSubCategoryChange = (e) => {
    const value = e.target.value;
    setNewSubCategory(value);

    const filteredSubCategories = categories
      .filter(cat =>
        cat.subcategory_name && cat.subcategory_name.toLowerCase().startsWith(value.toLowerCase())
      )
      .map(cat => cat.subcategory_name);

    // Remove duplicates using Set
    const uniqueSubCategories = [...new Set(filteredSubCategories)];

    setSubcategorySuggestions(uniqueSubCategories);
  };

  const handleMakeAdmin = async (userId, isAdmin) => {
    try {
      await axios.put(`${API_URL}/auth/users/${userId}/admin`, { isAdmin });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isAdmin } : user
        )
      );
    } catch (error) {
      console.error('Error updating user admin status:', error);
    }
  };



  return (
    <div className="d-flex justify-content-center my-4">
      <div className="card p-4 shadow" style={{ width: "400px", marginRight: "20px" }}>
        <h2 className="text-center mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Category</label>
            <select
              name="category"
              className="form-control"
              value={product.category}
              onChange={handleCategorySelect}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.category_name} value={cat.category_name}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-3">
            <label>Sub Category</label>
            <select
              name="subcategory"
              className="form-control"
              value={product.subcategory}
              onChange={handleChange}
              required
              disabled={!selectedCategory}
            >
              <option value="">Select Subcategory</option>
              {categories
                .find(cat => cat.category_name === selectedCategory)?.subcategories
                .map((subcat, index) => (
                  <option key={index} value={subcat}>
                    {subcat}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group mb-3">
            <label>Price</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={product.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              className="form-control"
              value={product.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Size (Optional)</label>
            <input
              type="text"
              name="size"
              className="form-control"
              value={product.size}
              onChange={handleChange}
              placeholder="Enter size"
            />
          </div>

          <div className="form-group mb-3">
            <label>Occasion</label>
            <select
              name="occasion"
              className="form-control"
              value={product.occasion}
              onChange={handleChange}
              required
            >
              <option value="">Select occasion</option>
              {occasions.map((occ) => (
                <option key={occ.id} value={occ.name}>
                  {occ.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-3">
            <label>Product Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              onChange={handleImageChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">Add Product</button>
        </form>
      </div>

      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Add New Category</h2>
        <form onSubmit={handleAddCategory}>
          <div className="form-group mb-3">
            <label>Category Name</label>
            <input
              type="text"
              value={newCategory}
              onChange={handleCategoryChange}
              className="form-control"
              list="categorySuggestions"
              placeholder="Enter new category name"
            />
            <datalist id="categorySuggestions">
              {categorySuggestions.map((suggestion, index) => (
                <option key={index} value={suggestion} />
              ))}
            </datalist>
          </div>

          <div className="form-group mb-3">
            <label>Subcategory Name</label>
            <input
              type="text"
              value={newSubCategory}
              onChange={handleSubCategoryChange}
              className="form-control"
              list="subcategorySuggestions"
              placeholder="Enter new subcategory name"
            />
            <datalist id="subcategorySuggestions">
              {subcategorySuggestions.map((suggestion, index) => (
                <option key={index} value={suggestion} />
              ))}
            </datalist>
          </div>

          <div className="form-group mb-3">
            <label>Product Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              onChange={handleSubCategoryImageChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">Add Category</button>
        </form>

        {/* Add New Occasion */}
        <h2 className="text-center mt-5 mb-4">Add New Occasion</h2>
        <form onSubmit={handleAddOccasion}>
          <div className="form-group mb-3">
            <label>Occasion Name</label>
            <input
              type="text"
              value={newOccasion}
              onChange={(e) => setNewOccasion(e.target.value)}
              className="form-control"
              placeholder="Enter new occasion name"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">Add Occasion</button>
        </form>
      </div>

      <div className="card p-4 shadow" style={{ width: "400px", marginLeft: "20px" }}>
        <h2 className="text-center mb-4">User Management</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleMakeAdmin(user.id, !user.isAdmin)}
                >
                  {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                </button>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddProductForm;
