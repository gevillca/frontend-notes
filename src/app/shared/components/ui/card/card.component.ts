import { Component, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';

/**
 * 🎯 Simple Card Component - YAGNI Principle
 *
 * ========================================
 * KISS: Keep It Simple, Stupid
 * ========================================
 *
 * Solo lo que necesitas AHORA:
 * ✅ Título (opcional)
 * ✅ Subtítulo (opcional)
 * ✅ Imagen (opcional)
 * ✅ Contenido (ng-content)
 * ✅ Acciones (slot)
 *
 * 🚀 USAGE:
 * <app-card title="My Card" imageUrl="image.jpg">
 *   <p>Any content here...</p>
 *   <button card-action>Action</button>
 * </app-card>
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CardModule],
  templateUrl: './card.component.html',
})
export class CardComponent {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly imageUrl = input<string>('');
  readonly loading = input<boolean>(false);

  readonly imageClick = output<string>();

  onImageClick(): void {
    if (this.imageUrl()) {
      this.imageClick.emit(this.imageUrl());
    }
  }
}
