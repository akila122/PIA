import { Component, OnInit, Input } from '@angular/core';
import { UserModel } from 'src/app/models/UserModel';

@Component({
  selector: 'app-duel-supervisor',
  templateUrl: './duel-supervisor.component.html',
  styleUrls: ['./duel-supervisor.component.css']
})
export class DuelSupervisorComponent implements OnInit {

  constructor() { }
  @Input() data: any;
  @Input() points: boolean = false;

  ngOnInit() {
  }

}
