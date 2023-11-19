export type EnvironmentType = 'prod' | 'dev';

export interface Environment {
    type: EnvironmentType;
    useRealData: boolean;
}