import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { ProcessingComponent }    from '../processing/processing.component';
import { SearchResultsComponent }  from '../search-results/search-results.component';
import { PlaceDetailComponent } from '../place-detail/place-detail.component';
import { FavorateResultsComponent } from '../favorate-results/favorate-results.component'
import {SearchFormComponent} from '../search-form/search-form.component'
import {AppComponent} from "../app.component"
 
const searchRoutes: Routes = [
  { path: 'processing',  component: ProcessingComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'place-detail', component: PlaceDetailComponent },
  { path: 'favorate-results', component: FavorateResultsComponent }
];
 
@NgModule({
  imports: [
    RouterModule.forRoot(searchRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SearchRoutingModule { }