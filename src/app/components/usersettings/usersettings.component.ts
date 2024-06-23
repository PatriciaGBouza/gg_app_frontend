import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { SafeUrl } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserStateService } from '../../services/user-state.service';
import { UtilityService } from '../../services/usersettings/utility.service';
import { firstValueFrom } from 'rxjs';
import { ILoadedUserData } from '../../interfaces/user/iloaded-user-data';

@Component({
  selector: 'app-usersettings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ImageCropperComponent,
  ],
  templateUrl: './usersettings.component.html',
  styleUrls: ['./usersettings.component.css'],
})
export class UserSettingsComponent implements OnInit {
  user: ILoadedUserData | null = null;
  userId: any | null = null;
  editField: string = '';
  imageError: string | null = null;
  imageUrlValid: boolean = false;
  croppedImage: SafeUrl = '';
  imageBase64: string = '';
  imageChangedEvent: Event | null = null;
  settingsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private userStateService: UserStateService,
    private utilityService: UtilityService
  ) {
    this.settingsForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      image_url: [''],
      password: ['', Validators.required],
    });

    this.userStateService.getUserObservable().subscribe((user) => {
      this.user = user;
      if (user) {
        this.settingsForm.patchValue(user);
      }
    });
  }

  private async loadUser(userId: number): Promise<void> {
    try {
      const user = await firstValueFrom(
        this.userService.getUserById(userId.toString())
      );
      if (user && user.data.id) {
        if (!user.data.image_url) {
          user.data.image_url = 'assets/user_default.png';
        }
        this.userStateService.setUser(user.data);
      } else {
        this.utilityService.handleError('No user data found');
      }
    } catch (error) {
      this.utilityService.handleError('Error loading user data');
    }
  }

  async ngOnInit(): Promise<void> {
    const userFromLocalStorage =
      await this.userService.getUserFromLocalStorage();
    if (userFromLocalStorage) {
      this.userId = userFromLocalStorage.id;
      await this.loadUser(this.userId);
    } else {
      this.utilityService.handleError('No user data found in local storage');
    }
  }

  enableEditing(field: string): void {
    this.editField = field;
  }
// the version where we after update get userdata from getuserbyid call
  // async saveField(field: string): Promise<void> {
  //   if (this.settingsForm.get(field)?.valid) {
  //     const updateData = { [field]: this.settingsForm.get(field)?.value };
  //     try {
  //       const response = await firstValueFrom(
  //         this.userService.updateUser({ ...this.user, ...updateData })
  //       );
  //       if (this.user) {
  //         this.user = { ...this.user, ...updateData };
  //         this.userStateService.setUser(this.user);
  //       }
  //       this.editField = '';
  //       this.utilityService.showSuccessMessage(
  //         `${this.getFieldLabel(field)} actualizado exitosamente`
  //       );
  //     } catch (error) {
  //       this.utilityService.handleError(
  //         `Error al actualizar ${this.getFieldLabel(
  //           field
  //         )}. Inténtalo de nuevo.`
  //       );
  //     }
  //   }
  // }
  async saveField(field: string): Promise<void> {
    if (this.settingsForm.get(field)?.valid) {
      const updateData = { [field]: this.settingsForm.get(field)?.value };
      try {
        const response = await firstValueFrom(
          this.userService.updateUser({ ...this.user, ...updateData })
        );
        if (this.user) {
          this.user = { ...this.user, ...updateData };
          this.userStateService.setUser(this.user);
        }
        this.editField = '';
        this.utilityService.showSuccessMessage(
          `${this.getFieldLabel(field)} actualizado exitosamente`
        );
      } catch (error) {
        this.utilityService.handleError(
          `Error al actualizar ${this.getFieldLabel(
            field
          )}. Inténtalo de nuevo.`
        );
      }
    }
  }
  

  async deleteUser(): Promise<void> {
    const userId = this.user?.id;
    if (userId) {
      try {
        const response = await firstValueFrom(
          this.userService.deleteUser(userId.toString())
        );
        this.utilityService.handleError('Usuario eliminado exitosamente');
        this.authService.logout();
        this.router.navigate(['/principal']);
      } catch (error) {
        this.utilityService.handleError(
          'Error al eliminar el usuario. Inténtalo de nuevo.'
        );
      }
    }
  }

  getFieldLabel(field: string): string {
    const fieldLabels: { [key: string]: string } = {
      name: 'Nombre',
      email: 'Correo electrónico',
      password: 'Contraseña',
      image_url: 'URL de la imagen',
    };
    return fieldLabels[field] || field;
  }

  validateImageUrl(event: any): void {
    const imageUrl = event.target.value;
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        this.imageError = null;
        this.imageUrlValid = true;
        this.settingsForm.patchValue({ image_url: imageUrl });
      };
      img.onerror = () => {
        this.imageError = 'La URL de la imagen no es válida';
        this.imageUrlValid = false;
      };
      img.src = imageUrl;
    }
  }

  convertImageToBase64(img: HTMLImageElement): void {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      this.imageBase64 = canvas.toDataURL('image/png');
    }
  }
}
