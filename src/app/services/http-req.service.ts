import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpMethods } from '../enums/http-methods.enum';

@Injectable({
  providedIn: 'root'
})
export class HttpReqService {

  constructor(private readonly _httpSer: HttpClient) { }

  getDataWithParam(endPoint: string, param?: HttpParams) {
    return this._httpSer.get(`${HttpMethods.BASE_URL}${endPoint}`, { params: param });
  }
}
