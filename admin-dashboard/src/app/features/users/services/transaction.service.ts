import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  reference_type: string;
  reference_id: string;
  transaction_id: string | null;
  created_at: string | null;
  completed_at: string | null;
}

interface TransactionResponse {
  success: boolean;
  data: Transaction[];
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Get all transactions (admin only)
   */
  getAllTransactions(params?: any): Observable<Transaction[]> {
    let httpParams = new HttpParams();
    console.log(this.apiUrl, 'this.apiUrl');

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http
      .get<TransactionResponse>(`${this.apiUrl}/transactions`, { params: httpParams })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get user transactions by user ID
   */
  getUserTransactions(userId: string, params?: any): Observable<Transaction[]> {
    let httpParams = new HttpParams();
      console.log(this.apiUrl, 'this.apiUrl');

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http
      .get<TransactionResponse>(`${this.apiUrl}/transactions/user/${userId}`, { params: httpParams })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('TransactionService error:', error);
    const errorMessage = error.error?.message || error.message || 'An error occurred';
    return throwError(() => new Error(errorMessage));
  }
}
