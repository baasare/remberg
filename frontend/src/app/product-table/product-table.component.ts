import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {SelectionModel} from "@angular/cdk/collections";
import {Product} from "../models/product.model";
import {ApiService} from "../services/api.service";
import {Subscription} from "rxjs";
import {Store} from '@ngrx/store';
import {addProduct, removeProduct, retrieveProducts} from "../actions/product.actions";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {take} from "rxjs/operators";
import {AppState} from "../app.state";


@Component({
  selector: 'product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css']
})
export class ProductTableComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['select', 'name', 'company'];
  dataSource = new MatTableDataSource<Product>();
  selection = new SelectionModel<Product>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedProducts!: Product[];

  name = '';
  pageIndex = 0;
  pageSize = 5;
  pageSizes = [5, 10, 15];

  totalProductCount!: number;

  private subscriptions = new Subscription();


  constructor(
    private productApiService: ApiService,
    private store: Store<AppState>
  ) {
    this.productApiService
      .getAllSelectedProducts()
      .subscribe((products) => {
        products.forEach(product => this.selection.select(product))
        return this.store.dispatch(retrieveProducts({products}))
      });
  }

  isChecked(product: Product): boolean {

    let checked = false;
    this.store.pipe(take(1)).subscribe(s => {
      this.selectedProducts = s.products as Product[];
      checked = this.selectedProducts.some(e => e.name === product.name)
    });
    return checked;
  }

  handleCheck(event: MatCheckboxChange, product: Product) {
    event.checked ?
      this.handleSelection(product) :
      this.handleDeselection(product);

    this.isChecked(product);
    return event ? this.selection.toggle(product) : null
  }

  handleSelection(product: Product) {

    this.selection.select(product);
    this.store.dispatch(addProduct({product}));
    this.productApiService.selectProduct(product).subscribe();
  }

  handleDeselection(product: Product) {
    this.selection.deselect(product);
    this.store.dispatch(removeProduct({product}));
    this.productApiService.deselectProducts(product.name).subscribe()
  }


  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: Product): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }

  getRequestParams(pageIndex: number, pageSize: number, searchTitle: string,) {
    let params = {} as any;


    if (searchTitle) {
      params[`name`] = searchTitle;
    }

    if (pageIndex) {
      params[`pageIndex`] = pageIndex;
    }

    if (pageSize) {
      params[`pageSize`] = pageSize;
    }

    return params;
  }

  getProducts() {

    const params = this.getRequestParams(this.pageIndex, this.pageSize, this.name);

    this.subscriptions.add(
      this.productApiService.getAllProducts(params)
        .subscribe((res) => {
          const {docs, totalDocs} = res;
          this.totalProductCount = totalDocs;

          this.dataSource = new MatTableDataSource<Product>(docs);
        }))

  }

  public doFilter = (event: any) => {
    this.name = event.target.value.trim().toLocaleLowerCase();
    this.getProducts();
  }

  handlePageEvents(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getProducts();
  }

  ngOnInit() {
    this.getProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }


}
