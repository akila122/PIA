import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginService } from '../login.service';
import { UserModel } from "src/app/models/UserModel";
import {isValidPass} from '../../../regex';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {

  constructor(private logger:LoginService,public dialog: MatDialog) { }
  
  user : UserModel = {} as null;
  errOccured : Boolean = false;
  errMsg : String = null;
  newPassword : String = null;
  newPasswordClone : String = null;
  success : Boolean = false;

  resetPass(){

    this.errOccured = false;
    if(!isValidPass(this.newPassword.toString())){
      this.errOccured = true;
      this.errMsg = "Loše formatirana lozinka"
      return;
    }
    if(this.newPassword!=this.newPasswordClone){
      this.errOccured = true;
      this.errMsg = "Ponovljena lozinka se ne podudara"
      return;
    }
    this.logger.resetPass(this.user,this.newPassword).subscribe(data=>{
      this.success = true;
    },err=>{
      this.errOccured = true;
      this.errMsg = err.error;
    })
    

    




  }

  ngOnInit() {
  }

}
