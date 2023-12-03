export type EnvironmentType = 'prod' | 'dev';
export type HasuraRole = 'website-viewer' | 'dev';

export interface Environment {
    type: EnvironmentType;
    useRealData: boolean;
    artificialWaitTime: number;
    graphqlApiRoute?: string;
    hasuraRole?: HasuraRole;
    emailServiceRoute?: string;
    myEmail?: string;
}