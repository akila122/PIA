import { Injectable } from "@angular/core";
import { AppSettings } from "src/app/app.settings.module";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { FivesModel, GrailModel, AnagramModel, GeoModel, MyNumModel } from 'src/app/models/GameModels';


@Injectable({
  providedIn: "root"
})
export class GoDService {
  
  url: string = AppSettings.API_ENDPOINT + "/GoD";
 
  constructor(private http: HttpClient) {}

  

 

  setGoD(date, game: String) : Observable<String> {
    let req = {
      date: date,
      game: game
    };
    return this.http.put<String>(this.url + "/set_god", req);
  }

  getFives() : Observable<FivesModel[]>{
    return this.http.get<FivesModel[]>(this.url+"/all_fives");
  }
  getGrails() : Observable<GrailModel[]>{
    return this.http.get<GrailModel[]>(this.url+"/all_grails");
  }
  getAnagrams() : Observable<AnagramModel[]>{
    return this.http.get<AnagramModel[]>(this.url+"/all_anagrams");
  }
  getGeo() : Observable<GeoModel>{
    return this.http.get<GeoModel>(this.url+"/geo");
  }1
  getMyNum() : Observable<MyNumModel>{
    return this.http.get<MyNumModel>(this.url+"/my_num");
  }
}
