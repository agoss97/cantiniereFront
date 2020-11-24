import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

import { API_URL } from '../constants/api-url';

import { handleError } from '../constants/handle-http-errors';
import { Order } from '../interfaces/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getTodayOrdersOfUser(userId: number): Observable<Order[]> {
    return (
      this.http
        .get<Order[]>(`${API_URL}/order/findallforusertoday/${userId}`)
        .pipe(
          map((results) => {
            retry(3),
            catchError(this.handleError);
            return results;
          })
        )
    );
  }

  getOngoingOrdersOfUser(userId: number): Observable<Order[]> { // mettre le status 0 (created)
    return (
      this.http
        .get<Order[]>(`${API_URL}/order/findallforuser/${userId}`)
        .pipe(
          map((results) => {
            retry(3),
            catchError(this.handleError);
            return results;
          })
        )
    );
  }

  getAllOrdersOfUser(userId: number): Observable<Order[]> {
    return (
      this.http
        .get<Order[]>(`${API_URL}/order/findallforuser/${userId}`)
        .pipe(
          map((results) => {
            retry(3),
            catchError(this.handleError);
            return results;
          })
        )
    );
  }

  add(order: Order): Observable<Order> {
    console.log(order);
    return (
      this.http
        .patch<Order>(`${API_URL}/order/add`, order)
        .pipe(
          map((results) => {
            retry(3),
            catchError(this.handleError);
            return results;
          })
        )
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error(
        `A client-side or network error occurred: ${error.error.message} || `,
        error.error.message
      );
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }

    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
