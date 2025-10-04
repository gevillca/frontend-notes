import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';

import { LoadingService } from '@shared/services/ui/loading/loading.service';

@Component({
  selector: 'app-loading',
  imports: [ProgressSpinner],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  protected readonly loadingService = inject(LoadingService);
}
