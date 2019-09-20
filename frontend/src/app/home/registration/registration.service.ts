import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSettings } from "../../app.settings.module";
import { Observable } from "rxjs";
import { UserModel } from "src/app/models/UserModel";
import {FormBuilder, FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  url: string = AppSettings.API_ENDPOINT + "/registration";

  testUsername(user: UserModel): Observable<boolean> {
    return this.http.post<boolean>(this.url + "/test_username", user);
  }

  register(img : File, user : UserModel): Observable<String>{
    const formData: FormData = new FormData();
    formData.append('profileImg', img, img.name);
    formData.append('user',JSON.stringify(user));
    return this.http.post<String>(this.url+"/register_user",formData);

  }

  getNonapproved(): Observable<UserModel[]>{
    return this.http.get<UserModel[]>(this.url+"/not_approved");
  }

  approveUser(user : String,admin : String, approve : Boolean): Observable<String>{
    let req = {
      user : user,
      admin : admin,
      approve : approve
    };
    return this.http.put<String>(this.url+"/approve_user",req);
  }

}
