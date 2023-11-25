import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Record, TestType } from '../Views/home/home.component';
import { GetAllRecordsQuery, getAllRecords } from '../Documents/records.graphql';
import { bigIntStrToNumber, randInt, randStr } from '../Utils/general.utils';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';

export interface RecordWithId extends Record {
  id: string;
}

const generateMockData = () => {
  const mockData: RecordWithId[] = [];
  for (let index = 0; index < 1000; index++) {
    mockData.push({
      id: uuidv4(),
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

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  constructor(private apollo: Apollo) { }

  public async getAllRecords(): Promise<RecordWithId[]> {
    if (!environment.useRealData) {
      return generateMockData();
    }
    
    const res = await this.apollo.query<GetAllRecordsQuery>({
      query: getAllRecords
    }).toPromise();

    return res?.data?.getAllRecords.map(graphqlRecord => ({
      ...graphqlRecord,
      username: graphqlRecord.user.username,
      totalTime: bigIntStrToNumber(graphqlRecord.totalTimeInMs),
      dateSet: new Date(graphqlRecord.dateSet)
    })) ?? [];
  }
}
