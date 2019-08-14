import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = '';
  private socket;

  constructor(private globals: Globals) {
    this.url = globals.SERVER_URL;
  }

  public Connect() {
    this.socket = io(this.url);
  }

  public sendMessage(type, message) {
    this.socket.emit(type, message);
  }

  public Disconnect() {
    this.socket.close();
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('current_song', (message) => {
        observer.next({
          type: 'current_song',
          data: message
        });
      });
      this.socket.on('wrong_song', (message) => {
        observer.next({
          type: 'wrong_song',
          data: message
        });
      });
      this.socket.on('right_song', (message) => {
        observer.next({
          type: 'right_song',
          data: message
        });
      });
      this.socket.on('right_artist', (message) => {
        observer.next({
          type: 'right_artist',
          data: message
        });
      });
      this.socket.on('full_right', (message) => {
        observer.next({
          type: 'full_right',
          data: message
        });
      });
      this.socket.on('waiting', (message) => {
        observer.next({
          type: 'waiting',
          data: message
        });
      });
      this.socket.on('player_point', (message) => {
        observer.next({
          type: 'player_point',
          data: message
        });
      });
      this.socket.on('players_list', (message) => {
        observer.next({
          type: 'players_list',
          data: message
        });
      });
      this.socket.on('new_player', (message) => {
        observer.next({
          type: 'new_player',
          data: message
        });
      });
      this.socket.on('rooms', (message) => {
        observer.next({
          type: 'rooms',
          data: message
        });
      });
      this.socket.on('chat_message', (message) => {
        observer.next({
          type: 'chat_message',
          data: message
        });
      });
      this.socket.on('lobby_exist', (message) => {
        observer.next({
          type: 'lobby_exist',
          data: message
        });
      });
      this.socket.on('lobby_created', (message) => {
        observer.next({
          type: 'lobby_created',
          data: message
        });
      });
      this.socket.on('lobbies', (message) => {
        observer.next({
          type: 'lobbies',
          data: message
        });
      });
      this.socket.on('lobby_auth_req', (message) => {
        observer.next({
          type: 'lobby_auth_req',
          data: message
        });
      });
      this.socket.on('lobby_auth_refused', (message) => {
        observer.next({
          type: 'lobby_auth_refused',
          data: message
        });
      });
      this.socket.on('room_info', (message) => {
        observer.next({
          type: 'room_info',
          data: message
        });
      });
      this.socket.on('kicked', (message) => {
        observer.next({
          type: 'kicked',
          data: message
        });
      });
      this.socket.on('player_kicked', (message) => {
        observer.next({
          type: 'player_kicked',
          data: message
        });
      });
      this.socket.on('room_not_found', (message) => {
        observer.next({
          type: 'room_not_found',
          data: message
        });
      });
      this.socket.on('room_full', (message) => {
        observer.next({
          type: 'room_full',
          data: message
        });
      });
      this.socket.on('round_end', (message) => {
        observer.next({
          type: 'round_end',
          data: message
        });
      });
    });
  }
}
