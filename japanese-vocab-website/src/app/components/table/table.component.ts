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
}

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

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(private storageService: StorageService) {}

  columnNames: string[] = [];
  ngOnInit(): void {
    this.columnNames = this.columns.map(({ name }) => name);
  }

  savePageSettings(ev: PageEvent): void {
    if (!this.tableName) return;

    const config: PageSettings = { pageSize: ev.pageSize, pageIndex: ev.pageIndex };
    this.storageService.setSessionStorage(`${this.tableName} Config`, JSON.stringify(config));
  }

  ngAfterViewInit(): void {
    if(this.paginator) {
      const { pageSize, pageIndex} = this.storageService.getStorage<PageSettings>(`${this.tableName} Config`, true)
        ?? {pageSize: this.pageSizeOptions[0], pageIndex: 0};
      this.paginator.pageSize = pageSize; this.paginator.pageIndex = pageIndex;
      this.dataSource.paginator = this.paginator;  
    }
    
    this.dataSource.sort = this.sort ?? null;
  }

  sortData<T>(sortFunc: SortFunc<T>, fieldName: string): void {
    const field = fieldName as keyof TData;
    const data: TData[] = this.dataSource.data.slice();
    data.sort((prev, curr) => sortFunc(prev[field] as T, curr[field] as T));
  }
}
