import {Product} from "../models/product.model";
import {createReducer, on} from "@ngrx/store";
import {addProduct, removeProduct, retrieveProducts} from "../actions/product.actions";


export const initialState: ReadonlyArray<Product> = [];

export const productReducer = createReducer(
  initialState,

  on(addProduct, (state, {product}) => {
    return [...state, product];
  }),
  on(removeProduct, (state, {product}) => {
    return state.filter((item) => item !== product)
  }),
  on(retrieveProducts, (state, {products}) => {
    return [...products];
  }),
);
