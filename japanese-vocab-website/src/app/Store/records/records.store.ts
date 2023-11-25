import { EntityState, EntityStore, StoreConfig, persistState } from '@datorama/akita';
import { RecordWithId } from 'src/app/Services/records.service';

export interface RecordsState extends EntityState<RecordWithId, string> { }

@StoreConfig({ name: 'records', resettable: true })
export class RecordsStore extends EntityStore<RecordsState> {
  constructor() {
    super();
  }
}

export const persistRecordsStorage = persistState({
  include: ['records'],
  key: 'persistRecords',
});

const providers = [{ provide: 'persistStorage', useValue: persistRecordsStorage }];