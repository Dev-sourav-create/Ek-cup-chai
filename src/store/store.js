import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import creatorReducer from "./slices/creatorSlice";
import supportersReducer from "./slices/supportersSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    creator: creatorReducer,
    supporters: supportersReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["user/setClerkUser"],
        ignoredActionPaths: ["payload.clerkUser"],
        ignoredPaths: ["user.clerkUser"],
      },
    }),
});
