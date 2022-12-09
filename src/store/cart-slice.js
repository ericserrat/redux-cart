import { createSlice } from '@reduxjs/toolkit';
import { uiActions } from './ui-slice';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  changed: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    replaceCart(state, action) {
      state.items = action.payload.items;
      state.totalQuantity = action.payload.totalQuantity;
      state.totalAmount = action.payload.totalAmount;
    },
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      state.totalQuantity++;
      state.changed = true;

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
      state.changed = true;

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

export const cartActions = cartSlice.actions;
export default cartSlice;