import { FetchSettings } from '../jsonapi-source';
import { Source, Query, Transform } from '@orbit/data';
export interface Filter {
    [filterOn: string]: any;
}
export interface RequestOptions {
    filter?: Filter[];
    sort?: any;
    page?: any;
    include?: any;
    settings?: FetchSettings;
}
export declare function customRequestOptions(source: Source, queryOrTransform: Query | Transform): RequestOptions;
export declare function buildFetchSettings(options?: RequestOptions, customSettings?: FetchSettings): FetchSettings;
