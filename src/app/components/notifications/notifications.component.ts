import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { Observable, tap } from 'rxjs';
import { IApiResponse } from '../../interfaces/iapi-response';
import { CommonModule, AsyncPipe} from '@angular/common';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
  
})
export class NotificationsComponent implements OnInit {
  notifications$: Observable<IApiResponse<any>> = new Observable();
  currentTab: string = 'inbox';
  notifications: any[] = [];
  message: string = 'No hay nuevos notificaciones!';

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.notifications$ = this.notificationsService.getNotifications().pipe(
      tap(response => {
        this.notifications = response.data;
        if (this.currentTab === 'inbox' && !this.notifications.some(n => n.status === 'Unread')) {
          this.showTab('general');
        }
      })
    );
  }

  getUnreadNotifications(): any[] {
    return this.notifications.filter(notification => notification.status === 'Unread');
  }

  updateMessage(): void {
    const unreadCount = this.getUnreadNotifications().length;
    this.message = unreadCount === 0 ? 'No hay nuevos notificaciones!' : '';
  }


  showTab(tab: string): void {
    this.currentTab = tab;
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map(notification => this.markAsRead(notification));
  }

  markAsRead(notification: any): any {
    if (notification.status === 'Unread') {
      notification.status = 'Read';
    }
    return notification;
  }

  handleNotificationClick(notification: any): void {
    notification.status = 'Read';
    setTimeout(() => {
      // Re-render or trigger any change detection if necessary
    }, 200); // Animation duration
  }

  getNotificationImage(notification: any): string {
    if (notification.group_id && notification.expense_id) {
      return 'assets/images/coins.png';
    } else if (notification.group_id) {
      return 'assets/images/groups.png';
    } else {
      return 'assets/images/default.png';
    }
  }

  acceptInvitation(notification: any): void {
    // Logic for accepting the invitation
  }

  declineInvitation(notification: any): void {
    // Logic for declining the invitation
  }

  getTimeSince(date: string): string {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
      return 'hace unos segundos';
    } else if (minutes < 60) {
      return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (hours < 24) {
      return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
    }
  }
}