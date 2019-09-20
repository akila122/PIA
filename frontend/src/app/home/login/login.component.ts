import { Component, OnInit } from '@angular/core';
import {MaterialModule} from '../../material.module';
import { UserModel } from 'src/app/models/UserModel';
import { LoginService } from './login.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { ResetPassComponent} from './reset-pass/reset-pass.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {



  doSpin : Boolean = false;
  user : UserModel = {} as null;
  errMsg : String = "";
  errOccured : Boolean = false;
  changePass : Boolean = false;

  constructor(private logger:LoginService,public dialog: MatDialog,private router: Router) { }


  openDialog(){
    this.dialog.open(ChangePassComponent);
    this.changePass = false;
  }

  resetPass(){
    this.dialog.open(ResetPassComponent);
  }

  ngOnInit() {
  }

  login(){
    this.doSpin = !this.doSpin;
    this.errOccured = false;
    this.changePass = false;
    this.logger.login(this.user).subscribe(data=>{
      this.user = data;
      this.doSpin = false;
      this.logger.setUser(data);
      this.router.navigate(["/"+data.userType.toLowerCase()]);
    },err=>{
      this.errMsg = err.error;
      if(this.errMsg == 'Netačna lozinka')
        this.changePass = true;
      this.doSpin = false;
      this.errOccured = true;
      
    })
  }
  
}


