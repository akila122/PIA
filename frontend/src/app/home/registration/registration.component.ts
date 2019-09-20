import { Component, OnInit } from "@angular/core";
import { UserModel } from "src/app/models/UserModel";
import { isValidPass, isValidId, isValidEmail } from "../../regex";
import { MatStepper } from "@angular/material/stepper";
import { RegistrationService } from "./registration.service";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../date.formater';

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
  
})
export class RegistrationComponent implements OnInit {
  compFirst: Boolean = false;
  compSecond: Boolean = false;
  compThird: Boolean = false;
  compFourth: Boolean = false;

  fileToUpload: File = null;

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  constructor(private regService: RegistrationService) {}

  errMsg: String = null;
  errOccured: Boolean = true;

  ngOnInit() {
   this.user.dateOfBirth = new Date();
  }
  user: UserModel = {} as null;

  passwordCheck: String = "";

  stepFirst(stepper: MatStepper) {
    this.errOccured = false;
    this.compFirst = true;

    if (!isValidId(this.user.personalId.toString())) {
      this.errOccured = true;
      this.compFirst = false;
      this.errMsg = "Unet nevalidan JMBG.";
    } else {

      setTimeout(()=>stepper.next(),0);
      
    }
  }
  stepSecond(stepper: MatStepper) {
    this.errOccured = false;
    this.compSecond = true;

    if (!isValidEmail(this.user.email.toString())) {
      this.errOccured = true;
      this.compSecond = false;
      this.errMsg = "Unet nevalidan email";
    } else if (!isValidPass(this.user.password.toString())) {
      this.errOccured = true;
      this.compSecond = false;
      this.errMsg = "Uneta nevalidna lozinka";
    }
      else if(this.user.password != this.passwordCheck){
        this.errOccured = true;
        this.compSecond = false;
        this.errMsg = "Unete lozinke se en podudaraju";
      }
     else {
      this.regService.testUsername(this.user).subscribe(result => {
        if (result) {
          this.compSecond = false;
          this.errOccured = true;
          this.errMsg = "Korisničko ime je već u upotrebi.";
        } else {
          setTimeout(()=>stepper.next(),0);
        }
      });
    }
  }
  stepThird(stepper: MatStepper) {
    this.errOccured = false;
    this.compThird = true;
    setTimeout(()=>stepper.next(),0);
  }

  stepFourth(stepper: MatStepper) {
    this.errOccured = false;
    this.compFourth = true;

    if (this.fileToUpload === null) {
      this.errOccured = true;
      this.compFourth = false;
      this.errMsg = "Morate izabrati sliku";
    } else {
      this.regService.register(this.fileToUpload, this.user).subscribe(
        data => {
          setTimeout(()=>stepper.next(),0);
        },
        err => {
          this.errOccured = true;
          this.compFourth = false;
          this.errMsg = err.error;
        }
      );
    }
  }
}
