import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  @Input() player;
  loading = false;
  constructor(public userService: UserService) { }

  ngOnInit() {
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.loading = true;
      this.userService.Avatar(file).subscribe((res: any) => {
        if (res.id) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.player.avatar = '';
            this.userService.User.avatar = '';
            this.userService.tempAvatar = reader.result;
          };
          reader.readAsDataURL(file);
          this.loading = false;
        }
      });
    }
  }


}
