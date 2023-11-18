import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from 'src/app/Services/storage.service';
import {
  FilterInput,
  FilterOutput,
} from 'src/app/components/filter/filter.component';
import { TableField } from 'src/app/components/table/table.component';
//Maybe will be generated with codegen later on
enum TestType {
  SingleDay = 'SingleDay',
  Review = 'Review',
}

interface Record {
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

const fullMockData: Record[] = [
  {
    username: 'single',
    testType: TestType.SingleDay,
    dayNum: 13,
    totalTime: 25.327,
    dateSet: new Date(2023, 10, 17, 14, 15),
  },
  {
    username: 'review',
    testType: TestType.Review,
    dayNum: 9,
    totalTime: 55.463,
    dateSet: new Date(),
  },
  {
    username: 'Longus Namus',
    testType: TestType.SingleDay,
    dayNum: 160,
    totalTime: 90.54,
    dateSet: new Date(2023, 10, 3, 17, 53)
  }
];
[1, 1, 1, 1, 1, 1, 1].forEach((_) =>
  fullMockData.push(...fullMockData)
);

interface FilterableField<TData> extends FilterInput {
  filterFunc(data: TData, target: any): boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent {
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
  constructor(private storageService: StorageService) {
    this.selectedTabIndex =
      this.storageService.getStorage('tabIndex', true) ?? 0;
    this.testTypeOptions = Object.values(TestType);
    const displayData = fullMockData.map((record) => ({
      ...record,
      dateSet: record.dateSet.toLocaleDateString('en-uk', {year: '2-digit', month: 'short', day: 'numeric'})
    }));
    this.testTypeOptions.forEach((type) => {
      const source: MatTableDataSource<DisplayRecord> =
        new MatTableDataSource();
      source.data = displayData.filter(({ testType }) => testType === type);
      this.sources[type] = source;
    });
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
