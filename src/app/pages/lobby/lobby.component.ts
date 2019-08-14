import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
  animations: [
    trigger('panelInOut', [
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(400)
      ]),
      transition('* => void', [
        animate(400, style({ transform: 'translateX(-100%)' }))
      ])
    ]),
    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 1 }),
        animate('0.5s')
      ]),
      transition(':leave', [
        animate('0s', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class LobbyComponent implements OnInit {
  isVisible = false;
  panelVisible = false;
  Data = [];
  DataCache = [];
  private = false;
  newLobby = {
    name: '',
    theme: '',
    password: '',
    limit: 10
  };
  sub;
  Rooms = [];
  isMobile;

  Page = 0;
  RoomPage = [];

  Themes = [
    { name: 'country', selected: false, description: 'Country music' },
    { name: 'hiphop', selected: false, description: 'Hip-Hop music' },
    { name: 'international', selected: false, description: 'International music' },
    { name: 'jazz', selected: false, description: 'Jazz music' },
    { name: 'metal', selected: false, description: 'Metal music' },
    { name: 'pop', selected: false, description: 'Pop music' },
    { name: 'rap', selected: false, description: 'Rap music' },
    { name: 'rock', selected: false, description: 'Rock music' }
  ];

  constructor(private socketService: SocketService, private router: Router, public userService: UserService,
    private message: NzMessageService, private titleService: Title) { }

  Select(theme) {
    theme.selected = true;
    this.Themes.forEach(x => {
      if (theme !== x) {
        this.newLobby.theme = x.name;
        x.selected = false;
      }
    });
  }

  Close() {
    this.isVisible = false;
  }

  Disconnect() {
    this.userService.Disconnect();
  }

  isSelected() {
    return this.Themes.find(x => x.selected === true) ? true : false;
  }

  newRoom() {
    this.socketService.sendMessage('new_lobby', {
      name: this.newLobby.name,
      owner: this.userService.User.username,
      theme: this.newLobby.theme,
      limit: this.newLobby.limit,
      locked: this.newLobby.password ? true : false,
      password: this.newLobby.password
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.socketService.Disconnect();
  }

  getLobbies() {
    this.socketService.sendMessage('get_lobbies', '');
  }

  onSearchChange(e) {
    this.Data = this.DataCache.filter(x => x.name.includes(e));
  }

  FilterPrivate(e) {
    if (e) {
      this.Data = this.DataCache.filter(x => x.locked === e);
    } else {
      this.Data = this.DataCache;
    }
  }

  ngOnInit() {
    this.titleService.setTitle('QuizzTune - Lobby');
    window.onresize = () => this.isMobile = window.innerWidth <= 800;
    this.socketService.Connect();
    this.getLobbies();
    this.sub = this.socketService
      .getMessages()
      .subscribe((message) => {
        if (message.type === 'lobbies') {
          this.Data = message.data;
          this.DataCache = message.data;
        } else if (message.type === 'lobby_created') {
          this.router.navigate(['/room/' + message.data]);
        } else if (message.type === 'lobby_exist') {
          this.message.error('Lobby already exists');
        } else if (message.type === 'rooms') {
          this.Rooms = message.data;
          this.RoomPage = Array(4).fill(0).map((x, i) => this.Rooms[i + 4 * this.Page]);
        }
      });
  }

  Previous() {
    if (this.Page > 0) {
      this.Page = this.Page - 1;
      this.RoomPage = Array(4).fill(0).map((x, i) => this.Rooms[i + 4 * this.Page]);
    }
  }

  CanPrevious() {
    if (this.Page > 0) {
      return true;
    } else {
      return false;
    }
  }

  CanNext() {
    if (this.Page + 1 < this.Rooms.length / 4) {
      return true;
    } else {
      return false;
    }
  }

  Next() {
    if (this.Page + 1 < this.Rooms.length / 4) {
      this.Page = this.Page + 1;
      this.RoomPage = Array(4).fill(0).map((x, i) => this.Rooms[i + 4 * this.Page]);
    }
  }

}
