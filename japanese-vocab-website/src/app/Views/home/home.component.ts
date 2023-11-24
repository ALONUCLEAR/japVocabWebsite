import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RecordsService } from 'src/app/Services/records.service';
import { StorageService } from 'src/app/Services/storage.service';
import {
  FilterInput,
  FilterOutput,
} from 'src/app/components/filter/filter.component';
import { TableField } from 'src/app/components/table/table.component';
import { environment } from 'src/environments/environment';

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

const randInt = (min: number = 0, max: number = 10) =>
  min + Math.floor(Math.random() * (max - min));
const randStr = (len: number = 8): string => {
  let str = '';
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(97 + randInt(0, 25));
  }

  return str;
};

const generateMockData = () => {
  const mockData: Record[] = [];
  for (let index = 0; index < 1000; index++) {
    mockData.push({
      dateSet: new Date(
        randInt(new Date(2020, 1, 1).getTime(), new Date().getTime())
      ),
      username: randStr(),
      dayNum: randInt(1, 150),
      testType: randInt(0, 2) === 0 ? TestType.SingleDay : TestType.Review,
      totalTime: randInt(5, 250),
    });
  }

  return mockData;
};

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

    if (environment.useRealData) {
      this.data = await this.recordsService.getAllRecords();
    } else {
      this.data = generateMockData();
    }

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
    setTimeout(() => {
      this.isLoading = false;
    }, environment.artificialWaitTime);
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
    this.sources[type].filter = value['User'] ?? value['Day'];
  }
}
