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
  pageKey?: Record<string, string>;
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
    loading(state: UserState, action: PayloadAction): void {
      state.status = 'loading';
    },
    error(state: UserState, action: PayloadAction): void {
      state.status = 'error';
    },
    setPageKey(state: UserState, action: PayloadAction<Record<string, string>>): void {
      state.pageKey = action.payload;
    },
    getUsers(state: UserState, action: PayloadAction<User[]>): void {
      const users = action.payload;
      state.status = 'success';
      state.users.byId = objFromArray(users);
      state.users.allIds = Object.keys(state.users.byId);
    },
    getUser(state: UserState, action: PayloadAction<User>): void {
      const user = action.payload;
      state.status = 'success';
      state.targetUserId = user.id;
      if (!state.users.allIds.includes(user.id)) {
        state.users.allIds.push(user.id);
      }
      state.users.byId[user.id] = { ...user };
    },
    updateBalanceLimit(state: UserState, action: PayloadAction<{ userId: string; balanceLimit: number }>): void {
      const { userId, balanceLimit } = action.payload;
      state.users.byId[userId] = {
        ...state.users.byId[userId],
        balanceLimit,
      };
    },
    updateMobileNumber(
      state: UserState,
      action: PayloadAction<{
        userId: string;
        swappedUserId: string;
        mobileNumber: string;
        swappedMobileNumber: string;
      }>,
    ): void {
      const { userId, mobileNumber, swappedUserId, swappedMobileNumber } = action.payload;
      if (state.users.byId[userId]) {
        state.users.byId[userId] = {
          ...state.users.byId[userId],
          mobileNumber: swappedMobileNumber,
        };
      }
      if (state.users.byId[swappedUserId]) {
        state.users.byId[swappedUserId] = {
          ...state.users.byId[swappedUserId],
          mobileNumber,
        };
      }
    },
    updateUser(state: UserState, action: PayloadAction<{ user: User; userId: string }>): void {
      const { user, userId } = action.payload;
      const existingUser = state.users.byId[userId];
      if (existingUser) {
        state.users.byId[userId] = {
          ...existingUser,
          ...user,
        };
      }
    },
  },
});

export const { reducer } = slice;

export const getUsers =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(slice.actions.loading());
    const data = await userApi.getUsers();
    dispatch(slice.actions.getUsers(data));
    dispatch(slice.actions.setPageKey());
  };

export const filterUsers =
  (frequencyCount: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(slice.actions.loading());
    const { user, meta } = await userApi.getUsersInArrear(frequencyCount);
    dispatch(slice.actions.getUsers(user));
    dispatch(slice.actions.setPageKey(meta.pageKey));
  };

export const filterMoreUsers =
  (frequencyCount: string): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    const state = getState();
    const {
      pageKey,
      users: { allIds, byId },
    } = state.user;
    const currentUsers = allIds.map((id) => byId[id]);
    dispatch(slice.actions.loading());
    const { user, meta } = await userApi.getUsersInArrear(frequencyCount, pageKey);
    dispatch(slice.actions.getUsers([...currentUsers, ...user]));
    dispatch(slice.actions.setPageKey(meta.pageKey));
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
  ({ userId, mobileNumber, swappedUserId, swappedMobileNumber }): AppThunk =>
  async (dispatch): Promise<void> => {
    await userApi.swapMobileNumber(userId, swappedUserId);
    dispatch(slice.actions.updateMobileNumber({ userId, mobileNumber, swappedUserId, swappedMobileNumber }));
  };

export const updateUser =
  ({ user, userId, onComplete }): AppThunk =>
  async (dispatch): Promise<void> => {
    const { success } = await userApi.updateUser(userId, user);
    onComplete({ success });
    dispatch(slice.actions.updateUser({ user, userId }));
  };
export default slice;
