import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserSexTypes } from 'src/app/types/enums';
import { UserDto } from 'src/app/types/dtos/models';
import { UserService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotifierService } from "angular-notifier";

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent implements OnInit {
  
  // En el constructor inicializamos los modulos, servicios, etc que vayamos a usar
  constructor(
    private userService: UserService,
    private authService: AuthService,
    notifierService: NotifierService,
    private routerService: Router
  ) { 
    this.notifier = notifierService; 
  }
  
  // Aca declaramos variables, arrays, etc
  letModal = true;
  sexTypes = UserSexTypes;
  private readonly notifier: NotifierService;

  // Esta funcion se ejecuta cuando se carga el componente
  ngOnInit(): void {
    localStorage.removeItem('token');
  }

  public signupForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]), 
    sexo: new FormControl('', [Validators.required]),
    fechanac: new FormControl('', [Validators.required])
  }, {validators: this.checkPassword })

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  private setUser = (): UserDto => {
		return {
			"username": this.signupForm.value.username,
			"email": this.signupForm.value.email,
      "password": this.signupForm.value.password,
			"sexo": this.signupForm.value.sexo,
			"fechanac": this.signupForm.value.fechanac,
		}
  }
  
  private getUser = () => {
    return {
      "email": this.loginForm.value.email,
      "password": this.loginForm.value.password
    }
  }

  checkPassword(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true };
  }

  public login = async () => {
    try {
      const user = this.getUser();
      let res = await this.authService.login(user);
      
      if(res.token){
        this.notifier.notify("succes", res.message);
        this.routerService.navigateByUrl("/users");
      }
      
    } catch (error) {
      console.error(error); 
    }
  }

  public submitUser = async () => {
    try {
			const user = this.setUser();
      const res = await this.userService.createUser(user);

      if(res.token){
        this.notifier.notify("succes", res.message);
          this.routerService.navigateByUrl("/users");
      }

		} catch (err) {
      console.error(err);
      
		}
	}

}
