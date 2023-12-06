import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from '@services/storage.service';
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
export class TableComponent<TData> implements AfterViewInit, OnInit, OnChanges {
  @Input() columns: TableField[] = [];
  @Input() pageSizeOptions: number[] = [5, 10, 25];
  @Input() tableName?: string;
  @Input() dataSource: MatTableDataSource<TData> = new MatTableDataSource();
  @Input() sortableIconColor?: string;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  previouslySortedField?: string;
  sortDirection: number = 1;
  originalDataOrder: TData[] = [];
  columnNames: string[] = [];

  constructor(private storageService: StorageService) {}
  ngOnInit(): void {
    this.columnNames = this.columns.map(({ name }) => name);
    this.originalDataOrder = this.dataSource.data.slice();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      //resert original data order every time hasChanged is toggled
      this.originalDataOrder = this.dataSource.data.slice();
      this.initPaginator();
      
      if (this.previouslySortedField && this.sortDirection !== 0) {
        const sortedColumn = this.columns.find(({name}) => name === this.previouslySortedField)!;
        this.sortWithoutChanging(sortedColumn.sortFunc!, this.previouslySortedField as keyof TData);
      }
    }
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

  initPaginator() {
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
  }

  ngAfterViewInit(): void {
    this.initPaginator();
  }

  sortData<T>(sortFunc: SortFunc<T>, fieldName: string): void {
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

    this.sortWithoutChanging(sortFunc, fieldName as keyof TData);
  }

  sortWithoutChanging<T>(sortFunc: SortFunc<T>, field: keyof TData): void {
    const data: TData[] = this.dataSource.data.slice();
    data.sort((prev, curr) => sortFunc(prev[field] as T, curr[field] as T) * this.sortDirection);
    this.dataSource.data = this.sortDirection === 0 ? this.originalDataOrder.slice() : data;
  }
}
