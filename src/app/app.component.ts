import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SearchService } from './search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  results=true;
  constructor(
        private route: ActivatedRoute,
        private router: Router,
        public searchService: SearchService
        ) { }
  toSearchResults(){
      
      if(this.searchService.searchResultsAvailable){
          this.router.navigate(['/search-results']);
          this.searchService.buttonOfresultandfavorate=true;
      }

  }
  toFarorate(){
      this.searchService.buttonOfresultandfavorate=false;
      this.router.navigate(['/favorate-results']);
  }
}
