import { Component, OnInit,ViewChild ,AfterViewInit} from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SearchService } from '../search.service';
import { AgmCoreModule ,AgmMap,MapsAPILoader,GoogleMapsAPIWrapper} from '@agm/core';
declare let google: any;

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  animations: [
  trigger('flyInOut', [
    state('in', style({opacity: 1, transform: 'translateX(0)'})),
    transition('void => in', [
      style({
        opacity: 0,
        transform: 'translateX(100%)'
      }),
      animate('0.3s ease-in')
    ]),
    transition('* => void', [
      animate('0.3s 0.1s ease-out', style({
        opacity: 0,
        transform: 'translateX(100%)'
      }))
    ])
  ])
]
})
export class SearchResultsComponent implements OnInit ,AfterViewInit{

  constructor(
      private route: ActivatedRoute,
      public searchService: SearchService,
      private router: Router,
      private apiMap:MapsAPILoader
   ) { }
  results;
  index=0;
  placeService;
  placeServiceIsReady;
  state='in'
  ngAfterViewInit() {
      this.state='in';


  }
  huang = new Array<boolean>(20);
  ngOnInit(){
      this.index=this.searchService.curPage;
      this.results=this.searchService.searchResults[this.index].results;
      this.updateHuang();
      console.log(this.huang)
      //console.log(this.index);
      //console.log(this.results);
  }
  babababa=false;
  huang2 = new Array<boolean>(20);
  updateHuang(){
      for(var i=0;i < this.results.length;i++){
          if(this.ifInLocalStorage(i)){
              this.huang[i]=true;
              this.huang2[i]=true;
          }else{
              this.huang[i]=false;
              this.huang2[i]=false;
          }
      }
      this.searchService.bababa=!this.searchService.bababa
      console.log(this.searchService.bababa)
  }
  goBackDetail(){
      console.log("go back detail")
      this.router.navigate(['/place-detail']);
  }
  getNextPage(){
      if(this.index+1<this.searchService.searchResults.length){
          this.index++;
          this.searchService.curPage=this.index;
          this.results=this.searchService.searchResults[this.index].results;
          this.updateHuang();
      }else if(this.index+1==this.searchService.searchResults.length){
          this.searchService.getSearchNext(this.index)
          .subscribe(data => {this.searchService.searchResults.push(data)
               if(data.hasOwnProperty('next_page_token')){
                    this.searchService.nextPage=true;
               }else{
                   this.searchService.nextPage=false;
               }
               this.index++;
               this.searchService.curPage=this.index;
               this.results=this.searchService.searchResults[this.index].results;
               this.updateHuang();
               console.log(this.index);
               console.log(this.results);
           });
      }


  }
  getPreviousPage(){
      this.index--;
      this.searchService.curPage=this.index;
      this.results=this.searchService.searchResults[this.index].results;
      this.updateHuang();
  }
  putInLocalOrDelete(indexOfLocal:number){
      if(this.ifInLocalStorage(indexOfLocal)){
          this.deleteLocalStorage(indexOfLocal)
      }else{
          this.searchService.localStorageSearchResult.push(this.searchService.searchResults[this.searchService.curPage].results[indexOfLocal]);
      }
      localStorage.setItem('favorate',JSON.stringify(this.searchService.localStorageSearchResult));
      this.updateHuang();
      console.log(this.huang)
  }
  deleteLocalStorage(indexOfLocal:number){
      for(var i=0;i<this.searchService.localStorageSearchResult.length;i++){
          if(this.searchService.localStorageSearchResult[i].place_id==this.searchService.searchResults[this.searchService.curPage].results[indexOfLocal].place_id){
              this.searchService.localStorageSearchResult.splice(i,1)
          }
      }
  }
  ifInLocalStorage(indexOfLocal:number){
      for(var i=0;i<this.searchService.localStorageSearchResult.length;i++){
          if(this.searchService.localStorageSearchResult[i].place_id==this.searchService.searchResults[this.searchService.curPage].results[indexOfLocal].place_id){
              return true;
          }
      }
      return false;
  }
  getDetailsFromResult(numOfPlace:number){
      // var request = {
      //     placeId: this.results[numOfPlace].place_id
      //   };
      //   (this.placeService as any).getDetails(request, callback);
      //   function callback(place, status){
      //       this.searchService.placeDetail.result=place;
      //       if(place.hasOwnProperty('opening_hours')){
      //               this.searchService.placeHours=true;
      //       }else{
      //               this.searchService.placeHours=false;
      //       }
      //       console.log(place)
      //       this.router.navigate(['/place-detail'])
      //   }
      this.searchService.detailAvailable=true;
      this.searchService.numOfPlace=numOfPlace;
      this.searchService.curPage=this.index;
      this.searchService.curDatilPlaceId=this.searchService.searchResults[this.searchService.curPage].results[this.searchService.numOfPlace].place_id;
      this.router.navigate(['/place-detail']);


  }

}
