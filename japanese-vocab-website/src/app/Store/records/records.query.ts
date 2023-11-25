import { QueryEntity } from '@datorama/akita';
import { RecordsState, RecordsStore } from './records.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RecordsQuery extends QueryEntity<RecordsState> {
  constructor(protected override store: RecordsStore) {
    super(store);
  }
}