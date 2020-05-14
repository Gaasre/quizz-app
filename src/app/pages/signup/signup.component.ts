import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  passwordVisible = false;
  password: string;
  email: string;
  username: string;
  remember = false;
  error = '';
  isMobile;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.isMobile = window.innerWidth <= 800;
    window.onresize = () => this.isMobile = window.innerWidth <= 800;
  }

  Signup() {
    this.userService.Signup({
      email: this.email,
      username: this.username,
      password: this.password
    }).toPromise().then((res: any) => {
      if (res.error) {
        this.error = res.error;
      } else {
        this.userService.User = res;
        this.router.navigate(['/public']);
      }
    });
  }

}
