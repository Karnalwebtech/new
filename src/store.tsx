"use client";

import type React from "react";
import { useRef, useMemo } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider,
} from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { authApi } from "./state/auth-api";
import userReducer from "@/reducers/auth-slice";
import fileReducer from "@/reducers/file-slice";
import helperReducer from "@/reducers/healper-slice";
import listReducer from "@/reducers/list-slice";
import CustomField from "@/reducers/custom-field-slice";
import { trackUserApi } from "./state/track-user-api";
import { setupListeners } from "@reduxjs/toolkit/query/react"; // ✅ Corrected import
import { fileApi } from "./state/file-api";
import { storageApi } from "./state/drive-api";
import { configApi } from "./state/config-api";
import { customFieldApi } from "./state/custom-field-api";
import { referralApi } from "./state/referral-api";
import { rewardsApi } from "./state/reward-api";
import { profileApi } from "./state/profile-api";
import { socialProfileApi } from "./state/social-profile-api";
import { cloudStorageApi } from "./state/cloud-storage-api";
import { postApi } from "./state/post-api";
import { categorieApi } from "./state/categorie-api";
import { tagApi } from "./state/tag-api";
import { contactusQueries } from "./state/contact-us-queries-api";
import { userApi } from "./state/users-api";
import { postEventTrackingApi } from "./state/post-event-tracking-api";
import { contactsApi } from "./state/contactsApi";
import { upstashRedisApi } from "./state/upstash-redis-api";
import { productCategoryApi } from "./state/product-category-api";
import { productCollectionsApi } from "./state/product-collections-api";
import { storeApi } from "./state/store-api";
import { currencyApi } from "./state/currency-api";

const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: (value: string) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
});

const storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "helper"],
  blacklist: [
    authApi.reducerPath,
    trackUserApi.reducerPath,
    fileApi.reducerPath,
    storageApi.reducerPath,
    configApi.reducerPath,
    customFieldApi.reducerPath,
    referralApi.reducerPath,
    rewardsApi.reducerPath,
    profileApi.reducerPath,
    socialProfileApi.reducerPath,
    postApi.reducerPath,
    categorieApi.reducerPath,
    tagApi.reducerPath,
    contactusQueries.reducerPath,
    userApi.reducerPath,
    postEventTrackingApi.reducerPath,
    contactsApi.reducerPath,
    upstashRedisApi.reducerPath,
    productCategoryApi.reducerPath,
    productCollectionsApi.reducerPath,
    storeApi.reducerPath,
    currencyApi.reducerPath,

    //superme
    cloudStorageApi.reducerPath,
  ],
  throttle: 1000,
};

const rootReducer = combineReducers({
  user: userReducer,
  files: fileReducer,
  customField: CustomField,
  helper: helperReducer,
  lists: listReducer,
  [authApi.reducerPath]: authApi.reducer,
  [trackUserApi.reducerPath]: trackUserApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [storageApi.reducerPath]: storageApi.reducer,
  [configApi.reducerPath]: configApi.reducer,
  [customFieldApi.reducerPath]: customFieldApi.reducer,
  [referralApi.reducerPath]: referralApi.reducer,
  [rewardsApi.reducerPath]: rewardsApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [socialProfileApi.reducerPath]: socialProfileApi.reducer,
  [postApi.reducerPath]: postApi.reducer,
  [categorieApi.reducerPath]: categorieApi.reducer,
  [tagApi.reducerPath]: tagApi.reducer,
  [contactusQueries.reducerPath]: contactusQueries.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [postEventTrackingApi.reducerPath]: postEventTrackingApi.reducer,
  [contactsApi.reducerPath]: contactsApi.reducer,
  [upstashRedisApi.reducerPath]: upstashRedisApi.reducer,
  [productCategoryApi.reducerPath]: productCategoryApi.reducer,
  [productCollectionsApi.reducerPath]: productCollectionsApi.reducer,
  [storeApi.reducerPath]: storeApi.reducer,
  [currencyApi.reducerPath]: currencyApi.reducer,

  //superme
  [cloudStorageApi.reducerPath]: cloudStorageApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore = () => {
  const middlewareConfig = {
    immutableCheck: { warnAfter: 128 },
    serializableCheck: {
      warnAfter: 128,
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  };

  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware(middlewareConfig).concat([
        authApi.middleware,
        trackUserApi.middleware,
        fileApi.middleware,
        storageApi.middleware,
        configApi.middleware,
        customFieldApi.middleware,
        referralApi.middleware,
        rewardsApi.middleware,
        profileApi.middleware,
        socialProfileApi.middleware,
        postApi.middleware,
        categorieApi.middleware,
        tagApi.middleware,
        contactusQueries.middleware,
        userApi.middleware,
        postEventTrackingApi.middleware,
        contactsApi.middleware,
        upstashRedisApi.middleware,
        productCategoryApi.middleware,
        storeApi.middleware,
        currencyApi.middleware,

        //superme
        cloudStorageApi.middleware,
      ]),
    devTools: process.env.NODE_ENV !== "production",
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }

  const persistor = useMemo(() => persistStore(storeRef.current!), []); // ✅ Removed invalid 'manualPersist'

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
