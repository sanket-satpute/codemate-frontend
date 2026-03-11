import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../services/toast';

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const toastService = inject(ToastService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unknown error occurred!';

            // Client-side or network error
            if (error.error instanceof ErrorEvent) {
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side errors
                switch (error.status) {
                    case 400:
                        errorMessage = error.error?.message || 'Bad Request (400). Please check your input.';
                        break;
                    case 401:
                        errorMessage = 'Unauthorized (401). Please log in again.';
                        break;
                    case 403:
                        errorMessage = 'Forbidden (403). You do not have permission to access this resource.';
                        break;
                    case 404:
                        errorMessage = 'Resource not found (404).';
                        break;
                    case 409:
                        errorMessage = error.error?.message || 'Conflict (409). The resource already exists.';
                        break;
                    case 413:
                        errorMessage = 'Payload too large (413). Please reduce the file size and try again.';
                        break;
                    case 500:
                        errorMessage = 'Internal Server Error (500). Something went wrong on the server.';
                        break;
                    case 504:
                        errorMessage = 'Gateway Timeout (504). The server is taking too long to respond. This might be due to a large project analysis.';
                        break;
                    case 0:
                        // Often indicates a CORS error, network failure, or timeout when the server simply doesn't respond
                        errorMessage = 'Network Error. The server is not responding or took too long (Possible Timeout).';
                        break;
                    default:
                        errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
                }
            }

            // Show toast notification
            toastService.showError(errorMessage);

            // Re-throw the error so local catchError blocks (if any) can still handle it if they want
            return throwError(() => error);
        })
    );
}
