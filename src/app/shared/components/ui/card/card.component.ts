import { Component, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';

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
