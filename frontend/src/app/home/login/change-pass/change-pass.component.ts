import { Component, OnInit } from "@angular/core";

import { MatStepper } from "@angular/material/stepper";
import { UserModel } from "src/app/models/UserModel";
import { LoginService } from "../login.service";
import {isValidPass} from '../../../regex';

@Component({
  selector: "app-change-pass",
  templateUrl: "./change-pass.component.html",
  styleUrls: ["./change-pass.component.css"]
})
export class ChangePassComponent implements OnInit {
  compFirst: Boolean = false;
  compSecond: Boolean = false;
  compThird: Boolean = false;
  constructor(private logger: LoginService) {}

  errMsg : String = null;
  errOccured : Boolean = false;
//
  ngOnInit() {}
  user: UserModel = {} as null;
  
  personalId : String = "";
  autAnswer : String = "";
  newPass : String = "";

  stepFirst(stepper: MatStepper) {
    
    this.errOccured = false;
    this.compFirst = true;
    this.personalId = this.user.personalId;
    this.logger.changePassID(this.user).subscribe(data=>{
      this.user.autQuestion = data.autQuestion;
      stepper.next();
    },err=>{
      this.compFirst = false;
      this.errMsg = err.error;
      this.errOccured = true;
    })
    
  }
  stepSecond(stepper: MatStepper) {
    this.errOccured = false;
    this.compSecond = true;
    this.logger.changePassAutQuestion(this.user).subscribe(data=>{
      stepper.next();
    },err=>{
      this.compSecond = false;
      this.errMsg = err.error;
      this.errOccured = true;
    })
    
  }
  stepThird(stepper: MatStepper) {

    
    this.errOccured = false;
    this.compThird = true;
    this.personalId = this.user.personalId;
    this.autAnswer = this.user.autAnswer;
    this.newPass = this.user.password;
    if(!isValidPass(this.newPass.toString())){
      this.compThird = false;
      this.errMsg = "Loše formatirana lozinka";
      this.errOccured = true;

    }
    this.logger.changePassFully(this.user).subscribe(data=>{
      stepper.next();
    },err=>{
      this.compThird = false;
      this.errMsg = err.error;
      this.errOccured = true;
    })
  }
}
