/* eslint-disable @typescript-eslint/require-await */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { sortBy } from 'lodash';
import type { AppThunk } from '../store';
import { transactionApi } from '../api/transaction';
import type { ITransactionAttributes } from '../types/transaction';
import objFromArray from '../utils/objFromArray';

interface TransactionState {
  transactions: {
    byId: Record<string, ITransactionAttributes>;
    allIds: string[];
  };
  userId: string;
  status: 'idle' | 'loading' | 'success' | 'error' | 'updating' | 'canceling';
}

const initialState: TransactionState = {
  transactions: {
    byId: {},
    allIds: [],
  },
  userId: '',
  status: 'idle',
};

const slice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    loading(state: TransactionState, action: PayloadAction): void {
      state.status = 'loading';
    },
    error(state: TransactionState, action: PayloadAction): void {
      state.status = 'error';
    },
    canceling(state: TransactionState, action: PayloadAction): void {
      state.status = 'canceling';
    },
    updating(state: TransactionState, action: PayloadAction): void {
      state.status = 'updating';
    },
    setUser(state: TransactionState, action: PayloadAction<string>): void {
      const userId = action.payload;
      state.userId = userId;
    },
    getTransactions(state: TransactionState, action: PayloadAction<ITransactionAttributes[]>): void {
      const transactions = action.payload.sort(
        (a, b) => new Date(b.submitAt).getTime() - new Date(a.submitAt).getTime(),
      );
      state.status = 'success';
      state.transactions.byId = objFromArray(transactions);
      state.transactions.allIds = Object.keys(state.transactions.byId);
    },
  },
});

export const { reducer } = slice;

export const getTransactionsByUserId =
  (userId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(slice.actions.loading());
    dispatch(slice.actions.setUser(userId));
    const data = await transactionApi.getTransactionsByUserId(userId);
    dispatch(slice.actions.getTransactions(data));
  };

export default slice;
