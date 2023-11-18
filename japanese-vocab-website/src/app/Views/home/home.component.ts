import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RecordsService } from 'src/app/Services/records.service';
import { StorageService } from 'src/app/Services/storage.service';
import {
  FilterInput,
  FilterOutput,
} from 'src/app/components/filter/filter.component';
import { TableField } from 'src/app/components/table/table.component';
//Until I fix the playground and could generated with codegen later on
export enum TestType {
  SingleDay = 'SingleDay',
  Review = 'Review',
}

export interface Record {
  username: string;
  testType: TestType;
  dayNum: number;
  totalTime: number;
  dateSet: Date;
}

interface DisplayRecord {
  username: string;
  dayNum: number;
  totalTime: number;
  dateSet: string;
}

interface FilterableField<TData> extends FilterInput {
  filterFunc(data: TData, target: any): boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  isLoading: boolean = true;
  tableFields: TableField[] = [
    { name: 'username', title: 'User' },
    { name: 'dayNum', title: 'Day' },
    // {name: 'testType', title: 'TestType'},
    {
      name: 'totalTime',
      title: 'Time (sec)',
      sortFunc: (prev: number, curr: number) => prev - curr,
    },
    {
      name: 'dateSet',
      title: 'Date Set',
      sortFunc: (prev: string, curr: string) =>
        new Date(curr).getTime() - new Date(prev).getTime(),
    },
  ];

  filterableFields: FilterableField<DisplayRecord>[] = [
    {
      name: 'User',
      filterFunc: ({ username }: DisplayRecord, text: string) =>
        username.toLowerCase().includes((text ?? '').toLowerCase()),
    },
    {
      name: 'Day',
      type: 'number',
      filterFunc: ({ dayNum }: DisplayRecord, target: number) =>
        dayNum.toString().includes((target ?? '').toString()),
    },
  ];

  tableOptions = ['Global', 'User'];
  testTypeOptions: TestType[];
  testTypeDisplayNames = {
    SingleDay: 'Test',
    Review: 'Review',
  };
  chosenOptions = {
    username: undefined,
    testType: TestType.SingleDay,
  };
  sources: { [key: string]: MatTableDataSource<DisplayRecord> } = {};
  selectedTabIndex: number;

  filterFields: FilterInput[] = this.filterableFields.map(({ name, type }) => ({
    name,
    type,
  }));
  constructor(
    private storageService: StorageService,
    private recordsService: RecordsService
  ) {
    this.selectedTabIndex =
      this.storageService.getStorage('tabIndex', true) ?? 0;
    this.testTypeOptions = Object.values(TestType);
  }
  
  data: Record[] = []; 

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.data = await this.recordsService.getAllRecords();
    const displayData = this.data.map((record) => ({
      ...record,
      dateSet: record.dateSet.toLocaleDateString('en-uk', {
        year: '2-digit',
        month: 'short',
        day: 'numeric',
      }),
    }));
    this.testTypeOptions.forEach((type) => {
      const source: MatTableDataSource<DisplayRecord> =
        new MatTableDataSource();
      source.data = displayData.filter(({ testType }) => testType === type);
      this.sources[type] = source;
    });
     this.isLoading = false;
  }

  selectTab(index: number): void {
    this.storageService.setSessionStorage('tabIndex', index.toString());
    $('html').scrollTop(0);
  }
  changeFilters(type: TestType, value: FilterOutput): void {
    this.sources[type].filterPredicate = (data, _) =>
      this.filterableFields.every(({ filterFunc, name }) =>
        filterFunc(data, value[name])
      );
    //basically just here to trigger the filterring
    this.sources[type].filter = value['username'] ?? value['day'];
  }
}
