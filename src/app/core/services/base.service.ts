import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable()
export abstract class BaseService {
  /**
   * Handles API errors.
   * @param error The error response.
   * @returns An observable with a user-facing error message.
   */
  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  /**
   * Creates the authorization headers.
   * @returns The HttpHeaders with the Authorization token.
   */
  protected getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token'); // Or from a more secure storage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}
