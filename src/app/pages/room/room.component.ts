import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Title } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
  animations: [
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
export class RoomComponent implements OnInit {

  Page = 0;
  RoomPage = [];

  playerName = '';
  room;
  Rooms = [];
  isConnected = false;
  percent = 0;
  songs = [];
  value = '';
  timer;
  waitingTimer;
  isWaiting = true;
  hasAccess = true;

  roomInfos;

  guessed = false;
  guessedArtist = false;
  guessedName = false;

  guessedArtistTxt = 'Artist';
  guessedNameTxt = 'Title';

  chatRoom = [];
  chatMessage = '';

  emotesVisible = false;
  isVisible = false;
  podiumVisible = false;

  audio;
  succesAudio;
  endAudio;
  players = [];
  winners = [];
  password = '';

  form;

  isMobile = false;
  isCollapsed = false;
  isCollapsedChat = true;
  newMessage = false;

  @ViewChild('chatDiv', {static: false}) private chatDiv: ElementRef;

  constructor(private socketService: SocketService, private message: NzMessageService, private route: ActivatedRoute,
    public userService: UserService, private router: Router, private titleService: Title, private formBuilder: FormBuilder,
    private notification: NzNotificationService) {
    this.form = this.formBuilder.group({
      guess: ''
    });
  }

  scrollToBottom() {
    try {
      this.chatDiv.nativeElement.scrollTop = this.chatDiv.nativeElement.scrollHeight;
    } catch (err) { }
  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.message.info('Copied');
  }

  Guess() {
    this.socketService.sendMessage('song_submission', { guess: this.form.value.guess });
    this.form.reset();
  }

  Kick(player) {
    this.socketService.sendMessage('kick', player);
  }

  Close() {
    this.isVisible = false;
  }

  Guess_Button() {
    this.socketService.sendMessage('song_submission', { guess: this.value });
    this.value = '';
  }

  addEmoji(e) {
    this.chatMessage = this.chatMessage + e.emoji.native;
  }

  ChangeRoom(room) {
    this.socketService.sendMessage('change_room', room);
    this.room = room;
    this.songs = [];
    this.percent = 0;
    this.audio.pause();
    this.guessed = false;
    this.guessedArtist = false;
    this.guessedName = false;
    this.isWaiting = false;
    this.podiumVisible = false;
    clearInterval(this.waitingTimer);
    clearInterval(this.timer);
  }

  createMessage(type: string, content: string): void {
    this.message.create(type, content);
  }

  changeCollapseChat(e) {
    this.newMessage = false;
  }

  ngOnDestroy() {
    this.socketService.Disconnect();
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  AddToChat(sender, message) {
    const lastMessage = this.chatRoom[this.chatRoom.length - 1];
    if (lastMessage) {
      if (lastMessage.from === sender) {
        lastMessage.content = [...lastMessage.content, message];
      } else {
        this.chatRoom = [...this.chatRoom, {
          from: sender,
          content: new Array(message)
        }];
      }
    } else {
      this.chatRoom = [...this.chatRoom, {
        from: sender,
        content: new Array(message)
      }];
    }
    this.scrollToBottom();
  }

  SendChatMessage(e) {
    if (this.chatMessage) {
      if (e.code === 'Enter') {
        this.socketService.sendMessage('chat_message', {
          from: this.userService.User.username,
          content: this.chatMessage
        });
        this.AddToChat('Me', this.chatMessage);
        this.chatMessage = '';
        this.emotesVisible = false;
      }
    }
  }

  SendChatMessageButton() {
    if (this.chatMessage) {
      this.socketService.sendMessage('chat_message', {
        from: this.userService.User.username,
        content: this.chatMessage
      });
      this.AddToChat('Me', this.chatMessage);
      this.chatMessage = '';
      this.emotesVisible = false;
    }
  }

  SendAuth() {
    console.log(this.userService.User);
    this.socketService.sendMessage('lobby_auth', {
      id: this.userService.User.id,
      password: this.password,
      room: this.room
    });
  }

  Disconnect() {
    this.userService.Disconnect();
  }

  ngOnInit() {
    this.isMobile = window.innerWidth <= 800;
    window.onresize = () => this.isMobile = window.innerWidth <= 800;
    this.room = this.route.snapshot.params.room;
    this.socketService.Connect();
    this.isConnected = true;
    if (this.userService.User) {
      this.socketService.sendMessage('new_player', {
        id: this.userService.User.id,
        room: this.room
      });
    } else {
      this.userService.getUser().toPromise().then((res: any) => {
        this.userService.User = res;
        this.socketService.sendMessage('new_player', {
          id: this.userService.User.id,
          room: this.room
        });
      });
    }
    this.audio = new Audio();
    this.succesAudio = new Audio('/assets/success.mp3');
    this.endAudio = new Audio('/assets/end.mp3');
    this.socketService
      .getMessages()
      .subscribe((message) => {
        console.log(message);
        if (message.type === 'current_song') {
          this.roomInfos.rounds = message.data.rounds;
          this.roomInfos.roundCounter = message.data.roundCounter;
          this.percent = 0;
          this.podiumVisible = false;
          this.audio = new Audio(message.data.preview);
          this.audio.play();
          this.guessed = false;
          this.guessedArtist = false;
          this.guessedName = false;
          this.isWaiting = false;
          clearInterval(this.waitingTimer);
          this.timer = setInterval(() => {
            this.percent += 3.34;
          }, 1000);
        } else if (message.type === 'round_end') {
          this.winners = this.players.slice(0, 3);
          this.endAudio.play();
          this.podiumVisible = true;
        } else if (message.type === 'full_right') {
          if (this.isWaiting) {
            this.createMessage('error', 'The round ended, try again on the next one');
          } else {
            this.succesAudio.play();
            this.createMessage('success', 'Nice guess !');
            this.guessed = true;
            this.guessedArtist = true;
            this.guessedName = true;
            this.guessedArtistTxt = message.data.artist;
            this.guessedNameTxt = message.data.title;
          }
          this.songs = [{
            title: message.data.title,
            artist: message.data.artist,
            preview: message.data.preview,
            picture: message.data.picture,
            artistPoint: this.guessedArtist,
            titlePoint: this.guessedName
          }, ...this.songs];
        } else if (message.type === 'right_song') {
          if (this.isWaiting) {
            this.createMessage('error', 'The round ended, try again on the next one');
          } else {
            this.succesAudio.play();
            this.createMessage('success', 'You got the title !');
            this.guessedName = true;
            this.guessedNameTxt = message.data;
          }
        } else if (message.type === 'right_artist') {
          if (this.isWaiting) {
            this.createMessage('error', 'The round ended, try again on the next one');
          } else {
            this.succesAudio.play();
            this.createMessage('success', 'You got the artist !');
            this.guessedArtist = true;
            this.guessedArtistTxt = message.data;
          }
        } else if (message.type === 'wrong_song') {
          if (this.isWaiting) {
            this.createMessage('error', 'The round ended, try again on the next one');
          } else {
            this.createMessage('error', 'Wrong guess, try again');
          }
          this.guessed = false;
        } else if (message.type === 'waiting') {
          if (message.data && !this.guessed) {
            this.songs = [{
              title: message.data.title,
              artist: message.data.artist,
              preview: message.data.preview,
              picture: message.data.picture,
              artistPoint: this.guessedArtist,
              titlePoint: this.guessedName
            }, ...this.songs];
          }
          this.guessedArtistTxt = 'Artist';
          this.guessedNameTxt = 'Title';
          this.percent = 0;
          this.players.forEach(x => x.position = -1);
          clearInterval(this.timer);
          this.audio.pause();
          this.audio.currentTime = 0;
          this.isWaiting = true;
          this.waitingTimer = setInterval(() => {
            if (this.percent < 100) {
              this.percent += 25;
            }
          }, 1000);
        } else if (message.type === 'players_list') {
          console.log(this.userService.User);
          this.hasAccess = true;
          this.players = message.data;
        } else if (message.type === 'new_player') {
          this.players = [...this.players, message.data];
        } else if (message.type === 'player_point') {
          const player = this.players.find(x => x.username === message.data.username);
          player.points = message.data.points;
          player.position = message.data.position;
          this.players.sort((a, b) => b.points - a.points);
        } else if (message.type === 'rooms') {
          this.Rooms = message.data;
          this.RoomPage = Array(4).fill(0).map((x, i) => this.Rooms[i + 4 * this.Page]);
        } else if (message.type === 'chat_message') {
          this.AddToChat(message.data.from, message.data.content);
          if (this.isCollapsed) {
            this.newMessage = true;
          }
        } else if (message.type === 'lobby_auth_req') {
          this.hasAccess = false;
        } else if (message.type === 'lobby_auth_refused') {
          this.message.create('error', 'Wrong password, you will be redirected to lobby');
          this.router.navigate(['/public']);
        } else if (message.type === 'room_not_found') {
          this.message.create('error', 'The room you\'re trying to access is not found');
          this.router.navigate(['/public']);
        } else if (message.type === 'room_full') {
          this.message.create('error', 'The room you\'re trying to access is full');
          this.router.navigate(['/public']);
        } else if (message.type === 'room_info') {
          this.roomInfos = message.data;
          this.titleService.setTitle('QuizzTune - ' + this.roomInfos.name);
        } else if (message.type === 'kicked') {
          this.message.create('error', 'You have been kicked out of the room');
          this.router.navigate(['/public']);
        } else if (message.type === 'player_kicked') {
          this.AddToChat('SYSTEM', `The player ${message.data} has been kicked out of the room.`);
        } else if (message.type === 'xp_gain') {
          this.userService.User.xp = message.data.xp;
        } else if (message.type === 'level_up') {
          this.userService.User.xp = message.data.xp;
          this.userService.User.nextLevelXP = message.data.nextLevelXP;
          this.userService.User.level = message.data.level;
          this.notification.success(
            'Level Up !',
            'Congratulations you just reached level ' + message.data.level,
            { nzDuration: 3000 }
          );
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
