import {createAction, props} from '@ngrx/store'
import {Product} from "../models/product.model";


export enum ProductActionType {
  GET_SELECTED_PRODUCTS = '[PRODUCT] Get',
  ADD_PRODUCT = '[PRODUCT] Add',
  REMOVE_PRODUCT = '[PRODUCT] Remove',
}

export const addProduct = createAction(
  ProductActionType.ADD_PRODUCT,
  props<{ product: Product }>()
)

export const removeProduct = createAction(
  ProductActionType.REMOVE_PRODUCT,
  props<{ product: Product }>()
);


export const retrieveProducts = createAction(
  ProductActionType.GET_SELECTED_PRODUCTS,
  props<{ products: Product[] }>()
);
