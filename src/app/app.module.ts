import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ProcessingComponent } from './processing/processing.component';
import { SearchRoutingModule } from './search-form/search-routing.module';
import { SearchService } from './search.service';
import { PlaceDetailComponent } from './place-detail/place-detail.component';
import { MomentModule } from 'angular2-moment';
import { AgmCoreModule ,GoogleMapsAPIWrapper} from '@agm/core';
import { FavorateResultsComponent } from './favorate-results/favorate-results.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    SearchResultsComponent,
    ProcessingComponent,
    PlaceDetailComponent,
    FavorateResultsComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    SearchRoutingModule,
    HttpClientModule,
    MomentModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyByUnSoaoYiRbHGW8NOsLfGUX_QPVWwTJ4',
      libraries: ['places']
     })
  ],
  providers: [SearchService,GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
