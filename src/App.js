import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment, useEffect } from 'react';
import { uiActions } from './store/ui-slice';
import Notification from './components/UI/Notification';

const API_URL = process.env.REACT_APP_API_URL;
let isInitial = true;

const App = () => {
  const dispatch = useDispatch();
  const showCart = useSelector(state => state.ui.cartIsVisible);
  const notification = useSelector(state => state.ui.notification);
  const cart = useSelector(state => state.cart);

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart data',
      }))
      const response = await fetch(API_URL + '/cart.json', {
        method: 'PUT',
        body: JSON.stringify(cart),
      });

      if (!response.ok) {
        throw new Error('Sending cart data failed.');
      }

      dispatch(uiActions.showNotification({
        status: 'success',
        title: 'Success!',
        message: 'Sent cart data successfully!',
      }))
    }

    if (isInitial) {
      isInitial = false;
      return;
    }

    sendCartData().catch((e) => {
      dispatch(uiActions.showNotification({
        status: 'error',
        title: 'Error!',
        message: e.message,
      }))
    })
  }, [cart, dispatch]);

  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
