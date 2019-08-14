import { Component, Inject } from '@angular/core';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { UserService } from './services/user.service';
import { TokenRequest } from './services/token_request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quizApp';

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private userService: UserService,
              private tokenRequest: TokenRequest, private router: Router) {
    const userToken = this.storage.get('token');
    if (userToken) {
      this.tokenRequest.setAuthorization(userToken);
      this.userService.getUser().toPromise().then((res: any) => {
        this.userService.User = res;
      }).catch((err) => {
        this.storage.remove('token');
        this.router.navigate(['/']);
      });
    }
  }
}
