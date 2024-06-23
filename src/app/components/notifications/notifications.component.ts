import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { Observable } from 'rxjs';
import { IApiResponse } from '../../interfaces/iapi-response';
import { CommonModule, AsyncPipe} from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';


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

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.notifications$ = this.notificationsService.getNotifications();
  }

  showTab(tab: string): void {
    this.currentTab = tab;
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
}