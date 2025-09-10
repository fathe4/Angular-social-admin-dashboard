import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TransactionService, Transaction } from '../../services/transaction.service';
import { TransactionTableComponent } from '../../../../shared/components/transaction-table/transaction-table.component';
import { Observable, of, Subject, takeUntil, catchError, finalize } from 'rxjs';

@Component({
  selector: 'user-transactions',
  standalone: true,
  imports: [CommonModule, TransactionTableComponent],
  templateUrl: './user-transactions.component.html',
})
export class UserTransactionsComponent implements OnInit, OnDestroy {
  userId: string | null = null;
  transactions$: Observable<Transaction[]> = of([]);
  loading = false;
  error: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly transactionService: TransactionService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.route.parent) {
      console.warn('No parent route found');
      return;
    }

    this.route.parent.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.userId = params['id'] || null;

      if (this.userId) {
        this.loadTransactions();
      }
    });
  }

  private loadTransactions(): void {
    if (!this.userId) {
      console.error('No user ID available');
      return;
    }

    this.loading = true;
    this.error = null;

    this.transactions$ = this.transactionService.getUserTransactions(this.userId).pipe(
      catchError((error) => {
        console.error('Error loading transactions:', error);
        this.error = 'Failed to load transactions';
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTransactionClick(transaction: Transaction): void {
    console.log('Transaction clicked:', transaction);
    // TODO: Navigate to transaction details
  }

  onUserClick(userId: string): void {
    console.log('User clicked:', userId);
    // TODO: Navigate to user profile
  }
}
