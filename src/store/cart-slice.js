import { createSlice } from '@reduxjs/toolkit';
import { uiActions } from './ui-slice';

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      state.totalQuantity++;

      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          title: newItem.title,
          price: newItem.price,
          quantity: 1,
          total: newItem.price,
        });

      } else {
        existingItem.quantity++;
        existingItem.total += newItem.price;
      }

      state.totalAmount += newItem.price;
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      state.totalQuantity--;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.total -= existingItem.price;
      }

      state.totalAmount -= existingItem.price;
    },
  }
});

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
        body: JSON.stringify(cart),
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

export const cartActions = cartSlice.actions;
export default cartSlice;