import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators/catchError';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WebApiService {
  constructor(private http: HttpClient) {}

  private defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  private formatErrors(error: any) {
    return throwError(() => error);
  }

  apiUrl = 'http://127.0.0.1:8000/api';

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    // const _url = this.apiUrl + path;
    return this.http.get(`${path}`, { params }).pipe(
      map((rs: any) => {
        return rs;
      }),
      catchError(this.formatErrors)
    );
  }

  post(path: string, body: Object = {}): Observable<any> {
    // const _url = this.apiUrl + path;
    return this.http
      .post(`${path}`, JSON.stringify(body), {
        headers: this.defaultHeaders,
      })
      .pipe(
        map((rs: any) => {
          return rs;
        }),
        catchError(this.formatErrors)
      );
  }

  patch(path: string, body: Object = {}): Observable<any> {
    // const _url = this.apiUrl + path;
    return this.http
      .patch(`${path}`, JSON.stringify(body), {
        headers: this.defaultHeaders,
      })
      .pipe(
        map((rs: any) => {
          return rs;
        }),
        catchError(this.formatErrors)
      );
  }

  delete(path: string): Observable<any> {
    // const _url = this.apiUrl + path;
    return this.http.delete(`${path}`).pipe(
      map((rs: any) => {
        return rs;
      }),
      catchError(this.formatErrors)
    );
  }

  private ReturnResponseData(response: any) {
    return response;
  }

  private handleError(error: any) {
    return throwError(error);
  }
}
