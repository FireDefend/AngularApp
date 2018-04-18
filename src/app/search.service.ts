import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient } from '@angular/common/http';
import { SearchFormData } from './searchformdata';

@Injectable()
export class SearchService {
  constructor(private http: HttpClient

  ) { }
  getCurrentLocation(){
    return this.http.get("http://ip-api.com/json");
  }
  public curLocation;
  public searchResults=[];
  public nextPage=false;
  public placeDetail={'result': this.nextPage as any};
  public placeHours=false;
  public numOfPlace=0;
  public curPage=0;
  public searchResultsAvailable=false;
  public detailAvailable=false;
  public curDatilPlaceId;
  public searchResultsAnimationState=true;
  public googleReviewsArray=[];
  public yelpReviewsArray=[];
  public reviewsArray;
  //public reviews=[];
  public reviewsCompany="Google Reviews";
  public orderSort="Default Order";
  public indexOfReviewArray=0;
  public directionsService;
  public directionsDisplay;
  public localStorageSearchResult;
  public buttonOfresultandfavorate=true;
  public bababa=false;
  localGet(){
      this.localStorageSearchResult=localStorage.getItem('favorate');
      if(this.localStorageSearchResult==null){
          this.localStorageSearchResult=[];
          localStorage.setItem('favorate',JSON.stringify([]));
      }else{
          this.localStorageSearchResult=JSON.parse(this.localStorageSearchResult);
      }

  }
  getSearchResultsFromCur(model:SearchFormData,curLocation){
    console.log("run nodeddddd")
    this.curLocation=curLocation;
    console.log(curLocation)
    var url="http://tutorials-a9mse-env.us-east-2.elasticbeanstalk.com/"+"process_get?searchFromCur="+encodeURIComponent(JSON.stringify(curLocation))+"&distance="+model.distance+"&keyword="+model.keyword+"&category="+model.category;
    console.log(url)
    return this.http.get(url)

  }
  getSearchNext(index:number){
      var url="http://tutorials-a9mse-env.us-east-2.elasticbeanstalk.com/"+"process_get?nextPage="+this.searchResults[index].next_page_token;
      console.log(url)
    return this.http.get(url)

  }

  getDetailFromService(id:string){
    var url="http://tutorials-a9mse-env.us-east-2.elasticbeanstalk.com/"+"process_get?placeDetails="+id;
    console.log(url)
    return this.http.get(url)
  }
  getYelpReviews(){
      console.log("request yelp")
      this.placeDetail.result;
      var address=this.placeDetail.result.address_components;
      var city,california,country,postcode;
      for(var i=0;i<address.length;i++){
          if(address[i].types[0]=='locality'){
              city=address[i].short_name;
          }else if(address[i].types[0]=='administrative_area_level_1'){
              california=address[i].short_name;
          }else if(address[i].types[0]=='country'){
              country=address[i].short_name;
          }else if(address[i].types[0]=='postal_code'){
              postcode=address[i].short_name;
          }
      }
      var url="http://tutorials-a9mse-env.us-east-2.elasticbeanstalk.com/";
      url += ("process_get?yelpreview="+this.placeDetail.result.name+"&address1="+this.placeDetail.result.formatted_address+"&city="+city+"&california="+california+"&country="+country+"&postcode="+postcode);
      url=url.replace('#','')
      console.log(url)
      //console.log(url)
      //console.log("request yelp before")
      return this.http.get(url);
  }


}
