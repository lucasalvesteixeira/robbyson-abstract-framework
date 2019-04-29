'use strict';

import { BaseModel } from './base.model';
import { Abstract } from 'typescript-rest';

const modelProvider = require('robbyson-library').mongodb.modelProvider;

@Abstract
export abstract class BaseRepository<T extends BaseModel> {

    robbysonProvider: any = null;

    init(schema: string, contractorId: number) {
        if(contractorId) {
            this.robbysonProvider = modelProvider.getByContractorId(contractorId, require(`../schemas/${schema}`));
        } else {
            this.robbysonProvider = modelProvider.getStaticConnectionByName('robbyson', require(`../schemas/${schema}`));
        }
    }

    public list(schema: string, contractorId: number, recordsByPage: number, page: number, sort: boolean, filter?: string): Promise<Array<T>> {
        this.init(schema, contractorId);
        return this.robbysonProvider.find(filter ? JSON.parse(filter) : null)
            .skip(recordsByPage * (page-1))
            .limit(recordsByPage)
            .sort(sort ? { _id: -1 } : {});
    }

    public get(schema: string, contractorId: number, _id: string): Promise<T> {
        this.init(schema, contractorId);
        return this.robbysonProvider.findOne({'_id': _id});
    }

    public create(schema: string, contractorId: number, entities: Array<T>): Promise<T> {
        this.init(schema, contractorId);
        return this.robbysonProvider.insertMany(entities);
    }

    public delete(schema: string, contractorId: number, _ids: Array<string>): Promise<Array<T>> {
        this.init(schema, contractorId);
        const promises = _ids.map(_id => { return this.robbysonProvider.remove({'_id': _id}); });
        return Promise.all(promises);
    }

    public update(schema: string, contractorId: number, _id: string, entity: T): Promise<T> {
        this.init(schema, contractorId);
        // return this.robbysonProvider.findOneAndUpdate({'_id': _id}, entity); // returns the object to be changed
        return this.robbysonProvider.update({'_id': _id}, entity);
    }

}
