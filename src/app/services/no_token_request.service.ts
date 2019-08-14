import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class NoTokenRequest {

  base_url = '';
  constructor(private httpClient: HttpClient, private globals: Globals) {
    this.base_url = globals.SERVER_URL + 'api/';
  }

  Post(data, path) {
    return this.httpClient.post(this.base_url + path, data);
  }

  Get(path) {
    return this.httpClient.get(this.base_url + path);
  }

  Update(data, path) {
    return this.httpClient.put(this.base_url + path, data);
  }
}
