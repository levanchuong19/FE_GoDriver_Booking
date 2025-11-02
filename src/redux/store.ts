import { configureStore } from '@reduxjs/toolkit'
import userSlice from './features/userSlice';
import driverRegistrationSlice from './features/driverRegistrationSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    driverRegistration: driverRegistrationSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;