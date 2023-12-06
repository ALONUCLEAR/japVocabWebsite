import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RecordsService } from 'src/app/Services/records.service';
import { StorageService } from 'src/app/Services/storage.service';
import { RecordsQuery } from 'src/app/Store/records/records.query';
import { RecordsStore } from 'src/app/Store/records/records.store';
import {
  FilterInput,
  FilterOutput,
} from 'src/app/components/filter/filter.component';
import { TableField } from 'src/app/components/table/table.component';
import { environment } from 'src/environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { defaultDateSort, defaultNumSort } from 'src/app/Utils/sorting.utils';

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

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  isLoading: boolean = true;
  tableFields: TableField[] = [
    { 
      name: 'username',
      title: 'User',
    },
    { 
      name: 'dayNum',
      title: 'Day',
      sortFunc: defaultNumSort, 
    },
    {
      name: 'totalTime',
      title: 'Time(sec)',
      sortFunc: defaultNumSort,
    },
    {
      name: 'dateSet',
      title: 'Date Set',
      sortFunc: defaultDateSort,
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
  finishedFetching: boolean = false;

  constructor(
    private readonly storageService: StorageService,
    private readonly recordsService: RecordsService,
    private readonly recordsStore: RecordsStore,
    private readonly recordsQuery: RecordsQuery,
    private readonly router: Router,
  ) {
    this.selectedTabIndex =
      this.storageService.getStorage('tabIndex', true) ?? 0;
    this.testTypeOptions = Object.values(TestType);
  }

  data: Record[] = [];

  moveToAboutSection(sectionId: string): void {
    this.storageService.setSessionStorage('startSection', sectionId);
    this.router.navigate(['about']);
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.finishedFetching = false;

    this.recordsQuery.selectAll().pipe(untilDestroyed(this)).subscribe(records => {
      if (!records) {
        return;
      }

      this.data = [...records].filter(Boolean)
        .map(record => ({...record, dateSet: new Date(record.dateSet)}));

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

      this.finishedFetching = true;
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
