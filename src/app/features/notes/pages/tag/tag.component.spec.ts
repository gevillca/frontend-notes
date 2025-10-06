import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ConfirmationDialogServiceImpl } from '@shared/services/ui/confirmation/confirmation.service';
import { CONFIRMATION_SERVICE } from '@shared/services/ui/confirmation/interface/confirmation.interface';
import { NOTIFICATION_SERVICE } from '@shared/services/ui/notification/interface/notification.interface';
import { NotificationServiceImpl } from '@shared/services/ui/notification/notification.service';

import TagComponent from './tag.component';

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagComponent],
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

    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
