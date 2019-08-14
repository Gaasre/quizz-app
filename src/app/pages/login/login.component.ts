import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  passwordVisible = false;
  password: string;
  email: string;
  remember = false;
  error = '';
  isMobile;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    window.onresize = () => this.isMobile = window.innerWidth <= 800;
  }

  Login() {
    this.userService.Login({
      email: this.email,
      password: this.password
    }).toPromise().then((res: any) => {
      if (res.error) {
        this.error = res.error;
      } else {
        this.userService.User = res;
        this.router.navigate(['/lobby']);
      }
    });
  }

}
