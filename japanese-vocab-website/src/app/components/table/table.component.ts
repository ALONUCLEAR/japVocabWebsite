import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from 'src/app/Services/storage.service';
export type SortFunc<T> = (prev: T, curr: T) => number;

export interface TableField<T = any> {
  name: string;
  title?: string;
  sortFunc?: SortFunc<T>;
}

type PageSettings = {
  pageSize: number;
  pageIndex: number;
};

@Component({
  selector: 'data-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less'],
})
export class TableComponent<TData> implements AfterViewInit, OnInit {
  @Input() columns: TableField[] = [];
  @Input() pageSizeOptions: number[] = [5, 10, 25];
  @Input() tableName?: string;
  @Input() dataSource: MatTableDataSource<TData> = new MatTableDataSource();
  @Input() sortableIconColor?: string;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  previouslySortedField?: string;
  sortDirection: number = 1;
  originalDataOrder: TData[] = [];
  columnNames: string[] = [];

  constructor(private storageService: StorageService) {}
  ngOnInit(): void {
    this.columnNames = this.columns.map(({ name }) => name);
    this.originalDataOrder = this.dataSource.data.slice();
  }

  savePageSettings(ev: PageEvent): void {
    if (!this.tableName) return;

    const config: PageSettings = {
      pageSize: ev.pageSize,
      pageIndex: ev.pageIndex,
    };

    this.storageService.setSessionStorage(
      `${this.tableName} Config`,
      JSON.stringify(config)
    );
  }

  initPaginatorAndSort() {
    if (this.paginator) {
      const { pageSize, pageIndex } =
        this.storageService.getStorage<PageSettings>(
          `${this.tableName} Config`,
          true
        ) ?? { pageSize: this.pageSizeOptions[0], pageIndex: 0 };
      this.paginator.pageSize = pageSize;
      this.paginator.pageIndex = pageIndex;
      this.dataSource.paginator = this.paginator;
    }

    this.dataSource.sort = this.sort ?? null;
  }

  ngAfterViewInit(): void {
    this.initPaginatorAndSort();
  }

  sortData<T>(sortFunc: SortFunc<T>, fieldName: string): void {
    const field = fieldName as keyof TData;

    if (this.previouslySortedField === fieldName) {
      switch (this.sortDirection) {
        case 0:
          this.sortDirection = 1;
          break;
        case 1:
          this.sortDirection = -1;
          break;
        default:
          this.sortDirection = 0;
          break;
      }
    } else {
      this.previouslySortedField = fieldName;
      this.sortDirection = 1;
    }

    const data: TData[] = this.dataSource.data.slice();
    data.sort((prev, curr) => sortFunc(prev[field] as T, curr[field] as T) * this.sortDirection);
    this.dataSource.data = this.sortDirection === 0 ? this.originalDataOrder.slice() : data;
  }
}
