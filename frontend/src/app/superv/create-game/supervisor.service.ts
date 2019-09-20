import { Injectable } from "@angular/core";
import { AppSettings } from "src/app/app.settings.module";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  GrailModel,
  AnagramModel,
  FivesModel
} from "src/app/models/GameModels";

@Injectable({
  providedIn: "root"
})
export class SupervisorService {
  url: string = AppSettings.API_ENDPOINT + "/supervisor";
  constructor(private http: HttpClient) {}

  addGrail(grail: GrailModel): Observable<String> {
    return this.http.put<String>(this.url + "/add_grail", grail);
  }
  addAnagram(anagram: AnagramModel): Observable<String> {
    return this.http.put<String>(this.url + "/add_anagram", anagram);
  }
  addFives(grail: FivesModel): Observable<String> {
    return this.http.put<String>(this.url + "/add_fives", grail);
  }
}
