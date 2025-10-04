import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [RouterModule, CommonModule, StyleClassModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {}
