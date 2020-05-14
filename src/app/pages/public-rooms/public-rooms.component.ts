import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-public-rooms',
  templateUrl: './public-rooms.component.html',
  styleUrls: ['./public-rooms.component.css']
})
export class PublicRoomsComponent implements OnInit {

  Rooms = [];
  RoomsCache = [];
  Colors = [
    '16a085',
    '1abc9c',
    '2ecc71',
    '27ae60',
    '4caf50',
    '8bc34a',
    'cddc39',
    '3498db',
    '2980b9',
    '34495e',
    '2c3e50',
    '2196f3',
    '03a9f4',
    '00bcd4',
    '009688',
    'e74c3c',
    '#c0392',
    'f44336',
    'e67e22',
    'd35400',
    'f39c12',
    'ff9800',
    'ff5722',
    'ffc107',
    'f1c40f',
    'ffeb3b',
    '9b59b6',
    '8e44ad',
    '9c27b0',
    '673ab7',
    'e91e63',
    '3f51b5',
    '795548'
  ];
  GeneratedColors = [];
  Genres = [];

  sub;
  form;

  isMobile = false;
  isVisible = false;
  visible = false;
  seen = true;
  isCollapsed = false;

  constructor(private socketService: SocketService, private router: Router, private formBuilder: FormBuilder,
              public userService: UserService, private message: NzMessageService, private titleService: Title) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      size: ['', Validators.required],
      password: '',
      genre: ['', Validators.required]
    });
  }

  get RandomColor() {
    return this.Colors[Math.floor(Math.random() * 33)];
  }

  Play() {
    this.userService.seenRules().toPromise().then((res: any) => {
      if (res.success === true) {
        this.seen = true;
      }
    });
  }

  ngOnInit() {
    this.isMobile = window.innerWidth <= 800;
    window.onresize = () => this.isMobile = window.innerWidth <= 800;
    if (this.userService.User) {
      this.seen = this.userService.User.seen;
    } else {
      this.userService.getUser().toPromise().then((res: any) => {
        this.userService.User = res;
        this.seen = this.userService.User.seen;
      });
    }
    this.titleService.setTitle('QuizzTune - Lobby');
    this.socketService.Connect();
    this.socketService.sendMessage('get_lobbies', '');
    this.sub = this.socketService
      .getMessages()
      .subscribe((message) => {
        if (message.type === 'rooms') {
          this.RoomsCache = message.data;
          this.Rooms = message.data;
          this.Genres = message.data;
          this.Rooms.forEach(res => this.GeneratedColors.push(this.RandomColor));
        } else if (message.type === 'lobby_created') {
          this.router.navigate(['/room/' + message.data]);
        } else if (message.type === 'lobby_exist') {
          this.message.error('Lobby already exists, choose a different name');
        }
      });
  }

  onSearchChange(e) {
    this.Rooms = this.RoomsCache.filter(x => x.name.includes(e.toLowerCase()));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.socketService.Disconnect();
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
