import {AppState} from "../app.state";
import {createFeatureSelector, createSelector} from "@ngrx/store";


export const selectAppState = createFeatureSelector<AppState>('products');

export const selectAppStateProducts = createSelector(
  selectAppState,
  (state: AppState) => {
    return state.products;
  }
);
