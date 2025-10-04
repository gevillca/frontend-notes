import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { NOTIFICATION_SERVICE, NotificationService } from './interface/notification.interface';
import { NotificationServiceImpl } from './notification.service';

describe('NotificationServiceImpl', () => {
  let service: NotificationService;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add', 'clear']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: NOTIFICATION_SERVICE, useClass: NotificationServiceImpl },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    });

    service = TestBed.inject(NOTIFICATION_SERVICE);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success()', () => {
    it('should call MessageService.add with the provided message as summary', () => {
      // Arrange
      const message = 'Operation completed successfully';

      // Act
      service.success(message);

      // Assert
      expect(messageServiceSpy.add).toHaveBeenCalledOnceWith({
        severity: 'success',
        summary: message,
        life: 3000,
        icon: 'pi pi-check',
        closable: true,
        key: 'br',
      });
    });

    it('should call MessageService.add with custom duration', () => {
      // Arrange
      const message = 'User registered successfully';
      const customDuration = 5000;

      // Act
      service.success(message, { duration: customDuration });

      // Assert
      expect(messageServiceSpy.add).toHaveBeenCalledOnceWith({
        severity: 'success',
        summary: message,
        life: customDuration,
        icon: 'pi pi-check',
        closable: true,
        key: 'br',
      });
    });

    it('should handle custom closable option', () => {
      // Arrange
      const message = 'Success message';

      // Act
      service.success(message, { closable: false });

      // Assert
      expect(messageServiceSpy.add).toHaveBeenCalledOnceWith({
        severity: 'success',
        summary: message,
        life: 3000,
        icon: 'pi pi-check',
        closable: false,
        key: 'br',
      });
    });

    it('should be called only once per invocation', () => {
      // Act
      service.success('Test message');

      // Assert
      expect(messageServiceSpy.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('error()', () => {
    it('should call MessageService.add with error configuration', () => {
      // Arrange
      const message = 'An error occurred';

      // Act
      service.error(message);

      // Assert
      expect(messageServiceSpy.add).toHaveBeenCalledOnceWith({
        severity: 'error',
        summary: message,
        life: 5000,
        icon: 'pi pi-times',
        closable: true,
        key: 'br',
      });
    });
  });

  describe('info()', () => {
    it('should call MessageService.add with info configuration', () => {
      // Arrange
      const message = 'Information message';

      // Act
      service.info(message);

      // Assert
      expect(messageServiceSpy.add).toHaveBeenCalledOnceWith({
        severity: 'info',
        summary: message,
        life: 4000,
        icon: 'pi pi-info-circle',
        closable: true,
        key: 'br',
      });
    });
  });

  describe('warn()', () => {
    it('should call MessageService.add with warn configuration', () => {
      // Arrange
      const message = 'Warning message';

      // Act
      service.warn(message);

      // Assert
      expect(messageServiceSpy.add).toHaveBeenCalledOnceWith({
        severity: 'warn',
        summary: message,
        life: 4500,
        icon: 'pi pi-exclamation-triangle',
        closable: true,
        key: 'br',
      });
    });
  });

  describe('clear()', () => {
    it('should call MessageService.clear', () => {
      // Act
      service.clear();

      // Assert
      expect(messageServiceSpy.clear).toHaveBeenCalledOnceWith();
    });
  });
});
