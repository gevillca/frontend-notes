import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TextareaModule } from 'primeng/textarea';

import { AuthService } from '@features/auth/services/auth.service';
import { Note } from '@features/notes/interfaces/notes.interface';
import { Tag } from '@features/notes/interfaces/tag.interface';

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
export class NoteFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  note = input<Note | null>(null);
  availableTags = input<Tag[]>([]);
  preSelectedTags = input<string[]>([]);

  save = output<Partial<Note>>();
  formCancel = output<void>();

  readonly noteForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    content: [''],
    tags: [[] as string[]],
  });

  private readonly syncFormWithNoteEffect = effect(() => {
    const currentNote = this.note();
    const preTags = this.preSelectedTags();

    if (currentNote) {
      this.noteForm.patchValue({
        title: currentNote.title,
        content: currentNote.content,
        tags: currentNote.tags,
      });
    } else {
      this.noteForm.reset({
        title: '',
        content: '',
        tags: preTags || [],
      });
    }
  });

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

  onSave(): void {
    if (this.noteForm.invalid) return;

    const formValue = this.noteForm.value;

    if (this.isEditing()) {
      const currentNote = this.note()!;
      const noteData: Partial<Note> = {
        ...currentNote,
        title: formValue.title.trim(),
        content: formValue.content.trim(),
        tags: formValue.tags,
        lastEdited: new Date(),
        version: (currentNote.version || 0) + 1,
      };
      this.save.emit(noteData);
    } else {
      const currentUser = this.authService.user()!;

      const noteData: Partial<Note> = {
        title: formValue.title.trim(),
        content: formValue.content.trim(),
        tags: formValue.tags,
        lastEdited: new Date(),
        version: 1,
        archived: false,
        isFavorite: false,
        ownerId: currentUser.id,
        sharedWith: [],
        attachments: [],
      };
      this.save.emit(noteData);
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
