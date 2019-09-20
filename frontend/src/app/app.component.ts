import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameExceptionService } from './game-exception.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { GameExceptionComponent } from './game-exception/game-exception.component';
import { LoginService } from './home/login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {
  
  sub;
  
  constructor(private service : GameExceptionService,private router:Router,private dialog : MatDialog,private logger:LoginService){}
  ngOnInit() {

    this.sub = this.service.gameException$.subscribe(data=>{
      this.dialog.open(GameExceptionComponent);
      this.router.navigate(["/"+this.logger.getUser().userType.toLowerCase()]);
    })
  
  }

  ngOnDestroy() {
    
  }
  title = 'frontend';

}
