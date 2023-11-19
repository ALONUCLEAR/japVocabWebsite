import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Record } from '../Views/home/home.component';
import { GetAllRecordsQuery, getAllRecords } from '../Documents/records.graphql';
import { bigIntStrToNumber } from '../Utils/general.utils';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  constructor(private apollo: Apollo) { }

  public async getAllRecords(): Promise<Record[]> {
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
