import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ConfirmationDialogServiceImpl } from '@shared/services/ui/confirmation/confirmation.service';
import { CONFIRMATION_SERVICE } from '@shared/services/ui/confirmation/interface/confirmation.interface';
import { NOTIFICATION_SERVICE } from '@shared/services/ui/notification/interface/notification.interface';
import { NotificationServiceImpl } from '@shared/services/ui/notification/notification.service';

import NoteComponent from './note.component';

describe('NoteComponent', () => {
  let component: NoteComponent;
  let fixture: ComponentFixture<NoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        ConfirmationService,
        MessageService,
        {
          provide: CONFIRMATION_SERVICE,
          useClass: ConfirmationDialogServiceImpl,
        },
        {
          provide: NOTIFICATION_SERVICE,
          useClass: NotificationServiceImpl,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
