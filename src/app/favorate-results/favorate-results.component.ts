import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-favorate-results',
  templateUrl: './favorate-results.component.html',
  styleUrls: ['./favorate-results.component.css']
})
export class FavorateResultsComponent implements OnInit {

  constructor(
      public searchService: SearchService,
      private route: ActivatedRoute,
      private router: Router
      ) { }

  ngOnInit() {
  }
  goBackDetail(){
      console.log("go back detail")
      this.router.navigate(['/place-detail']);
  }
  deleteLocal(index:number){
      this.searchService.localStorageSearchResult.splice(index,1)
      localStorage.setItem('favorate',JSON.stringify(this.searchService.localStorageSearchResult));
  }
  getDetailsFromResult(index:number){
      this.searchService.detailAvailable=true;
      this.searchService.curDatilPlaceId=this.searchService.localStorageSearchResult[index].place_id;
      this.router.navigate(['/place-detail']);
  }
}
