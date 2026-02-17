"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { useAppDispatch } from "./hooks";
import { setClerkUser, fetchCurrentUser } from "./slices/userSlice";

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <ClerkSync>{children}</ClerkSync>
    </Provider>
  );
}

// Component to sync Clerk user with Redux
function ClerkSync({ children }) {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoaded) {
      if (clerkUser) {
        dispatch(setClerkUser(clerkUser));
        // Fetch DB user data when Clerk user is available
        dispatch(fetchCurrentUser());
      } else {
        dispatch(setClerkUser(null));
      }
    }
  }, [clerkUser, isLoaded, dispatch]);

  return <>{children}</>;
}
