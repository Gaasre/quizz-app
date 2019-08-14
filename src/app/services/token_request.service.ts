import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class TokenRequest {

  base_url = '';
  authorizationHeader;
  constructor(private httpClient: HttpClient, private globals: Globals) {
    this.base_url = globals.SERVER_URL + 'protected/';
  }

  setAuthorization(token) {
    this.authorizationHeader = { headers: {authorization: token} };
  }

  post(path, data) {
    return this.httpClient.post(this.base_url + path, data, this.authorizationHeader);
  }

  get(path) {
    return this.httpClient.get(this.base_url + path, this.authorizationHeader);
  }

  put(path, data) {
    return this.httpClient.put(this.base_url + path, data, this.authorizationHeader);
  }

  delete(path) {
    return this.httpClient.delete(this.base_url + path, this.authorizationHeader);
  }

  public upload(data) {
    const uploadURL = `${this.base_url}user/avatar`;
    const formData = new FormData();
    formData.append('file', data);
    return this.httpClient.post<any>(uploadURL, formData, {
        reportProgress: true,
        observe: 'events',
        headers: this.authorizationHeader.headers
    }).pipe(map((event) => {

        switch (event.type) {

            case HttpEventType.UploadProgress:
                const progress = Math.round(100 * event.loaded / event.total);
                return { status: 'progress', message: progress };

            case HttpEventType.Response:
                return event.body;
            default:
                return `Unhandled event: ${event.type}`;
        }
    })
    );
}

}
