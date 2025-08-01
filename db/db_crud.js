const updateProduct = async (id, updatedTitle, updatedPrice) => {
  if (!updatedTitle || !updatedPrice) return;
  const updatedProduct = { title: updatedTitle, price: parseFloat(updatedPrice) };
  await axios.put(`${api}/${id}`, updatedProduct);
  fetchProducts();
};
const fetchProducts = async () => {
    const res = await axios.get(api);
    setProducts(res.data);
  };

  const addProduct = async (title,price) => {
    if (!title || !price) return;
    const newProduct = { title, price: parseFloat(price) };
    await axios.post(api, newProduct);
    fetchProducts();
    setTitle("");
    setPrice("");
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${api}/${id}`);
    fetchProducts(); // refresh list
  };