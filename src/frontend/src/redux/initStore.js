import { configureStore, getDefaultMiddleware, combineReducers } from '@reduxjs/toolkit';
import apiReducer from '../api/reducer';
import appReducer from '../app/reducer';

export default function initStore(preloadedState) {
  const reducer = combineReducers({
    api: apiReducer,
    app: appReducer
  });

  const store = configureStore({
    reducer,
    middleware: [...getDefaultMiddleware()],
    preloadedState
  });

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('../api/reducer', () => store.replaceReducer(reducer));
  }

  return store;
}
