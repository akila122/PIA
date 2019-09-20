import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material.module";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./home/login/login.component";
import { RegistrationComponent } from "./home/registration/registration.component";
import { TopchartComponent } from "./home/topchart/topchart.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ChangePassComponent } from "./home/login/change-pass/change-pass.component";
import { ResetPassComponent } from "./home/login/reset-pass/reset-pass.component";
import { AdminComponent } from "./admin/admin.component";
import { SupervComponent } from "./superv/superv.component";
import { PlayerComponent } from "./player/player.component";
import { UserCardComponent } from "./user-card/user-card.component";
import { UserApproveComponent } from "./admin/user-approve/user-approve.component";
import { GODControlComponent } from "./admin/godcontrol/godcontrol.component";
import { DatePickerComponent } from "./admin/date-picker/date-picker.component";
import { AdminAnagramComponent } from "./admin/godcontrol/admin-anagram/admin-anagram.component";
import { AdminGrailComponent } from "./admin/godcontrol/admin-grail/admin-grail.component";
import { AdminFivesComponent } from "./admin/godcontrol/admin-fives/admin-fives.component";
import { CreateGameComponent } from "./superv/create-game/create-game.component";
import { ValidateGameComponent } from "./superv/validate-game/validate-game.component";
import { SupervAnagramComponent } from "./superv/create-game/superv-anagram/superv-anagram.component";
import { SupervGrailComponent } from "./superv/create-game/superv-grail/superv-grail.component";
import { SupervFivesComponent } from "./superv/create-game/superv-fives/superv-fives.component";
import { ScrollDispatchModule } from "@angular/cdk/scrolling";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { AppSettings } from "./app.settings.module";
import { GameRoomComponent } from "./player/game-room/game-room.component";
import { GodPlayComponent } from "./player/god-play/god-play.component";
import { GodRankComponent } from "./player/god-rank/god-rank.component";
import {
  DuelCardComponent,
  MinuteSecondsPipe
} from "./duel-card/duel-card.component";
import { AnagramGameComponent } from "./anagram-game/anagram-game.component";
import { MainGameComponent } from "./main-game/main-game.component";
import { MyNumGameComponent } from "./my-num-game/my-num-game.component";
import { FivesGameComponent } from "./fives-game/fives-game.component";
import { GeoGameComponent } from "./geo-game/geo-game.component";
import { GeoValidationComponent } from "./superv/validate-game/geo-validation/geo-validation.component";
import { DuelSupervisorComponent } from "./superv/duel-supervisor/duel-supervisor.component";
import { GrailGameComponent } from "./grail-game/grail-game.component";
import { ResultsGameComponent } from "./results-game/results-game.component";
import { MonthlyChartComponent } from "./home/topchart/monthly-chart/monthly-chart.component";
import { Last20ChartComponent } from "./home/topchart/last20-chart/last20-chart.component";
import { ChatComponent } from "./chat/chat.component";
import { AnagramSoloComponent } from "./anagram-solo/anagram-solo.component";
import { FivesSoloComponent } from "./fives-solo/fives-solo.component";
import { MyNumSoloComponent } from "./my-num-solo/my-num-solo.component";
import { GeoSoloComponent } from "./geo-solo/geo-solo.component";
import { GrailSoloComponent } from "./grail-solo/grail-solo.component";
import { MainSoloComponent } from "./main-solo/main-solo.component";
import { GoDChartComponent } from "./player/god-rank/go-dchart/go-dchart.component";
import { DuelChartComponent } from "./player/god-rank/duel-chart/duel-chart.component";
import { GameExceptionComponent } from "./game-exception/game-exception.component";

const config: SocketIoConfig = { url: AppSettings.API_ENDPOINT, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent,
    TopchartComponent,
    ChangePassComponent,
    ResetPassComponent,
    AdminComponent,
    SupervComponent,
    PlayerComponent,
    UserCardComponent,
    UserApproveComponent,
    GODControlComponent,
    DatePickerComponent,
    AdminAnagramComponent,
    AdminGrailComponent,
    AdminFivesComponent,
    CreateGameComponent,
    ValidateGameComponent,
    SupervAnagramComponent,
    SupervGrailComponent,
    SupervFivesComponent,
    GameRoomComponent,
    GodPlayComponent,
    GodRankComponent,
    DuelCardComponent,
    AnagramGameComponent,
    MainGameComponent,
    MinuteSecondsPipe,
    MyNumGameComponent,
    FivesGameComponent,
    GeoGameComponent,
    GeoValidationComponent,
    DuelSupervisorComponent,
    GrailGameComponent,
    ResultsGameComponent,
    MonthlyChartComponent,
    Last20ChartComponent,
    ChatComponent,
    AnagramSoloComponent,
    FivesSoloComponent,
    MyNumSoloComponent,
    GeoSoloComponent,
    GrailSoloComponent,
    MainSoloComponent,
    GoDChartComponent,
    DuelChartComponent,
    GameExceptionComponent
  ],
  imports: [
    ScrollDispatchModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ChangePassComponent,
    ResetPassComponent,
    DatePickerComponent,
    AdminAnagramComponent,
    AdminFivesComponent,
    AdminGrailComponent,
    SupervAnagramComponent,
    SupervFivesComponent,
    SupervGrailComponent,
    MonthlyChartComponent,
    Last20ChartComponent,
    DuelChartComponent,
    GoDChartComponent,
    GameExceptionComponent
  ]
})
export class AppModule {}
