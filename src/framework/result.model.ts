'use strict';

export class ResultModel {
    constructor(
        n: number,
        handle: string,
        data: object,
        operationTime?: string
    ) {
        this.n = n;
        this.handle = handle;
        this.data = data;
        this.operationTime = operationTime;
    }

    n: number;
    handle: string;
    data: object;
    operationTime?: string;
}
