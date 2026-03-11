import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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
      // A client-side or network error occurred.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  /**
   * Retrieves authorization headers containing the JWT token.
   * @returns HttpHeaders with Authorization set if token exists, otherwise empty headers.
   */
  protected getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = localStorage.getItem('jwt_token') ?? sessionStorage.getItem('jwt_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}
