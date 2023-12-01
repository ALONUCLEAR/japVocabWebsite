import { gql } from 'apollo-angular';
import { TestType } from '../Views/home/home.component';

export const getAllRecords = gql`
  query getAllRecords {
    japanese_vocab_records(order_by: {completion_time_in_ms: asc}) {
      id
      user {
        username
      }
      dayNum: day_num
      totalTimeInMs: completion_time_in_ms
      testType: test_type
      dateSet: updated_at
    }
}
`;

export interface GetAllRecordsQuery {
    japanese_vocab_records: {
      id: string,
        user: {
            username: string
        },
        dayNum: number,
        totalTimeInMs: string,
        testType: TestType,
        dateSet: Date
    }[]
}
