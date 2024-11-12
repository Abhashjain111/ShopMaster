import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import InputProduct from './InputProduct'; 
import ProductList from './ProductList'; 
import { useSelector } from 'react-redux';
import { deleteProduct } from '../stores/productSlice';
import styles from "./Home.module.css";

const { Header, Content, Footer } = Layout;

const Home: React.FC = () => {
   console.log( "useSelector",useSelector(deleteProduct))
  return (
    <Layout>
     
     <Header className={styles.header}>
       <div className={styles.headerContent}>
         <h1>Product Manager</h1>
       </div>
     </Header>


      <Content style={{ padding: '30px' }}>
      
      <div style={{ backgroundColor: '#332831', minHeight: 280, padding: 24 }}>
      <InputProduct />
          <ProductList /> 
        </div>
      </Content>
     
    </Layout>
  );
};

export default Home;
