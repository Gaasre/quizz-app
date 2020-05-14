import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-private-rooms',
  templateUrl: './private-rooms.component.html',
  styleUrls: ['./private-rooms.component.css']
})
export class PrivateRoomsComponent implements OnInit {

  Data = [];
  DataCache = [];
  Genres = [];

  sub;
  form;

  private = false;
  visible = false;
  isVisible = false;
  isCollapsed = false;

  constructor(private socketService: SocketService, private router: Router, private formBuilder: FormBuilder,
              private userService: UserService, private message: NzMessageService, private titleService: Title) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      size: ['', Validators.required],
      password: '',
      genre: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.socketService.Connect();
    this.getLobbies();
    this.titleService.setTitle('QuizzTune - Lobby');
    this.sub = this.socketService
      .getMessages()
      .subscribe((message) => {
        if (message.type === 'lobbies') {
          this.Data = message.data;
          this.DataCache = message.data;
        } else if (message.type === 'lobby_created') {
          this.router.navigate(['/room/' + message.data]);
        } else if (message.type === 'lobby_exist') {
          this.message.error('Lobby already exists, choose a different name');
        } else if (message.type === 'rooms') {
          this.Genres = message.data;
        }
      });
  }

  FilterPrivate(e) {
    if (e) {
      this.Data = this.DataCache.filter(x => x.locked === e);
    } else {
      this.Data = this.DataCache;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.socketService.Disconnect();
  }

  getLobbies() {
    this.socketService.sendMessage('get_lobbies', '');
  }

  onSearchChange(e) {
    this.Data = this.DataCache.filter(x => x.name.includes(e.toLowerCase()));
  }

  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

  submit() {
    this.socketService.sendMessage('new_lobby', {
      name: this.form.value.name,
      owner: this.userService.User.username,
      theme: this.form.value.genre,
      limit: this.form.value.size,
      locked: this.form.value.password ? true : false,
      password: this.form.value.password
    });
  }

}
