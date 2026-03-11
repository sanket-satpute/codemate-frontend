import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * HTTP interceptor that unwraps the backend BaseResponse<T> envelope.
 *
 * Backend wraps all API responses in:
 *   { success: boolean, message: string, data: T, timestamp: string }
 *
 * This interceptor extracts .data so that frontend services receive T directly.
 * Non-JSON responses (e.g., blob downloads) are passed through unchanged.
 */
export function BaseResponseInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    return next(request).pipe(
        map(event => {
            if (event instanceof HttpResponse && event.body) {
                const body = event.body as any;

                // Only unwrap if the response matches the BaseResponse shape
                if (
                    typeof body === 'object' &&
                    body !== null &&
                    'success' in body &&
                    'data' in body &&
                    'message' in body
                ) {
                    if (!body.success) {
                        throw new Error(body.message || 'Request failed');
                    }
                    return event.clone({ body: body.data });
                }
            }
            return event;
        })
    );
}
