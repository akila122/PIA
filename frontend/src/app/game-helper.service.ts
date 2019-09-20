import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameHelperService {


  timerObserver : Subscriber<Number>;
  timeoutObserver : Subscriber<any>;
  pointsObserver : Subscriber<any>;
  gameObserver : Subscriber<any>;
  stopObserver : Subscriber<any>;

  timerObservable = new Observable<Number>(subscriber => {
    this.timerObserver = subscriber;
  })
  timeoutObservable = new Observable<any>(subscriber=>{
    this.timeoutObserver = subscriber;
  })
  pointsObservable = new Observable<any>(subscriber=>{
    this.pointsObserver = subscriber;

  })
  gameObservable = new Observable<any>(subscriber=>{
    this.gameObserver = subscriber;
  })

  stopObservable = new Observable<any>(subscriber=>{
    this.stopObserver = subscriber;
  })

  constructor() { 
  }

  startTimeout(time : Number){
    this.timerObserver.next(time);
  }
  endTimeout(){
    this.timeoutObserver.next(null);
  }
  stopTimeout(){
    this.stopObserver.next(null);
  }
  pushPoints(data : any){
    this.pointsObserver.next(data)
  }
  nextGame(){
    this.pointsObserver.next(null);
  }

  setData(data){
    sessionStorage.setItem("gameData",JSON.stringify(data));
  }
  getData(){
    return JSON.parse(sessionStorage.getItem("gameData"));
  }

}
