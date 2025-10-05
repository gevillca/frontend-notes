import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TextareaModule } from 'primeng/textarea';

import { Note } from '../../interfaces/notes.interface';
import { Tag } from '../../interfaces/tag.interface';

@Component({
  selector: 'app-note-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    InputTextModule,
    TextareaModule,
    SelectButtonModule,
  ],
  templateUrl: './note-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  note = input<Note | null>(null);
  availableTags = input<Tag[]>([]);

  save = output<Partial<Note>>();
  formCancel = output<void>();

  noteForm!: FormGroup;

  constructor() {
    // Effect to update form when note input changes
    effect(() => {
      const currentNote = this.note();
      if (currentNote && this.noteForm) {
        this.noteForm.patchValue({
          title: currentNote.title,
          content: currentNote.content,
          tags: currentNote.tags,
        });
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const currentNote = this.note();

    this.noteForm = this.formBuilder.group({
      title: [currentNote?.title || '', [Validators.required, Validators.minLength(1)]],
      content: [currentNote?.content || ''],
      tags: [currentNote?.tags || []],
    });
  }

  isEditing(): boolean {
    return this.note() !== null;
  }

  toggleTag(tagId: string): void {
    const currentTags = this.noteForm.get('tags')?.value || [];
    const index = currentTags.indexOf(tagId);

    if (index > -1) {
      currentTags.splice(index, 1);
    } else {
      currentTags.push(tagId);
    }

    this.noteForm.patchValue({ tags: currentTags });
  }

  getWordCount(): number {
    const content = this.noteForm.get('content')?.value || '';
    return content
      .trim()
      .split(/\s+/)
      .filter((word: string) => word.length > 0).length;
  }

  getReadTime(): number {
    const wordsPerMinute = 200;
    return Math.max(1, Math.ceil(this.getWordCount() / wordsPerMinute));
  }

  onSave(): void {
    if (this.noteForm.invalid) return;

    const formValue = this.noteForm.value;
    const noteData: Partial<Note> = {
      title: formValue.title.trim(),
      content: formValue.content.trim(),
      tags: formValue.tags,
      lastEdited: new Date(),
      metadata: {
        wordCount: this.getWordCount(),
        readTimeMin: this.getReadTime(),
      },
    };

    if (this.isEditing()) {
      noteData.id = this.note()!.id;
      noteData.version = (this.note()!.version || 0) + 1;
    } else {
      noteData.id = 'note-' + Date.now();
      noteData.version = 1;
      noteData.archived = false;
      noteData.isFavorite = false;
      noteData.ownerId = 'user-01'; // This should come from auth service
      noteData.notebookId = 'nb-01'; // This should be configurable
      noteData.sharedWith = [];
      noteData.attachments = [];
    }

    this.save.emit(noteData);
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }
}
