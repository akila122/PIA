import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { PlayerComponent } from "./player/player.component";
import { AdminComponent } from "./admin/admin.component";
import { SupervComponent } from "./superv/superv.component";
import { AdminAnagramComponent } from "./admin/godcontrol/admin-anagram/admin-anagram.component";
import { AdminGrailComponent } from "./admin/godcontrol/admin-grail/admin-grail.component";
import { AdminFivesComponent } from "./admin/godcontrol/admin-fives/admin-fives.component";
import { AnagramGameComponent } from "./anagram-game/anagram-game.component";
import { TopchartComponent } from "./home/topchart/topchart.component";
import { MainGameComponent } from "./main-game/main-game.component";
import { MyNumGameComponent } from "./my-num-game/my-num-game.component";
import { FivesGameComponent } from "./fives-game/fives-game.component";
import { GeoGameComponent } from "./geo-game/geo-game.component";
import { GeoValidationComponent } from "./superv/validate-game/geo-validation/geo-validation.component";
import { GrailGameComponent } from "./grail-game/grail-game.component";
import { ResultsGameComponent } from "./results-game/results-game.component";
import { MainSoloComponent } from "./main-solo/main-solo.component";
import { AnagramSoloComponent } from "./anagram-solo/anagram-solo.component";
import { MyNumSoloComponent } from "./my-num-solo/my-num-solo.component";
import { FivesSoloComponent } from "./fives-solo/fives-solo.component";
import { GeoSoloComponent } from "./geo-solo/geo-solo.component";
import { GrailSoloComponent } from "./grail-solo/grail-solo.component";

const routes: Routes = [
  { path: "player", component: PlayerComponent },
  { path: "administrator", component: AdminComponent },
  { path: "supervisor", component: SupervComponent },
  {
    path: "game",
    component: MainGameComponent,
    children: [
      { path: "", component: AnagramGameComponent },
      { path: "mynum", component: MyNumGameComponent },
      { path: "fives", component: FivesGameComponent },
      { path: "geo", component: GeoGameComponent },
      { path: "grail", component: GrailGameComponent },
      { path: "results", component: ResultsGameComponent }
    ]
  },
  {
    path: "gamesolo",
    component: MainSoloComponent,
    children: [
      { path: "Anagram", component: AnagramSoloComponent },
      { path: "MyNum", component: MyNumSoloComponent },
      { path: "Fives", component: FivesSoloComponent },
      { path: "Geo", component: GeoSoloComponent },
      { path: "Grail", component: GrailSoloComponent }
    ]
  },
  { path: "gameValidation", component: GeoValidationComponent },
  { path: "", redirectTo: "homePage", pathMatch: "full" },
  { path: "homePage", component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
