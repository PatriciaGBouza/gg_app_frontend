import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usersettings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
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
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.settingsForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      image_url: [''],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.user = this.authService.getUser();
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

  saveField(field: string): void {
    if (this.settingsForm.get(field)?.valid) {
      const updateData = { [field]: this.settingsForm.get(field)?.value };
      this.userService.updateUser({ ...this.user, ...updateData }).subscribe(response => {
        console.log(`${field} updated:`, response);
        this.user[field] = this.settingsForm.get(field)?.value;
        this.editField = '';
      });
    }
  }

  deleteUser(): void {
    const userId = this.authService.getUser().id;
    this.userService.deleteUser(userId).subscribe(response => {
      console.log('User deleted:', response);
      this.authService.logout();
      // Redirect to the login page or another appropriate page
    });
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
    this.imageError = 'The image URL is not valid';
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
        this.imageError = 'The image URL is not valid';
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
