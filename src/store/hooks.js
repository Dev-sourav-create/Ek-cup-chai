import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

// Typed hooks for TypeScript-like safety
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Convenience hooks for accessing specific slices
export const useUser = () => {
  const user = useAppSelector((state) => state.user);
  return useMemo(() => {
    const displayName =
      user.dbUser?.firstname || user.dbUser?.lastname
        ? [user.dbUser.firstname, user.dbUser.lastname]
            .filter(Boolean)
            .join(" ")
        : user.dbUser?.username || "Creator";

    return {
      ...user,
      displayName,
      pageUrl: user.dbUser?.username
        ? `/ekcupchai/${user.dbUser.username}`
        : null,
    };
  }, [user]);
};

export const useCreator = () => {
  return useAppSelector((state) => state.creator);
};

export const useSupporters = () => {
  return useAppSelector((state) => state.supporters);
};
