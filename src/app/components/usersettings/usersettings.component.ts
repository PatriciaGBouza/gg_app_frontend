import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-usersettings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    ImageCropperComponent
  ],
  templateUrl: './usersettings.component.html',
  styleUrls: ['./usersettings.component.css']
})
export class UserSettingsComponent implements OnInit {
  user: any;
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
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {
    this.settingsForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      image_url: [''],
      password: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadUser();
  }

  async loadUser(): Promise<void> {
    this.user = this.userService.getUserFromLocalStorage();
    if (this.user && this.user.id) {
      this.settingsForm.patchValue(this.user);
      console.log('Loaded user data:', this.user); // Log user data
    } else {
      console.error('No user data found');
    }
  }

  enableEditing(field: string): void {
    this.editField = field;
  }

  async saveField(field: string): Promise<void> {
    if (this.settingsForm.get(field)?.valid) {
      const updateData = { [field]: this.settingsForm.get(field)?.value };
      try {
        const response = await this.userService.updateUser({ ...this.user, ...updateData }).toPromise();
        console.log(`${field} updated:`, response);
        this.user[field] = this.settingsForm.get(field)?.value;
        this.editField = '';
        this.snackBar.open(`${this.getFieldLabel(field)} actualizado exitosamente`, 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      } catch (error) {
        this.snackBar.open(`Error al actualizar ${this.getFieldLabel(field)}. Inténtalo de nuevo.`, 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    }
  }

  async deleteUser(): Promise<void> {
    const userId = this.user.id;
    try {
      const response = await this.userService.deleteUser(userId).toPromise();
      console.log('Usuario eliminado:', response);
      this.snackBar.open('Usuario eliminado exitosamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
      this.authService.logout(); // Log out the user
      this.router.navigate(['/principal']);
    } catch (error) {
      this.snackBar.open('Error al eliminar el usuario. Inténtalo de nuevo.', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl || '');
    this.settingsForm.patchValue({ image_url: this.croppedImage });
    this.saveField('image_url');
  }

  imageLoaded(image: LoadedImage): void {
    this.imageError = null;
    this.imageUrlValid = true;
  }

  cropperReady(): void {
    // Cropper ready
  }

  loadImageFailed(): void {
    this.imageError = 'La URL de la imagen no es válida';
    this.imageUrlValid = false;
  }

  validateImageUrl(event: any): void {
    const imageUrl = event.target.value;
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        this.imageError = null;
        this.imageUrlValid = true;
        this.convertImageToBase64(img);
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

  getFieldLabel(field: string): string {
    const fieldLabels: { [key: string]: string } = {
      name: 'Nombre',
      email: 'Correo electrónico',
      password: 'Contraseña',
      image_url: 'URL de la imagen'
    };
    return fieldLabels[field] || field;
  }
}
