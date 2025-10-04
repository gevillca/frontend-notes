import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _isLoading = signal(false);
  private _requestCount = 0;

  // Public readonly signal
  readonly isLoading = this._isLoading.asReadonly();

  start(): void {
    this._requestCount++;
    this._isLoading.set(true);
  }

  stop(): void {
    this._requestCount = Math.max(0, this._requestCount - 1);
    if (this._requestCount === 0) {
      this._isLoading.set(false);
    }
  }
}
