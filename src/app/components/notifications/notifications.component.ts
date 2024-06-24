import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { Observable, tap } from 'rxjs';
import { IApiResponse } from '../../interfaces/iapi-response';
import { CommonModule} from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { MembershipService } from '../../services/membership.service';
import { SweetAlertService } from '../../services/sweet-alert.service';


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

  constructor(
    private notificationsService: NotificationsService,
    private membershipService: MembershipService,
    private sweetAlertService: SweetAlertService,
    private snackBar: MatSnackBar
  ) {}

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

  async markAllAsRead(): Promise<void> {
    try {
      const response = await firstValueFrom(this.notificationsService.setAllNotificationsToRead());
      if (response.success) {
        this.notifications = this.notifications.map(notification => {
          notification.status = 'Read';
          return notification;
        });
        this.snackBar.open('Todas las notificaciones se han marcado como leídas.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      this.snackBar.open('Error al marcar todas las notificaciones como leídas.', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  }

  async markAsRead(notification: any): Promise<any> {
    if (notification.status === 'Unread') {
      try {
        const response = await firstValueFrom(this.notificationsService.changeNotificationStatusToRead(notification.id));
        notification.status = 'Read';
        this.snackBar.open('Notificación marcada como leída.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      } catch (error) {
        console.error('Error al marcar la notificación como leída:', error);
        this.snackBar.open('Error al marcar la notificación como leída.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    }
    return notification;
  }
  
  getNotificationImage(notification: any): string {
    let imageUrl = '';
  
    if (notification.group_id && notification.expense_id) {
      imageUrl = 'assets/images/coins.png';
    } else {
      imageUrl = 'assets/images/groups.png';
    }
  
    console.log('Image URL:', imageUrl);
    return imageUrl;
  }

  acceptInvitation(notification: any): void {
    this.sweetAlertService.confirm('¿Está seguro de que desea aceptar esta invitación?').then(async result => {
      if (result.isConfirmed) {
        try {
          const response = await firstValueFrom(this.membershipService.updateMembershipStatusToJoined(notification.group_id));
          this.snackBar.open('Invitación aceptada', 'Cerrar', { duration: 3000 });
  
          //front
          this.notifications = this.notifications.filter(n => n.id !== notification.id);
          this.updateMessage();
        } catch (error) {
          console.error('Error al aceptar la invitación:', error);
          this.snackBar.open('Error al aceptar la invitación', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
        }
      }
    });
  }
  
  
  
  async declineInvitation(notification: any): Promise<void> {
    console.log('Notification group_id:', notification.group_id); 
    const result = await this.sweetAlertService.confirm('¿Está seguro de que desea rechazar esta invitación?');
    
    if (result.isConfirmed) {
      try {
        const response = await firstValueFrom(this.membershipService.refuseInvitation(notification.group_id));
        this.snackBar.open('Invitación rechazada', 'Cerrar', { duration: 3000 });
  
        //front
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        this.updateMessage();
      } catch (error) {
        console.error('Error al rechazar la invitación:', error);
        this.snackBar.open('Error al rechazar la invitación', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      }
    }
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