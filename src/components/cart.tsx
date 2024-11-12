import React from 'react';
import { Modal, List, Button, Badge } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart, fetchCartProducts, removeCartProductAsync } from '../stores/cartSlice';
import { Product as ProductType } from '../stores/productSlice';
import { AppDispatch, RootState } from '../stores/store';
import { removeCartProduct, updateCartProduct } from '../services/apiCart';

interface CartProps {
  cart: ProductType[];
  visible: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, visible, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Access the cart state from Redux using useSelector
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  // Handle increasing product quantity in the cart
  const increaseProduct = async (id: string) => {
    // Find the product in the cart
    const product = cartItems.find((item) => item.id === id);

    if (product) {
      const updatedProduct = { ...product, quantity: product.quantity + 1 };

      try {
        // Call updateCartProduct to update the quantity in the backend
        await updateCartProduct(updatedProduct.id, updatedProduct);
        
        // Update the Redux state with the new quantity
        dispatch(addProductToCart(updatedProduct)); // Assuming this action updates the state with the new quantity
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  // Handle product deletion from the cart
  const handleDelete = async (id: any) => {
    const nid = String(id);
    await dispatch(removeCartProductAsync(nid)); // Decrement or remove item
    dispatch(fetchCartProducts()); // Refresh cart after deletion
  };

  // Calculate the total price of all cart items based on quantity
  const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Modal title="Your Cart" visible={visible} onCancel={onClose} footer={null}>
      <List
        itemLayout="horizontal"
        dataSource={cart}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button type="default" onClick={() => handleDelete(item.id)}>
                -
              </Button>,

              <Button type="default" onClick={() => increaseProduct(item.id)}>
                +
              </Button>,

             <Button type="dashed" danger
             onClick={() =>{removeCartProduct(item.id)
              dispatch(fetchCartProducts())
             } }>
                 Remove Product
              </Button>


            ]}
          >
            <List.Item.Meta
              title={
                <>
                  {item.name.toUpperCase()}{' '}
                  <Badge count={item.quantity} style={{ backgroundColor: '#52c41a', marginLeft: 8 }} />
                </>
              }
              description = {<p>{<span><b>Price:</b> ${item.price} x {item.quantity}</span>}</p>} 

            />
          </List.Item>
        )}
      />
      <p><b>Total: $</b>{total}</p>
      <Button type="primary" onClick={onClose}>
        Checkout
      </Button>
    </Modal>
  );
};

export default Cart;
