'use strict';

import { BaseRepository } from './base.repository';
import { BaseModel } from './base.model';
import { Inject } from 'typescript-ioc';
import { Abstract } from 'typescript-rest';

@Abstract
export abstract class BaseService<T extends BaseModel> {

    @Inject
    private repository: BaseRepository<T>;

    protected abstract getSchemaName(): string;

    list(contractorId: number, recordsByPage: number, page: number, sort: boolean, filter?: string): Promise<Array<T>> {
        return new Promise((resolve, reject) => {
            this.repository.list(this.getSchemaName(), contractorId, recordsByPage, page, sort, filter)
                .then(resolve)
                .catch(reject);
        });
    }

    get(contractorId: number, _id: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.repository.get(this.getSchemaName(), contractorId, _id)
                .then(resolve)
                .catch(reject);
        });
    }

    create(contractorId: number, entities: Array<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.repository.create(this.getSchemaName(), contractorId, entities)
                .then(resolve)
                .catch(reject);
        });
    }

    delete(contractorId: number, _ids: Array<string>): Promise<Array<T>> {
        return new Promise((resolve, reject) => {
            this.repository.delete(this.getSchemaName(), contractorId, _ids)
                .then(resolve)
                .catch(reject);
        });
    }

    update(contractorId: number, _id: string, entity: T): Promise<T> {
        return new Promise((resolve, reject) => {
            this.repository.update(this.getSchemaName(), contractorId, _id, entity)
                .then(resolve)
                .catch(reject);
        });
    }

}
