import { inject, Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Observable, Subject, take } from 'rxjs';

import { Confirmation } from './interface/confirmation.interface';

interface ConfirmationOptions {
  message: string;
  header?: string;
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptButtonStyleClass?: string;
  rejectButtonStyleClass?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogServiceImpl implements Confirmation {
  private readonly confirmationService = inject(ConfirmationService);

  confirmDelete(message?: string): Observable<boolean> {
    return this.confirm({
      message: message || 'Are you sure you want to delete this item?',
      header: 'Delete Note',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete Note',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
    });
  }

  confirmArchive(message?: string): Observable<boolean> {
    return this.confirm({
      message: message || 'Are you sure you want to archive this item?',
      header: 'Archive Note',
      icon: 'pi pi-inbox',
      acceptLabel: 'Archive Note',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-secondary',
    });
  }

  private confirm(options: ConfirmationOptions): Observable<boolean> {
    const subject = new Subject<boolean>();

    this.confirmationService.confirm({
      message: options.message,
      header: options.header,
      icon: options.icon,
      acceptLabel: options.acceptLabel || 'Yes',
      rejectLabel: options.rejectLabel || 'No',
      acceptButtonStyleClass: options.acceptButtonStyleClass,
      rejectButtonStyleClass: options.rejectButtonStyleClass,
      accept: () => {
        subject.next(true);
        subject.complete();
      },
      reject: () => {
        subject.next(false);
        subject.complete();
      },
    });

    return subject.asObservable().pipe(take(1));
  }
}
