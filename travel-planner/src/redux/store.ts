import { configureStore } from "@reduxjs/toolkit";
import { UserSlice } from "./AuthSlice/SignUp";
import { TravelSlice } from "./TravelSlice/TravelSlice";


export const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    travel: TravelSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;