import { Component, OnInit } from '@angular/core';
import { LoginService } from '../home/login/login.service';
import { UserModel } from '../models/UserModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-superv',
  templateUrl: './superv.component.html',
  styleUrls: ['./superv.component.css']
})
export class SupervComponent implements OnInit {

  constructor(private logger: LoginService,private router: Router) { }

  user : UserModel;

  ngOnInit() {
    this.user = this.logger.getUser();
  }

  logout(){
    this.logger.setUser(null);
    this.router.navigate(['']);
  }

}
