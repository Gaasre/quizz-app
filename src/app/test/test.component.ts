import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  player;
  loading = false;
  constructor(public userService: UserService) { }

  ngOnInit() {
    this.player = this.userService.User;
  }

  Disconnect() {
    this.userService.Disconnect();
  }


}
