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

  seen = true;

  Page = 0;
  RoomPage = [];

  Themes = [];

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

  Play() {
    this.userService.seenRules().toPromise().then((res: any) => {
      if (res.success === true) {
        this.seen = true;
      }
    });
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
          this.Themes = message.data.map((item) => {
            return { id: item._id, name: item.name, selected: false, description: item.name + ' music' };
          });
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
