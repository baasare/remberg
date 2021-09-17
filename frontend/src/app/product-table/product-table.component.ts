import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {MatPaginator} from "@angular/material/paginator";
import {SelectionModel} from "@angular/cdk/collections";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {Store} from '@ngrx/store';
import {addProduct, removeProduct, retrieveProducts} from "../actions/product.actions";
import {Product} from "../models/product.model";
import {ApiService} from "../services/api.service";
import {AppState} from "../app.state";
import {getRequestParams} from "../product.utils";
import {MatSort} from "@angular/material/sort";


@Component({
  selector: 'product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css']
})
export class ProductTableComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['select', 'name', 'company'];
  dataSource = new MatTableDataSource<Product>();
  selection = new SelectionModel<Product>(true, []);

  name = '';
  pageIndex = 0;
  pageSize = 5;
  pageSizes = [5, 10, 15];
  totalProductCount!: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedProducts!: Product[];

  private subscriptions = new Subscription();

  constructor(private productApiService: ApiService, private store: Store<AppState>) {
    this.productApiService
      .getAllSelectedProducts()
      .subscribe((products) => {
        products.forEach(product => this.selection.select(product))
        return this.store.dispatch(retrieveProducts({products}))
      });
  }

  ngOnInit() {
    this.getProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  checkboxLabel(product?: Product): string {
    if (!product) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(product) ? 'deselect' : 'select'} row ${product.name + 1}`;
  }

  isChecked(product: Product): boolean {

    let checked = false;
    this.store.pipe(take(1)).subscribe(s => {
      this.selectedProducts = s.products as Product[];
      checked = this.selectedProducts.some(e => e.name === product.name)
    });
    return checked;
  }

  handleCheckEvent(event: MatCheckboxChange, product: Product) {
    event.checked ? this.handleSelection(product) : this.handleDeselection(product);
  }

  handleMasterCheckEvent(event: MatCheckboxChange){
    event ? this.masterToggle() : null
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }


  handleSelection(product: Product) {
    this.store.dispatch(addProduct({product}));
    this.selection.select(product);
    this.subscriptions.add(this.productApiService.selectProduct(product).subscribe());
  }

  handleDeselection(product: Product) {
    this.store.dispatch(removeProduct({product}));
    this.selection.deselect(product);
    this.subscriptions.add(this.productApiService.deselectProducts(product.name).subscribe())
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  getProducts() {
    const params = getRequestParams(this.pageIndex, this.pageSize, this.name);

    this.subscriptions.add(
      this.productApiService.getAllProducts(params)
        .subscribe((res) => {
            const {docs, totalDocs} = res;
            this.totalProductCount = totalDocs;

            this.dataSource = new MatTableDataSource<Product>(docs);
            this.dataSource.sort = this.sort;
          }
        )
    )
  }

  doFilter = (event: any) => {
    this.name = event.target.value.trim().toLocaleLowerCase();
    this.getProducts();
  }

  handlePageEvents(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getProducts();
  }

}
