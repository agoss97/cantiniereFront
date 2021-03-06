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
import { ConstraintOUT, ConstraintIN } from '../interfaces/constraint';

@Injectable({
  providedIn: 'root'
})
export class ConstraintService {

  constructor(private http: HttpClient) { }

  constraints(): Observable<ConstraintOUT[]> {
    return (
      this.http
        .get<ConstraintOUT[]>(`${API_URL}/constraint/findall`)
        .pipe(
          map((results) => {
            retry(3),
            catchError(this.handleError);
            return results;
          })
        )
    );
  }

  constraint(constraintId: number): Observable<ConstraintOUT> {
    return (
      this.http
        .get<ConstraintOUT>(`${API_URL}/constraint/find/${constraintId}`)
        .pipe(
          map((results) => {
            retry(3),
            catchError(this.handleError);
            return results;
          })
        )
    );
  }

  update(id: number, constraint: ConstraintIN): Observable<ConstraintOUT> {
    return (
      this.http
        .patch<ConstraintOUT>(`${API_URL}/constraint/update/${id}`, constraint)
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
