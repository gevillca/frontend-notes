import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

import { Tag } from '../interfaces/tag.interface';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tags`;

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.baseUrl);
    // .pipe(tap((tags) => console.log('Fetched tags:', tags)));
  }

  getTagById(id: string): Observable<Tag> {
    return this.http.get<Tag>(`${this.baseUrl}/${id}`);
  }

  createTag(tag: Partial<Tag>): Observable<Tag> {
    return this.http.post<Tag>(this.baseUrl, tag);
  }

  updateTag(id: string, tag: Partial<Tag>): Observable<Tag> {
    return this.http.put<Tag>(`${this.baseUrl}/${id}`, tag);
  }

  deleteTag(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  searchTags(query: string): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.baseUrl}?name=${query}`);
  }
}
