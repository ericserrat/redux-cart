import { uiActions } from './ui-slice';
import { cartActions} from './cart-slice';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(API_URL + '/cart.json');

      if (!response.ok) {
        throw new Error('Could not fetch cart');
      }

      const data = await response.json();

      return {
        items: data.items || [],
        totalQuantity: data.totalQuantity || 0,
        totalAmount: data.totalAmount || 0,
      }
    }

    try {
      const carData = await fetchData();
      dispatch(cartActions.replaceCart(carData));
    } catch (e) {
      dispatch(uiActions.showNotification({
        status: 'error',
        title: 'Error!',
        message: e.message,
      }))
    }
  };
};

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(uiActions.showNotification({
      status: 'pending',
      title: 'Sending...',
      message: 'Sending cart data',
    }));

    const sendRequest = async () => {
      const response = await fetch(API_URL + '/cart.json', {
        method: 'PUT',
        body: JSON.stringify({
          items: cart.items,
          totalAmount: cart.totalAmount,
          totalQuantity: cart.totalQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Sending cart data failed.');
      }
    };

    try {
      await sendRequest();

      dispatch(uiActions.showNotification({
        status: 'success',
        title: 'Success!',
        message: 'Sent cart data successfully!',
      }))
    } catch (e) {
      dispatch(uiActions.showNotification({
        status: 'error',
        title: 'Error!',
        message: e.message,
      }))
    }
  };
};