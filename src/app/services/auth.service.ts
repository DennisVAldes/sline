import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserDto, ApiResponse } from '../types/dtos/models';
import { Router } from '@angular/router';
import JwtDecode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  private apiHost = environment.API_ENDPOINT;

  TOKEN_KEY = 'token'

  constructor( 
    private http: HttpClient,
    private router: Router
  ) { }

  public getToken = () => localStorage.getItem(this.TOKEN_KEY);

  public isAuthenticated = () => {
    if(localStorage.getItem(this.TOKEN_KEY) !== undefined){
      return !!localStorage.getItem(this.TOKEN_KEY);
    }
  };

  public logout = () => {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('userData');
    localStorage.setItem("isLogged", "false");

    setTimeout(() => {
      this.router.navigateByUrl('/');
    }, 1000);
  };

  public login = async (newUser: Partial<UserDto>): Promise<ApiResponse<UserDto>> => {
    let res = await this.http
      .post<ApiResponse<UserDto>>(`${this.apiHost}/auth/login`, newUser)
      .toPromise()
      .then((res) => ({...res}));

    var token = res.token;
    var decoded = JwtDecode(token); 

    localStorage.setItem(this.TOKEN_KEY, (await res).token);
    localStorage.setItem("userData", JSON.stringify(decoded));
    localStorage.setItem("isLogged", "true");
    return res;
  }
                      
}
