import React from 'react';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import store from './stores/store';
import 'antd/dist/reset.css';
import Home from './components/Home';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider>
        <Home />
      </ConfigProvider>
    </Provider>
  );
};

export default App;
