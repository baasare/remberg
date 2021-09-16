import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {SelectionModel} from "@angular/cdk/collections";
import {Product} from "../models/product.model";
import {ApiService} from "../services/api.service";
import {Subscription} from "rxjs";

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

  name = '';
  pageIndex = 0;
  pageSize = 5;
  pageSizes = [5, 10, 15];

  totalProductCount!: number;

  private subscriptions = new Subscription();

  //dependency injection
  constructor(private productApiService: ApiService) {
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
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


  /**
   * This method returns products
   */
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

  getSelectedProducts() {

    this.subscriptions.add(
      this.productApiService.getAllSelectedProducts()
        .subscribe((res) => {
          this.selection.isSelected(res);
          console.log(res);
          console.log(this.selection);
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
    this.getSelectedProducts();
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
