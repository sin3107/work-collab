// libs/common/src/utils/safe-http.service.ts

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { retry } from 'rxjs/operators';
import { ErrorService } from '@error';
import { AxiosError } from 'axios';

@Injectable()
export class SafeHttpService {
    constructor(
        private readonly httpService: HttpService,
        private readonly errorService: ErrorService,
    ) { }

    async get<T>(url: string, onError: any): Promise<T> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get<T>(url).pipe(retry(2)),
            );
            return data;
        } catch (err) {
            this.throwFormattedError(err, onError);
        }
    }

    async post<T>(url: string, body: any, onError: any): Promise<T> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.post<T>(url, body).pipe(retry(2)),
            );
            return data;
        } catch (err) {
            this.throwFormattedError(err, onError);
        }
    }

    private throwFormattedError(error: unknown, onError: any): never {
        const axiosError = error as AxiosError;

        if (typeof onError === 'function') {
            const result = onError(axiosError);
            if (result === null) {

                return null as never;
            }
            this.errorService.throw(result);
        }

        this.errorService.throw(onError);
    }
}
