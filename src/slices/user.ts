/* eslint-disable @typescript-eslint/require-await */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { pick } from 'lodash';
import type { AppThunk } from '../store';
import { userApi } from '../api/user';
import type { User } from '../types/users';
import objFromArray from '../utils/objFromArray';
import { getTransactionsByUserId } from './transaction';
import jsonexport from 'jsonexport';
import fileDownload from 'js-file-download';

interface UserState {
  users: {
    byId: Record<string, User>;
    allIds: string[];
  };
  allUsers: {
    byId: Record<string, User>;
    allIds: string[];
  };
  status: 'idle' | 'loading' | 'success' | 'error' | 'updating';
  targetUserId: string;
  filter: Record<string, string>;
  pageKey?: Record<string, unknown>;
}

const initialState: UserState = {
  users: {
    byId: {},
    allIds: [],
  },
  allUsers: {
    byId: {},
    allIds: [],
  },
  filter: {},
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
    setPageKey(state: UserState, action: PayloadAction<Record<string, unknown>>): void {
      state.pageKey = action.payload;
    },
    deleteUser(state: UserState, action: PayloadAction<{ userId: string }>): void {
      delete state.allUsers.byId[action.payload.userId];
      state.allUsers.allIds = Object.keys(state.allUsers.byId);
      delete state.users.byId[action.payload.userId];
      state.users.allIds = Object.keys(state.users.byId);
    },
    getUsers(state: UserState, action: PayloadAction<User[]>): void {
      const users = action.payload;
      state.status = 'success';
      state.users.byId = objFromArray(users);
      state.users.allIds = Object.keys(state.users.byId);
    },
    getAllUsers(state: UserState, action: PayloadAction<User[]>): void {
      const users = action.payload;
      state.allUsers.byId = objFromArray(users);
      state.allUsers.allIds = Object.keys(state.allUsers.byId);
    },
    getUser(state: UserState, action: PayloadAction<User>): void {
      const user = action.payload;
      state.status = 'success';
      state.targetUserId = user.id;
      if (!state.users.allIds.includes(user.id)) {
        state.users.allIds.push(user.id);
      }
      state.users.byId[user.id] = user;
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
    updateUser(state: UserState, action: PayloadAction<{ user: Partial<User>; userId: string }>): void {
      const { user, userId } = action.payload;
      const existingUser = state.users.byId[userId];
      if (existingUser) {
        state.users.byId[userId] = {
          ...existingUser,
          ...user,
        };
      }
    },
    updateCollectionReminderPausedUntil(
      state: UserState,
      action: PayloadAction<{ userId: string; collectionReminderPausedUntil: string }>,
    ): void {
      const { userId, collectionReminderPausedUntil } = action.payload;
      state.users.byId[userId].collectionReminderPausedUntil = collectionReminderPausedUntil;
    },
    updateFilter(state: UserState, action: PayloadAction<Record<string, string>>): void {
      const filter = action.payload;
      state.filter = filter;
    },
  },
});

export const { reducer } = slice;

export const deleteUser =
  ({ userId, onSuccess, onError }): AppThunk =>
  async (dispatch): Promise<void> => {
    try {
      await userApi.deleteUser(userId);
      dispatch(slice.actions.deleteUser({ userId }));
      onSuccess();
    } catch (err) {
      onError(err);
    }
  };

const filtersUsers = (users: User[], query: string, filters: any): User[] =>
  users.filter((user) => {
    let matches = true;

    if (query) {
      const properties = ['email', 'firstName', 'lastName', 'middleName', 'mobileNumber'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (user[property]?.toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && user[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });

export const getUsers =
  (filter?: string): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    const userState = getState().user;
    const allUsers = userState.allUsers.allIds.map((id) => userState.allUsers.byId[id]);

    if (filter) {
      const filteredUsers = filtersUsers(allUsers, filter, {});
      if (filteredUsers.length) {
        dispatch(slice.actions.getUsers(filteredUsers));
      } else {
        dispatch(slice.actions.loading());
        const data = await userApi.getUsers({ mobileNumber: filter });
        dispatch(slice.actions.getUsers(data));
      }
    } else if (allUsers.length) {
      dispatch(slice.actions.getUsers(allUsers));
    } else {
      dispatch(slice.actions.loading());
      const data = await userApi.getUsers({});
      dispatch(slice.actions.getAllUsers(data));
      dispatch(slice.actions.getUsers(data));
      dispatch(slice.actions.setPageKey());
    }
  };

export const getUsersInArrears =
  (comparer: string, frequencyCount: number): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(slice.actions.loading());
    const { user, meta } = await userApi.getUsersInArrears(comparer, frequencyCount);
    dispatch(slice.actions.getUsers(user));
    dispatch(slice.actions.setPageKey(meta.pageKey));
  };

export const filterMoreUsers =
  (comparer: string, frequencyCount: number): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    const state = getState();
    const {
      pageKey,
      users: { allIds, byId },
    } = state.user;
    const currentUsers = allIds.map((id) => byId[id]);
    dispatch(slice.actions.loading());
    const { user, meta } = await userApi.getUsersInArrears(comparer, frequencyCount, pageKey);
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

export const updateUserStatus =
  ({ status, statusReason, userId, updatedBy, onComplete }): AppThunk =>
  async (dispatch): Promise<void> => {
    const { success } = await userApi.updateUserStatus(userId, status, statusReason, updatedBy);
    onComplete({ success });
    if (success) {
      dispatch(slice.actions.updateUser({ user: { status, statusReason, updatedBy }, userId }));
    }
  };

export const updateCollectionReminderPausedUntil =
  ({ userId, collectionReminderPausedUntil }): AppThunk =>
  async (dispatch): Promise<void> => {
    const { success } = await userApi.updateCollectionReminderPausedUntil(userId, collectionReminderPausedUntil);
    if (success) {
      dispatch(slice.actions.updateCollectionReminderPausedUntil({ userId, collectionReminderPausedUntil }));
    }
  };

export const splitPayment =
  ({
    userId,
    params,
    callback,
  }: {
    userId: string;
    params: {
      count: string;
      amount: string;
      fee: string;
      pauseCollectionReminder: boolean;
      cancelAllPendingTransactions: boolean;
    };
    callback: (status: boolean) => void;
  }): AppThunk =>
  async (dispatch): Promise<void> => {
    const { success } = await userApi.userSplitPayment(userId, params);
    callback?.(success);
    if (success) {
      dispatch(getTransactionsByUserId(userId));
      dispatch(getUser({ id: userId }));
    }
  };

export const exportUserCSV =
  (): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    const { users } = getState().user;
    const userMappingToCSV = users.allIds.map((userId) => {
      const user = users.byId[userId];
      return pick(user, [
        'id',
        'email',
        'mobileNumber',
        'firstName',
        'middleName',
        'lastName',
        'balanceBook',
        'balanceCurrent',
        'balanceLimit',
        'balanceOverdue',
        'balanceOverdueAt',
        'collectionReminderPausedUntil',
        'incomeFrequency',
        'incomeNextDate',
        'status',
        'statusReason',
        'transactionLastAt',
        'transactionLastId',
      ]);
    });
    jsonexport(userMappingToCSV, (err, csv) => {
      if (err) return console.error(err);
      fileDownload(csv, 'users.csv');
      return {
        success: true,
      };
    });
  };
export default slice;
