import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSettings } from "../../app.settings.module";
import { Observable } from "rxjs";
import { UserModel } from "src/app/models/UserModel";
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: "root"
})
export class LoginService {


  
  user : UserModel = null;

  url: string = AppSettings.API_ENDPOINT + "/login";
  constructor(private http: HttpClient) {}

  login(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.url, user);
  }
  changePassID(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.url + "/change_pass", user);
  }
  changePassAutQuestion(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.url + "/aut_question", user);
  }
  changePassFully(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.url + "/change_pass_fully", user);
  }

  resetPass(user: UserModel,newPassword: String): Observable<String> {
    return this.http.post<String>(this.url + "/reset_password", {
      username: user.username,
      password: user.password,
      newPassword: newPassword
    });
  }

  setUser(user : UserModel){
    sessionStorage.setItem("user",JSON.stringify(user));
  }

  getUser() : UserModel {
    return JSON.parse(sessionStorage.getItem("user"));
  }

}
