import { gql } from 'apollo-angular';
import { TestType } from '../Views/home/home.component';

export const getAllRecords = gql`
  query getAllRecords {
    getAllRecords {
      id
      user {
        username
      }
      dayNum
      totalTimeInMs: completionTimeInMs
      testType
      dateSet: updatedAt
    }
  }
`;

export interface GetAllRecordsQuery {
    getAllRecords: {
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
