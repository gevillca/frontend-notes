import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-note',
  imports: [],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NoteComponent {}
