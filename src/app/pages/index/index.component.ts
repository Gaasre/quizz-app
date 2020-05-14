import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  connected = 0;
  constructor(private userService: UserService, private translate: TranslateService) { }

  isMobile = false;
  visible = false;
  selectedValue = 'fr';
  open = false;

  Select(val) {
    this.selectedValue = val;
    this.open = !this.open;
    this.setLang(val);
  }

  setLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit() {
    this.isMobile = window.innerWidth <= 800;
    window.onresize = () => this.isMobile = window.innerWidth <= 800;
    this.userService.connected().toPromise().then((res: any) => this.connected = res.connected);
  }

}
