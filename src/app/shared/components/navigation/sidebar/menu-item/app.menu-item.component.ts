import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { LayoutService } from '@shared/layouts/main-layout/service/layout.service';

@Component({
  selector: 'app-menu-item',
  imports: [RouterModule, RippleModule, AppMenuItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.menu-item.component.html',
  host: {
    '[class.layout-root-menuitem]': 'root()',
    '[class.active-menuitem]': 'isActiveMenuItem()',
  },
  animations: [
    trigger('children', [
      state(
        'collapsed',
        style({
          height: '0',
        }),
      ),
      state(
        'expanded',
        style({
          height: '*',
        }),
      ),
      transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
    ]),
  ],
})
export class AppMenuItem implements OnInit, OnDestroy {
  readonly item = input.required<MenuItem>();
  readonly index = input.required<number>();
  readonly root = input<boolean>(false);
  readonly parentKey = input<string>('');

  private readonly active = signal(false);
  private readonly keySignal = signal('');

  readonly key = computed(() => this.keySignal());
  readonly isActiveMenuItem = computed(() => this.active() && !this.root());
  readonly submenuAnimation = computed(() =>
    this.root() ? 'expanded' : this.active() ? 'expanded' : 'collapsed',
  );

  private readonly router = inject(Router);
  private readonly layoutService = inject(LayoutService);

  private menuSourceSubscription: Subscription;
  private menuResetSubscription: Subscription;

  constructor() {
    this.menuSourceSubscription = this.layoutService.menuSource$.subscribe((value) => {
      Promise.resolve(null).then(() => {
        if (value.routeEvent) {
          this.active.set(value.key === this.key() || value.key.startsWith(this.key() + '-'));
        } else {
          if (value.key !== this.key() && !value.key.startsWith(this.key() + '-')) {
            this.active.set(false);
          }
        }
      });
    });

    this.menuResetSubscription = this.layoutService.resetSource$.subscribe(() => {
      this.active.set(false);
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const currentItem = this.item();
      if (currentItem.routerLink) {
        this.updateActiveStateFromRoute();
      }
    });
  }

  ngOnInit() {
    const parentKey = this.parentKey();
    const index = this.index();
    this.keySignal.set(parentKey ? `${parentKey}-${index}` : String(index));

    const currentItem = this.item();
    if (currentItem.routerLink) {
      this.updateActiveStateFromRoute();
    }
  }

  private updateActiveStateFromRoute() {
    const currentItem = this.item();
    if (!currentItem.routerLink) return;

    const activeRoute = this.router.isActive(currentItem.routerLink[0], {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored',
    });

    if (activeRoute) {
      this.layoutService.onMenuStateChange({ key: this.key(), routeEvent: true });
    }
  }

  itemClick(event: Event) {
    const currentItem = this.item();

    if (currentItem.disabled) {
      event.preventDefault();
      return;
    }

    if (currentItem.command) {
      currentItem.command({ originalEvent: event, item: currentItem });
    }

    if (currentItem.items) {
      this.active.update((current) => !current);
    }

    this.layoutService.onMenuStateChange({ key: this.key() });
  }

  ngOnDestroy() {
    this.menuSourceSubscription?.unsubscribe();
    this.menuResetSubscription?.unsubscribe();
  }
}
