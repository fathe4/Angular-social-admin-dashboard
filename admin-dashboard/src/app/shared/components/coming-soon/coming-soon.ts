import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="coming-soon-container">
      <mat-card class="coming-soon-card">
        <mat-card-content>
          <div class="content">
            <mat-icon class="coming-soon-icon">construction</mat-icon>
            <h2>Coming Soon</h2>
            <p>This page is currently under development. Please check back later!</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .coming-soon-container {
        @apply flex items-center justify-center min-h-full p-8;
      }

      .coming-soon-card {
        @apply max-w-md w-full text-center;
        border-radius: 16px !important;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
      }

      .content {
        @apply py-8 px-4;
      }

      .coming-soon-icon {
        @apply text-blue-500 mx-auto mb-4;
        font-size: 4rem !important;
        width: 4rem !important;
        height: 4rem !important;
      }

      h2 {
        @apply text-2xl font-bold text-gray-900 mb-2 m-0;
      }

      p {
        @apply text-gray-600 leading-relaxed m-0;
      }
    `,
  ],
})
export class ComingSoon {}