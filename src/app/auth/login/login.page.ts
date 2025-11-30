import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonToolbar, IonItem, IonInput, IonButton, IonProgressBar, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { ValidatorsForm } from 'src/app/core/services/validator.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { addIcons } from 'ionicons';
import { ban, eye, eyeOff } from 'ionicons/icons';
import { ZXingScannerModule } from '@zxing/ngx-scanner';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ZXingScannerModule, IonIcon, IonProgressBar, IonButton, ReactiveFormsModule, IonInput, IonItem, IonBackButton, IonButtons, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  private formBuilder = inject(FormBuilder);
  private valiService = inject(ValidatorsForm);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);
  availableDevices: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | undefined;
  isLoading = false;
  showPassword: boolean = false;

  public miLogin: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(this.valiService.emailPattern)]],
    password: ['', Validators.required],
  });
 async getDevices() {
    this.availableDevices = await navigator.mediaDevices.enumerateDevices();
    this.currentDevice = this.availableDevices.find(d => d.kind === 'videoinput')!;
  }

  onScanSuccess(result: string) {
    console.log('QR detectado:', result);
    alert(result);
  }
  constructor() { 
    addIcons({ eye, ban, eyeOff });
  }

  ngOnInit() {
    this.getDevices();
    this.isLoggedIn();
    this.authService.headers();
  }
  login() {
    this.isLoading = true;
    const { email, password } = this.miLogin.value;
    this.authService.login(email, password).subscribe({
      next: (data) => {
        if (data.message) {
          this.isLoading = false;
          this.toastService.error('Usuario o contraseña incorrectos');
        } else {
          this.toastService.success('Bienvenido!!!');
          this.isLoading = false;
          // this.router.navigate(['tabs/inicio']);  
        }
      },
      error: (error) => {
        this.toastService.error('Usuario o contraseña incorrectos');
        // console.log(error.error);
        this.isLoading = false;
      }
    })
  }

  get emailErrorMsg(): string {
    const errors = this.miLogin.get('email')?.errors;
    if (errors?.['required']) {
      // console.log("El correo es obligatorio");
      return 'El correo es obligatorio';
    } else if (errors?.['pattern']) {
      // console.log("No es un formato de correo valido");
      return 'No es un formato de correo valido';
    }
    return '';
  }

  campoNoEsValido(campo: string) {
    return this.miLogin.controls[campo]?.errors
      && this.miLogin.controls[campo].touched
  }

  // si el usuario esta logeado lo manda a inicio
  isLoggedIn() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['tabs/inicio'])
    }
  }

    // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}