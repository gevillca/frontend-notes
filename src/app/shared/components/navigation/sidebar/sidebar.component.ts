import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { Tag } from '@features/notes/interfaces/tag.interface';
import { TagsService } from '@features/notes/services/tags.service';

import { AppMenu } from './menu/app.menu.component';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, AppMenu],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sidebar-collapsed]': 'collapsed()',
    '[class.sidebar-expanded]': '!collapsed()',
  },
})
export class Sidebar implements OnInit {
  private readonly tagsService = inject(TagsService);

  collapsed = input<boolean>(false);
  tags = signal<Tag[]>([]);

  ngOnInit(): void {
    this.tagsService.getAllTags().subscribe((tagsArray: Tag[]) => {
      this.tags.set(tagsArray);
    });
  }

  protected get menuItems(): MenuItem[] {
    return [
      {
        items: [
          {
            label: 'All Notes',
            icon: 'pi pi-home',
            routerLink: ['/notes'],
          },
          {
            label: 'Archived Notes',
            icon: 'pi pi-inbox',
            routerLink: ['/notes/archived'],
          },
        ],
      },
      {
        separator: true,
      },
      {
        label: 'Tags',
        items: this.tags().map((tag) => ({
          label: tag.name,
          icon: 'pi pi-tag',
          routerLink: ['/notes/tag', tag.id],
        })),
      },
    ];
  }
}
