import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
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
  styleUrls: ['./product-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductTableComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * variables for handling material table
   * displayedColumns: columns to display
   * dataSource: data to display in table
   * selection: contain values of selected products
   */
  displayedColumns: string[] = ['select', 'name', 'company'];
  dataSource = new MatTableDataSource<Product>();
  selection = new SelectionModel<Product>(true, []);

  /**
   * variable for handling table pagination and filtering
   * name: contain table filter string
   * pageIndex: initial table page
   * pageSize: initial table size
   * pageSizes: table size options
   * totalProductCount: total number of products to be displayed
   */
  name = '';
  pageIndex = 0;
  pageSize = 5;
  pageSizes = [5, 10, 15];
  totalProductCount!: number;

  /**
   * variables to handle material table pagination and sorting
   */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * selectedProducts: keep track of selected products
   */
  selectedProducts!: Product[];


  /**
   * variable for containing all subscriptions within this component
   */
  private subscriptions = new Subscription();

  /**
   * component constructor
   * @param cd
   * @param productApiService dependency injection for service handling products api
   * @param store dependency injection for ngrx store
   */

  constructor(private cd: ChangeDetectorRef, private productApiService: ApiService, private store: Store<AppState>) {
    this.productApiService
      .getAllSelectedProducts()
      .subscribe((products) => {
        products.forEach(product => this.selection.select(product))
        return this.store.dispatch(retrieveProducts({products}))
      });
  }

  refresh() {
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.getProducts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  /**
   * method for handling of checkbox labels depending on whether checked or not
   * @param product
   * @return String
   */
  checkboxLabel(product: Product): string {
    return `${this.selection.isSelected(product) ? 'deselect' : 'select'} row ${product._id + 1}`;
  }

  /**
   * method to verify state of checkbox if checked or not
   * @param product
   * @return boolean
   */

  isChecked(product: Product): boolean {

    let checked = false;
    this.store.pipe(take(1)).subscribe(s => {
      this.selectedProducts = s.products as Product[];
      checked = this.selectedProducts.some(e => e._id === product._id)
    });
    return checked;
  }

  /**
   * method to handle checkbox event
   * @param event
   * @param product
   */

  handleCheckEvent(event: MatCheckboxChange, product: Product): void {
    event.checked ? this.handleSelection(product) : this.handleDeselection(product);
  }

  /**
   * method to handle checkbox selection
   * @param product
   */

  handleSelection(product: Product): void {
    this.store.dispatch(addProduct({product}));
    this.selection.select(product);
    this.subscriptions.add(this.productApiService.selectProduct(product).subscribe());
    this.refresh();
  }

  /**
   *method to handle checkbox deselection
   * @param product
   */

  handleDeselection(product: Product): void {
    this.store.dispatch(removeProduct({product}));
    this.selection.deselect(product);
    this.subscriptions.add(this.productApiService.deselectProducts(product._id).subscribe())
    this.refresh();
  }

  /**
   * method for fetching products from the backend
   */

  getProducts(): void {
    const params = getRequestParams(this.pageIndex, this.pageSize, this.name);

    this.subscriptions.add(
      this.productApiService.getAllProducts(params)
        .subscribe((res) => {
            const {docs, totalDocs} = res;
            this.totalProductCount = totalDocs;
            this.dataSource = new MatTableDataSource<Product>(docs);
            this.dataSource.sort = this.sort;
            this.refresh();
          }
        )
    )
  }

  /**
   * method for handling filtering of table products
   * @param event
   */
  doFilter(event: any): void {
    this.name = event.target.value.trim().toLocaleLowerCase();
    this.refresh();
    this.getProducts();
  }

  /**
   * method for handling table page change
   * @param event
   */
  handlePageEvents(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.refresh();
    this.getProducts();
  }

}
