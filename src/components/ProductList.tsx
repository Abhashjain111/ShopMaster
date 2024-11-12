import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Spin, Alert, Modal, Input, Form, DatePicker, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { deleteProduct, deleteProductById, fetchProducts, Product, updateProductById } from '../stores/productSlice';
import { Product as ProductType } from '../stores/productSlice';
import Cart from './cart';
import { RootState, AppDispatch } from '../stores/store';
import { addProductToCart, fetchCartProducts } from '../stores/cartSlice';
import { updateProduct } from '../services/api';
import axios from 'axios';
import { styleManager } from 'antd-style';

const { TextArea } = Input;

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const products = useSelector((state: RootState) => state.products.products);
  const loading = useSelector((state: RootState) => state.products.loading);
  const error = useSelector((state: RootState) => state.products.error);
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const [cartVisible, setCartVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCartProducts());
  }, [dispatch]);

  const handleUpdate = (id: string, product: Product) => {
    const updatedProduct = {
      ...product,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    };
    setEditingProduct(updatedProduct);
    setImage(updatedProduct.image || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: any) => {
    const url = `http://localhost:5000/products/${id}`;
    await axios.delete(url);
    await dispatch(fetchProducts());
  };

  const handleAddToCart = async (product:ProductType) => {
    try {
      await dispatch(addProductToCart(product));
      await dispatch(fetchCartProducts());
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  const handleSaveUpdatedProduct = async (values: any) => {
    if (editingProduct) {
      const updatedProduct = { ...editingProduct, ...values, image };
      const resultAction = await dispatch(updateProductById({ id: editingProduct.id, product: updatedProduct }));
      if (updateProductById.fulfilled.match(resultAction)) {
        setIsModalOpen(false); // Close the modal only if update succeeds
        await dispatch(fetchProducts()); // Refresh the products list
      }
    }
  };

  const handleImageChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <Spin tip="Loading products..." />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <>
      <Button onClick={() => setCartVisible(true)} style={{ marginBottom: '16px', margin: '16px' }}>
        View Cart
      </Button>
      <Cart cart={cartItems} visible={cartVisible} onClose={() => setCartVisible(false)} />

      <Modal
        title="Update Product"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form initialValues={editingProduct || {}} onFinish={handleSaveUpdatedProduct}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please input the product name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please input the product price!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Upload Image">
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                handleImageChange(file);
                return false;
              }}
            >
              <Button icon={<PlusOutlined />}>Upload</Button>
            </Upload>
            {image && <img src={image} alt="Product" style={{ marginTop: 10, width: '100%' }} />}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Responsive Product Grid */}
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card
              title={<span className="font-bold" style={{ fontSize: 'larger' }}>{product.name.toUpperCase()}</span>}
              bordered
              style={{ height: '100%' }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: 'auto', borderColor: '#37062', borderWidth: '5px' }}
              />
              <p><b>Price:</b> ${product.price}</p>
              <p>{product.description}</p>
              <Button
                type="primary"
                style={{ backgroundColor: 'White', borderColor: '#37062b', color: '#37062b' }}
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: 'white', borderColor: '#dc2626', color: 'red', margin: '5px' }}
                danger
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: '#37062b', borderColor: '#dc2626', color: 'white' }}
                onClick={() => handleUpdate(product.id, product)}
              >
                Update
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ProductList;
