import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { Observable } from 'rxjs';

import { Note } from '../interfaces/notes.interface';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/notes`;

  getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.baseUrl);
  }

  getNoteById(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.baseUrl}/${id}`);
  }

  createNote(note: Partial<Note>): Observable<Note> {
    return this.http.post<Note>(this.baseUrl, note);
  }

  updateNote(id: string, note: Partial<Note>): Observable<Note> {
    return this.http.put<Note>(`${this.baseUrl}/${id}`, note);
  }

  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  searchNotes(query: string): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.baseUrl}?title=${query}&content=${query}`);
  }
}
