import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, DatePicker, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addProduct } from '../stores/productSlice';
import { createProduct } from '../services/api'; 

const { TextArea } = Input;

const InputProduct: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (image) {
        setLoading(true); 
        const productData = { id:String(Date.now()) , ...values, image };
        await createProduct(productData); 
        dispatch(addProduct(productData)); 
      } else {
        throw new Error('Image upload failed');
      }
      setIsModalOpen(false);
      form.resetFields();
      setImage(null);
    } catch (error: any) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleImageChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Button type="primary"
       onClick={showModal} loading={loading} style={{fontFamily:'monospace'}}>
        Add Product
      </Button>
      <Modal title="Add Product" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} confirmLoading={loading}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please input the product name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the product price!' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="date" label="Date">
            <DatePicker />
          </Form.Item>
          <Form.Item label="Upload Image">
            <Upload
              showUploadList={false}
              beforeUpload={file => {
                handleImageChange(file);
                return false; 
              }}
            >
              <Button icon={<PlusOutlined />}>Upload</Button>
            </Upload>
            {image && <img src={image} alt="Product" style={{ marginTop: 10, width: '100%' }} />}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default InputProduct;
