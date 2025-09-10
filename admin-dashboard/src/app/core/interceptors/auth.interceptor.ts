import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

// Global state for token refresh (shared across function calls)
let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Skip adding token for login and refresh requests
  if (shouldSkipToken(req.url)) {
    return next(req);
  }

  // Add authorization header if token exists
  const authReq = addTokenHeader(req, authService);

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !shouldSkipToken(req.url)) {
        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function shouldSkipToken(url: string): boolean {
  const skipUrls = [
    `${environment.apiUrl}/auth/login`,
    `${environment.apiUrl}/auth/refresh-token`,
    `${environment.apiUrl}/auth/register`
  ];
  return skipUrls.some(skipUrl => url.includes(skipUrl));
}

function addTokenHeader(request: HttpRequest<any>, authService: AuthService): HttpRequest<any> {
  const token = authService.getToken();
  
  if (token) {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }
  return request;
}

function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = authService.getRefreshToken();
    if (refreshToken) {
      return authService.refreshToken().pipe(
        switchMap((result: any): Observable<HttpEvent<any>> => {
          isRefreshing = false;
          refreshTokenSubject.next(result.token);
          return next(addTokenHeader(request, authService));
        }),
        catchError((err) => {
          isRefreshing = false;
          authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      authService.logout();
      return throwError(() => new Error('No refresh token available'));
    }
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((): Observable<HttpEvent<any>> => next(addTokenHeader(request, authService)))
    );
  }
}
