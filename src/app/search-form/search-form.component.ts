import { Component, ViewChild, OnInit, NgZone, ElementRef} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AgmCoreModule ,AgmMap,MapsAPILoader,GoogleMapsAPIWrapper} from '@agm/core';
import { Location } from '@angular/common';
import { SearchService } from '../search.service';
import { SearchFormData } from '../searchformdata';

declare let google: any;
@Component({
    selector: 'app-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css']
})



export class SearchFormComponent implements OnInit {
    categories=['default','amusement park',"aquarium",'art gallery','cafe','shopping mall','stadium','transit station','travel agency','zoo',
    'bakery','bar','restaurant','car rental','museum','night club','park','parking',
    'beauty salon','bowling alley','campground','casino','movie theater',
    'lodging','airport','train station','subway station','bus station'];

    model = new SearchFormData("","default","");
    curLocation;
    options=1;
    notCurLocation;
    ooooooo(a,b){
        console.log(a);
        console.log(b)
    }
    @ViewChild("locationcasual") searchElementRef: ElementRef;
    onSubmit(){
        if(this.options==null){
            this.options=1;
        }
        var searchlocation= this.options==1? this.curLocation:this.notCurLocation;
        if(searchlocation==null){
            alert("input location wrong"+this.options);
            return ;
        }
        this.router.navigate(['/processing'])
        
        if(!this.model.distance){
            this.model.distance=10;
        }
        console.log(this.model)
        console.log(searchlocation)
        this.searchService.getSearchResultsFromCur(this.model,searchlocation)
        .subscribe(data => {this.searchService.searchResults=[];
            this.searchService.nextPage=false;
            this.searchService.searchResults.push(data);
            if(data.hasOwnProperty('next_page_token')){
                this.searchService.nextPage=true;
            }
            this.searchService.searchResultsAvailable=true;
            this.searchService.searchResultsAnimationState=true;
            this.router.navigate(['/search-results']);
            this.searchService.buttonOfresultandfavorate=true;
        });
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public searchService: SearchService,
        private apiMap:MapsAPILoader,
        public mapApiWrapper:GoogleMapsAPIWrapper,
        private location: Location,
        private ngZone: NgZone
        ) { }
    reset(){
        console.log(this.router.url)
        this.router.navigate(['']);
        window.location.reload(true);
    }
    ngOnInit() {
        this.options=1;
        this.apiMap.load().then(() => {
              let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                    types: ["address"]
              });
              autocomplete.addListener("place_changed", () => {
                  this.ngZone.run(() => {
                      //get the place result
                      let place = autocomplete.getPlace();

                      //verify result
                      if (place.geometry === undefined || place.geometry === null) {
                          this.notCurLocation=null;
                        return;
                      }
                      this.notCurLocation={lat:place.geometry.location.lat(),lon:place.geometry.location.lng()}
                      //set latitude, longitude and zoom
                  });
              });
              this.searchElementRef.nativeElement.addEventListener("keyup", () => {
                  console.log('keyup')
                  this.ngZone.run(() => {
                      //get the place result
                      let geocoder = new google.maps.Geocoder();
                      geocoder.geocode( { 'address': this.model.locationcasual}, (results, status) =>{
                          if (status == 'OK') {
                              if (results.length<=0||results[0].geometry === undefined || results[0].geometry === null) {
                                  this.notCurLocation=null;
                                  return;
                              }
                              this.notCurLocation={lat:results[0].geometry.location.lat(),lon:results[0].geometry.location.lng()}
                          } else {
                              console.log('Main Geocode not successful  ' + status);
                              this.notCurLocation=null;
                          }
                      });

                  });
              });
         });
        this.searchService.getCurrentLocation()
        .subscribe(data => this.curLocation = data);
        this.searchService.localGet();
    }
}

