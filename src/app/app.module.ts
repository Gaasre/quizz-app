import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { PlayerComponent } from './components/player/player.component';
import { SongComponent } from './components/song/song.component';
import { PlayerDetailComponent } from './components/player-detail/player-detail.component';
import { RoomComponent } from './pages/room/room.component';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LoginGuard } from './services/login.guard';
import { RoomGuard } from './services/room.guard';
import { SignupComponent } from './pages/signup/signup.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { LobbyComponent } from './pages/lobby/lobby.component';
import { TestComponent } from './test/test.component';
import { StorageServiceModule } from 'angular-webstorage-service';
import { Globals } from './globals';
import { PodiumComponent } from './components/podium/podium.component';
import { IndexComponent } from './pages/index/index.component';
import { PublicRoomsComponent } from './pages/public-rooms/public-rooms.component';
import { PrivateRoomsComponent } from './pages/private-rooms/private-rooms.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { TranslateService } from './services/translate.service';

registerLocaleData(en);

const appRoutes: Routes = [
  { path: 'room/:room', component: RoomComponent, canActivate: [RoomGuard] },
  { path: 'public', component: PublicRoomsComponent, canActivate: [RoomGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [LoginGuard] },
  { path: 'private', component: PrivateRoomsComponent, canActivate: [RoomGuard] },
  { path: '', component: IndexComponent, canActivate: [LoginGuard] }
];

export function setupTranslateFactory(
  service: TranslateService) {
  return () => service.use('fr');
}

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    SongComponent,
    PlayerDetailComponent,
    RoomComponent,
    LoginComponent,
    SignupComponent,
    LobbyComponent,
    TestComponent,
    PodiumComponent,
    IndexComponent,
    PublicRoomsComponent,
    PrivateRoomsComponent,
    TranslatePipe
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    StorageServiceModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PickerModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    Globals,
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [ TranslateService ],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
