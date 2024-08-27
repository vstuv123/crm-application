
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Toaster } from 'react-hot-toast';
import UserProvider from './context/userContext.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    <UserProvider>
      <BrowserRouter>
        <Toaster position='top-right' />
            <App />
      </BrowserRouter>
      </UserProvider>
  </Provider>,
)
