/* eslint-disable @typescript-eslint/require-await */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '../store';
import { userApi } from '../api/user';
import type { User } from '../types/users';
import objFromArray from '../utils/objFromArray';

interface UserState {
  users: {
    byId: Record<string, User>;
    allIds: string[];
  };
  status: 'idle' | 'loading' | 'success' | 'error' | 'updating';
  targetUserId: string;
}

const initialState: UserState = {
  users: {
    byId: {},
    allIds: [],
  },
  status: 'idle',
  targetUserId: '',
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUsers(state: UserState, action: PayloadAction<User[]>): void {
      const users = action.payload;
      state.users.byId = objFromArray(users);
      state.users.allIds = Object.keys(state.users.byId);
    },
    getUser(state: UserState, action: PayloadAction<User>): void {
      const user = action.payload;
      state.targetUserId = user.id;
      if (!state.users.allIds.includes(user.id)) {
        state.users.allIds.push(user.id);
        state.users.byId[user.id] = { ...user };
      }
    },
    updateBalanceLimit(state: UserState, action: PayloadAction<{ userId: string; balanceLimit: number }>): void {
      const { userId, balanceLimit } = action.payload;
      state.users.byId[userId] = {
        ...state.users.byId[userId],
        balanceLimit,
      };
    },
    updateMobileNumber(state: UserState, action: PayloadAction<{ userId: string; swapUserId: string }>): void {
      const { userId, swapUserId } = action.payload;
      // const user = state.users.byId[userId];
      // state.users.byId[userId] = {
      //   ...state.users.byId[userId],
      // };
      // state.users.byId[swapUserId] = {
      //   ...state.users.byId[userId],
      //   mobileNumber: user.mobileNumber,
      // };
    },
  },
});

export const { reducer } = slice;

export const getUsers =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    const data = await userApi.getUsers();
    dispatch(slice.actions.getUsers(data));
  };

export const getUser =
  ({ id }): AppThunk =>
  async (dispatch): Promise<void> => {
    const data = await userApi.getUser({ id });
    dispatch(slice.actions.getUser(data));
  };

export const updateBalanceLimit =
  ({ userId, balanceLimit }): AppThunk =>
  async (dispatch): Promise<void> => {
    await userApi.updateBalanceLimit(userId, balanceLimit);
    dispatch(slice.actions.updateBalanceLimit({ userId, balanceLimit }));
  };

export const swapMobileNumber =
  ({ userId, swapUserId }): AppThunk =>
  async (dispatch): Promise<void> => {
    await userApi.swapMobileNumber(userId, swapUserId);
    dispatch(slice.actions.updateMobileNumber({ userId, swapUserId }));
  };
export default slice;
