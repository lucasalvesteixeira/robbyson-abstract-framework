'use strict';

import { Path, PathParam, ContextRequest, POST, GET, Errors, DELETE, QueryParam, PUT, Abstract } from 'typescript-rest';
import { BaseService } from './base.service';
import { BaseModel } from './base.model';
import * as Joi from 'joi';
import express = require('express');

// import { ResultModel } from './result.model';
// import logger from '../utils/logger';
// const winston = require('winston');
@Abstract
export abstract class BaseController<T extends BaseModel> {

    constructor(protected service: BaseService<T>) { }

    protected abstract getValidationSchema(): Joi.Schema;
    protected abstract getEndpointAuth(): any;

    @GET
    @Path('/list/:recordsByPage/:page/:sort')
    protected list(
        @ContextRequest req: express.Request,
        @PathParam('recordsByPage') recordsByPage: number,
        @PathParam('page') page: number,
        @PathParam('sort') sort: boolean,
        @QueryParam('filter') filter?: string
    ): Promise<Array<T>> {
    // ): Promise<ResultModel> {
        return new Promise((resolve, reject) => {
            if(this.getEndpointAuth().list) {
                this.service.list(
                    (req as any).contractor_id,
                    recordsByPage,
                    page,
                    sort,
                    filter
                )
                // .then((data) => { resolve(new ResultModel(data.length, 'handle_success', data)); })
                .then(resolve)
                .catch(reject);
            } else {
                // logger.info(BaseController.name + ' - ' + 'Unauthorized route');
                // winston.info('TESTE...');
                throw new Errors.UnauthorizedError('Unauthorized route');
            }
        });
    }

    @GET
    @Path('/get/:id')
    protected get(@ContextRequest req: express.Request, @PathParam('id') _id: string): Promise<T> {
        return new Promise((resolve, reject) => {
            if(this.getEndpointAuth().get) {
                this.service.get((req as any).contractor_id, _id)
                .then(resolve)
                .catch(reject);
            } else {
                throw new Errors.UnauthorizedError('Unauthorized route');
            }
        });
    }

    @POST
    @Path('/create')
    protected create(@ContextRequest req: express.Request, entities: Array<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            if(this.getEndpointAuth().create) {
                this.validateEntity(entities)
                    .catch(err => {throw new Errors.BadRequestError(JSON.stringify(err));})
                    .then(() => {
                        this.service.create((req as any).contractor_id, entities)
                            .then((newData) => resolve(newData))
                            .catch(reject);
                    }).catch(reject);
            } else {
                throw new Errors.UnauthorizedError('Unauthorized route');
            }
        });
    }

    @DELETE
    @Path('/delete')
    protected delete(@ContextRequest req: express.Request, _ids: Array<string>): Promise<Array<T>> {
        return new Promise((resolve, reject) => {
            if(this.getEndpointAuth().delete) {
                this.service.delete((req as any).contractor_id, _ids)
                    .then(resolve)
                    .catch(reject);
            } else {
                throw new Errors.UnauthorizedError('Unauthorized route');
            }
        });
    }

    @PUT
    @Path('/update/:id')
    protected update(@ContextRequest req: express.Request, @PathParam('id') _id: string, entity: T): Promise<T> {
        return new Promise((resolve, reject) => {
            if(this.getEndpointAuth().update) {
                this.validateEntity([entity])
                    .catch(err => {throw new Errors.BadRequestError(JSON.stringify(err));})
                    .then(() => {
                        this.service.update((req as any).contractor_id, _id, entity)
                            .then((updatedData) => resolve(updatedData))
                            .catch(reject);
                    }).catch(reject);
            } else {
                throw new Errors.UnauthorizedError('Unauthorized route');
            }
        });
    }

    protected validateEntity(entities: Array<T>): Promise<Array<T>> {
        const schema: Joi.Schema = this.getValidationSchema();
        return new Promise((resolve, reject) => {
            let promises = null;
            if(!schema) {
                return resolve(entities);
            }
            promises = entities.map(entity => {
                return Joi.validate(entity, this.getValidationSchema(), (err: any, value: T) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve([value]);
                    }
                });
            });
            return Promise.all(promises);
        });
    }
}
