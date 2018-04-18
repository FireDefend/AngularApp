import { Component, OnInit,ViewChild, NgZone,AfterViewInit,ElementRef} from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { SearchService } from '../search.service';
import { MomentModule } from 'angular2-moment';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AgmCoreModule ,AgmMap,MapsAPILoader,GoogleMapsAPIWrapper} from '@agm/core';
import { Location } from '@angular/common';

declare let google: any;
@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.css'],
  animations: [
  trigger('flyInOut', [
    state('in', style({opacity: 1, transform: 'translateX(0)'})),
    transition('void => *', [
      style({
        opacity: 0,
        transform: 'translateX(-100%)'
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


export class PlaceDetailComponent implements OnInit, AfterViewInit{
  lat: number = 51.678418;
  lng: number = 7.809007;
  myDate: Date;
  state='void';
  fromLat;
  fromLng;
  stateTogg(){
      this.state = this.state === 'in' ? 'void' : 'in';

  }

  @ViewChild('myAgmMap') myMap:AgmMap;
  @ViewChild('mapDiv') myMapEle:ElementRef;
  @ViewChild("searchFromPlace") searchElementRef: ElementRef;
  constructor(
        public searchService: SearchService,
        private apiMap:MapsAPILoader,
        public mapApiWrapper:GoogleMapsAPIWrapper,
        private router: Router,
        private location: Location,
        private ngZone: NgZone
   ) { 
      this.myDate = new Date();
   }
  controller=1;


  changeState(i:number){
      this.controller=i
      if(i==3){
          this.myMap.triggerResize();
      }

  }
  putInLocalOrDelete(){
      if(this.ifInLocalStorage()){
          this.deleteLocalStorage()
      }else{
          this.searchService.localStorageSearchResult.push(this.searchService.placeDetail.result);
      }
      localStorage.setItem('favorate',JSON.stringify(this.searchService.localStorageSearchResult));

  }
  deleteLocalStorage(){
      for(var i=0;i<this.searchService.localStorageSearchResult.length;i++){
          if(this.searchService.localStorageSearchResult[i].place_id==this.searchService.placeDetail.result.place_id){
              this.searchService.localStorageSearchResult.splice(i,1)
          }
      }
  }
  ifInLocalStorage(){
      for(var i=0;i<this.searchService.localStorageSearchResult.length;i++){
          if(this.searchService.localStorageSearchResult[i].place_id==this.searchService.placeDetail.result.place_id){
              return true;
          }
      }
      return false;
  }
  hoursAfterDele=[];
  isWeekayAvailible=false;
  placeService;
  placeServiceIsReady;
  nativemap;
  selectedMode='DRIVING';
  fromInput;
  panorama;
  twitter(){
      var temp='https://twitter.com/intent/tweet?text=Check out ' +this.searchService.placeDetail.result.name+' located at '+this.searchService.placeDetail.result.formatted_address+
      ' Website:&url='+this.searchService.placeDetail.result.website+'&hashtags='+'TravelAndEntertainmentSearch';
      return temp;
  }
  ngAfterViewInit() {
      

  }
  calculateRoute(){
      console.log(this.fromLat);
      console.log(this.fromInput)
      if(!this.fromLat&&this.fromInput!=""&&this.fromInput!="My location"&&this.fromInput!=undefined&&this.fromInput!=null){
          alert("don't have origin place")
          return ;
      }
      if(this.fromInput==""||this.fromInput=="My location"||this.fromInput==undefined||this.fromInput==null){
          this.fromLat=this.searchService.curLocation.lat;
          this.fromLng=this.searchService.curLocation.lon;

      }
      var request = {
            origin:{lat: this.fromLat, lng: this.fromLng},
            destination:{lat: this.lat, lng: this.lng},
            travelMode: this.selectedMode,
            provideRouteAlternatives:true
      };
      var tempDisplay=this.searchService.directionsDisplay
      this.searchService.directionsService.route(request, function(response, status) {
            if (status == 'OK') {
                tempDisplay.setDirections(response);
            }
       });
  }
  streetView(){
      this.panorama.setPosition({lat: this.lat, lng: this.lng});
      this.panorama.setPov(/** @type {google.maps.StreetViewPov} */({
          heading: 265,
          pitch: 0
      }));
      var toggle = this.panorama.getVisible();
      if (toggle == false) {
          this.panorama.setVisible(true);
      } else {
          this.panorama.setVisible(false);
      }
  }
  ngOnInit() {
      if(this.searchService.detailAvailable==false||this.searchService.placeDetail.result.place_id!=this.searchService.curDatilPlaceId){
          this.apiMap.load().then(() => {
              let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                    types: ["address"]
              });
              autocomplete.addListener("place_changed", () => {
                  this.ngZone.run(() => {
                      //get the place result
                      let place = autocomplete.getPlace();

                      //verify result
                      console.log(place.formatted_address)
                      if (place.geometry === undefined || place.geometry === null) {
                          this.fromLat =null;
                          this.fromLng =null;
                        return;
                      }

                      //set latitude, longitude and zoom
                      this.fromLat = place.geometry.location.lat();
                      this.fromLng = place.geometry.location.lng();
                  });
              });
              this.searchElementRef.nativeElement.addEventListener("keyup", () => {
                  console.log('keyup')
                  this.ngZone.run(() => {
                      //get the place result
                      let geocoder = new google.maps.Geocoder();
                      geocoder.geocode( { 'address': this.fromInput}, (results, status) =>{
                          if (status == 'OK') {
                              if (results.length<=0||results[0].geometry === undefined || results[0].geometry === null) {
                                  this.fromLat =null;
                                  this.fromLng =null;
                                  return;
                              }
                              this.fromLat = results[0].geometry.location.lat();
                              this.fromLng = results[0].geometry.location.lng();
                          } else {
                              console.log('Geocode was not successful for the following reason: ' + status);
                              this.fromLat =null;
                              this.fromLng =null;
                          }
                      });

                  });
              });
              this.myMap.mapReady.subscribe(map => {
                  this.panorama = map.getStreetView();
                  this.searchService.directionsService = new google.maps.DirectionsService;
                  this.searchService.directionsDisplay = new google.maps.DirectionsRenderer;
                  this.searchService.directionsDisplay.setMap(map);
                  this.searchService.directionsDisplay.setPanel(document.getElementById('directionsPanel'));
                  this.nativemap=map
                  this.placeService = new google.maps.places.PlacesService(this.nativemap);
                  this.placeServiceIsReady = true;
                  var request = {
                      placeId: this.searchService.searchResults[this.searchService.curPage].results[this.searchService.numOfPlace].place_id
                  };
                  (this.placeService as any).getDetails(request, (results, status) => {
                      this.callback(results, status);
                  });

              });


          });
      }else{
          if(this.searchService.placeDetail.result.hasOwnProperty('photos')){
                 var photos=this.searchService.placeDetail.result.photos;
                this.photosUrl=new Array<any>(photos.length)
                for(var i=0;i<photos.length;i++){
                    this.photosUrl[i]=photos[i].getUrl({'maxWidth': photos[i].width})

                }
                this.photosReady=true;
            }else{
                this.photosReady=false;
            }
            this.isWeekayAvailible=this.searchService.placeDetail.result.hasOwnProperty('opening_hours')&&this.searchService.placeDetail.result.opening_hours.hasOwnProperty('weekday_text')
            if(this.isWeekayAvailible){

                this.hoursAfterDele=this.searchService.placeDetail.result.opening_hours.weekday_text.slice()
                this.hoursAfterDele.splice(this.myDate.getDay()-1,1);
            }
            this.reviewUpdateFromService();
            this.lat=this.searchService.placeDetail.result.geometry.location.lat();
            this.lng=this.searchService.placeDetail.result.geometry.location.lng();
      }
      this.state="in"

      //this.myMap.triggerResize();

  }
  photosUrl;
  photosReady=false;
  reviewsReady=false;
  googleReviewsArray=[];
  yelpReviewsArray=[];
  reviewsArray;
  reviews=[];
  reviewsCompany="Google Reviews";
  orderSort="Default Order";
  indexOfReviewArray=0;
   callback(place, status){
            this.searchService.placeDetail.result=place;
            if(place.hasOwnProperty('opening_hours')){
                    this.searchService.placeHours=true;
            }else{
                    this.searchService.placeHours=false;
            }
            console.log("GOOGLE API,,,,")
            console.log(place)
            this.searchService.placeDetail.result=place;
            this.lat=this.searchService.placeDetail.result.geometry.location.lat();
            this.lng=this.searchService.placeDetail.result.geometry.location.lng();
            this.isWeekayAvailible=this.searchService.placeDetail.result.hasOwnProperty('opening_hours')&&this.searchService.placeDetail.result.opening_hours.hasOwnProperty('weekday_text')
            if(this.isWeekayAvailible){

                this.hoursAfterDele=this.searchService.placeDetail.result.opening_hours.weekday_text.slice()
                this.hoursAfterDele.splice(this.myDate.getDay()-1,1);
            }
            if(place.hasOwnProperty('photos')){
                var photos=place.photos;
                this.photosUrl=new Array<any>(photos.length)
                for(var i=0;i<photos.length;i++){
                    this.photosUrl[i]=photos[i].getUrl({'maxWidth': photos[i].width})

                }
                this.photosReady=true;
            }else{
                this.photosReady=false;
            }
            if(place.hasOwnProperty('reviews')&&place.reviews.length>0){
                this.reviews=place.reviews;
                this.googleReviewsArray=[];
                this.googleReviewsArray.push(place.reviews);
                this.googleReviewsArray.push(place.reviews.slice().sort((a,b): number =>{  
                    if (a.rating < b.rating)
                        return 1;
                    else
                        return -1;}));
                this.googleReviewsArray.push(place.reviews.slice().sort((a,b): number =>{  
                    if (a.rating < b.rating)
                        return -1;
                    else
                        return 1;}));
                this.googleReviewsArray.push(place.reviews.slice().sort((a,b): number =>{  
                    if (a.time < b.time)
                        return 1;
                    else
                        return -1;}));
                this.googleReviewsArray.push(place.reviews.slice().sort((a,b): number =>{  
                    if (a.time < b.time)
                        return -1;
                    else
                        return 1;}));
                this.reviewsArray=this.googleReviewsArray;
                if(this.reviewsArray[0].length==0){
                    this.reviewsReady=false;
                }else{
                    this.reviewsReady=true;
                }

            }else{
                this.reviewsReady=false;
            }
            this.searchService.getYelpReviews().subscribe(data =>{
                var reviewsYelp=[]
                for(var indextransfer=0;indextransfer<(data as any).length;indextransfer++){
                    reviewsYelp.push({
                        'author_name':data[indextransfer].user.name,
                        'author_url':data[indextransfer].url,
                        'profile_photo_url':data[indextransfer].user.image_url,
                        'text':data[indextransfer].text,
                        'rating':data[indextransfer].rating,
                        'time':new Date(data[indextransfer].time_created).getTime()/1000
                    })
                }
                console.log(reviewsYelp);
                this.yelpReviewsArray=[];
                this.yelpReviewsArray.push(reviewsYelp);
                this.yelpReviewsArray.push(reviewsYelp.slice().sort((a,b): number =>{  
                    if (a.rating < b.rating)
                        return 1;
                    else
                        return -1;}));
                this.yelpReviewsArray.push(reviewsYelp.slice().sort((a,b): number =>{  
                    if (a.rating < b.rating)
                        return -1;
                    else
                        return 1;}));
                this.yelpReviewsArray.push(reviewsYelp.slice().sort((a,b): number =>{  
                    if (a.time < b.time)
                        return 1;
                    else
                        return -1;}));
                this.yelpReviewsArray.push(reviewsYelp.slice().sort((a,b): number =>{  
                    if (a.time < b.time)
                        return -1;
                    else
                        return 1;}));
            });
            this.reviewUpdateToService();
   }
   goBackList(){
       console.log("back")
       this.searchService.searchResultsAnimationState=false;
       this.location.back();
   }
  getPriceLevel(){
      var priceLevel=this.searchService.placeDetail.result.price_level;
      var priceStr=""
      for(var i=0;i<priceLevel;i++){
          priceStr+="$";

      }
      return priceStr    
  }
  getCurOpenHours(){
      var hours:string=this.searchService.placeDetail.result.opening_hours.weekday_text[this.myDate.getDay()-1];
      var i=hours.indexOf(":")
      return hours.substring(i+1)
  }
  getCurWeekday(){
      var hours:string=this.searchService.placeDetail.result.opening_hours.weekday_text[this.myDate.getDay()-1];
      var i=hours.indexOf(":")
      return hours.substring(0,i)
  }
  getWeekday(weekday:string){
      var i=weekday.indexOf(":")
      return weekday.substring(0,i)

  }
  getOpenHours(weekday:string){
     var i=weekday.indexOf(":")
     return weekday.substring(i+1)
  }
  getNewDate(){
      var time=this.myDate.getHours()+""+this.myDate.getMinutes()+""+this.myDate.getSeconds()+""+this.myDate.getMilliseconds()
      return time
  }
  orderArray=["Default Order","Highest Rating","Lowest Rating","Most Recent","Least Recent"]
  showReviews(index:number){
      this.indexOfReviewArray=index;
      this.orderSort=this.orderArray[index];
      this.reviews=this.reviewsArray[index];
      this.reviewUpdateToService();
      //console.log(this.reviews)
  }
  changeReviewaompany(index:number){
      if(index==0){
          this.reviewsCompany="Google Reviews";
          this.reviewsArray=this.googleReviewsArray;
          if(this.reviewsArray[0].length==0){
              this.reviewsReady=false;
          }else{
              this.reviewsReady=true;
          }
          this.reviews=this.reviewsArray[this.indexOfReviewArray];
      }else{
          this.reviewsCompany="Yelp Reviews";
          this.reviewsArray=this.yelpReviewsArray;
          if(this.reviewsArray[0].length==0){
              this.reviewsReady=false;
          }else{
              this.reviewsReady=true;
          }
          this.reviews=this.reviewsArray[this.indexOfReviewArray];
      }
      this.reviewUpdateToService();

  }
  reviewUpdateFromService(){
      this.reviewsArray=this.searchService.reviewsArray;
      this.googleReviewsArray=this.searchService.googleReviewsArray;
      this.yelpReviewsArray=this.searchService.yelpReviewsArray;
      this.indexOfReviewArray=this.searchService.indexOfReviewArray;
      this.reviews=this.searchService.reviewsArray[this.indexOfReviewArray];
      this.reviewsCompany=this.searchService.reviewsCompany;
      this.orderSort=this.searchService.orderSort;   
      if(this.reviewsArray[0].length==0){
          this.reviewsReady=false;
      }else{
          this.reviewsReady=true;
      }
  }
  reviewUpdateToService(){
      this.searchService.reviewsArray=this.reviewsArray;
      this.searchService.googleReviewsArray=this.googleReviewsArray;
      this.searchService.yelpReviewsArray=this.yelpReviewsArray;
      this.searchService.indexOfReviewArray=this.indexOfReviewArray;
      this.searchService.reviewsCompany=this.reviewsCompany;
      this.searchService.orderSort=this.orderSort;
  }


}
