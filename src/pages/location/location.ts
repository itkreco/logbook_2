/**
 * @author    ThemesBuckets <themebucketbd@gmail.com>
 * @copyright Copyright (c) 2018
 * @license   Fulcrumy
 * 
 * This File Represent Location Search Page Component
 * File path - '../../src/pages/location/location'
 */

import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
//import { HttpClient } from '@angular/common/http';
import { RestProvider } from '../../providers/rest/rest';
import { DataProvider} from '../../providers/data/data';
import { TitleCasePipe } from '@angular/common';

import { Geolocation } from '@ionic-native/geolocation'; 
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

//import { Geolocation } from '@ionic-native/geolocation'; 
declare var google: any;


@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {

	// List of Locations
	searchInput='';
	locations: any = [];
  //locationsPopular: any = [];

  // New List of Locations
  // This new list will help us for search
  //newLocationList: any = [];
  
  type:any={
  	fil:'',
  	label:'',
  	disabled:false,
  };
  
  
  //isconfirm:number=0;  
  selected:any=[];
  
  GoogleAutocomplete:any;
  map:any;
  markers:any=[];
  geocoder:any;
  
  constructor(public navCtrl: NavController,
		public dataProvider: DataProvider,
		public navParams: NavParams,
    	public viewCtrl: ViewController,
   // public http: HttpClient,  
	 	public titlecasePipe:TitleCasePipe,
	 	private zone: NgZone,
  		private geolocation : Geolocation,
	 	public restProvider: RestProvider) { 
		this.type = this.navParams.get('list');
		console.log('type location:',this.type);
    }

  /** Do any initialization */
  ngOnInit() {
        if(this.type.fil=='Map'){
        	if (this.isGoogleActive()) {
				this.GoogleAutocomplete = new google.maps.places.AutocompleteSuggestion();
				this.geocoder = new google.maps.Geocoder;
				this.markers = [];
				
		    	this.getLocations();
	    	}
			
    	}
		this.searchInput='';
  }

 positionSubscription:Subscription;
	
  clearMarkers(){
  	this.markers=[];
  }
  
 defValue(){
	  this.selected={
	  	name:this.type.koord.originLocationName,
	  	id:0,
	  	desc:this.type.koord.originLocationName,
	  	pos:{lat:this.type.koord.lat,lng:this.type.koord.lng}
	  };
 }
  
isGoogleActive(){
	if (!!google) {
		return true;
	}
	else {
		this.restProvider.showAlert('Something went wrong with the Internet Connection. Please check your Internet.');
		return false;
	}
}

refreshMap(pos){
    if (this.isGoogleActive()) {
		this.map = new google.maps.Map(document.getElementById('maploc'), {
			center: pos,
	    	mapTypeId: google.maps.MapTypeId.ROADMAP, 
			zoom: 13
		});
		
		let marker = new google.maps.Marker({
	      position: pos,
	      map: this.map
	    });
	    
	    this.markers.push(marker);
	   console.log(this.type.koord);
		/*if(this.type.koord.lat==null||this.type.koord.lng==null){
	    	let that=this;
		    this.map.addListener('center_changed', function() {
	          // 3 seconds after the center of the map has changed, pan back to the
	          // marker.
	          window.setTimeout(function() {
		          pos=that.map.getCenter();
		          marker.setPosition(pos);
		          that.selected={
				  	pos:{lat:pos.lat().toFixed(6), lng:pos.lng().toFixed(6)}
				  };
				  //console.log(pos);
	          }, 500);
	        });
		}*/
    }
}

ionViewDidEnter(){
	if(this.type.fil=='Map'){
		//Set latitude and longitude of some place
		//let pos={lat:-6.9922148,lng:113.8417968};
		//let curpos={lat:-6.9922148,lng:113.8417968};
  		let pos={lat:this.type.koord.lat, lng:this.type.koord.lng};
		

		
		if(this.type.koord.lat==null || this.type.koord.lng==null){
			this.restProvider.loadingAlert(true,true);
			this.geolocation.getCurrentPosition({
		    	enableHighAccuracy : true
		    }).then((res) => {
		        pos.lat=res.coords.latitude;
			    pos.lng=res.coords.longitude;
				this.restProvider.loadingAlert(false,true);
				this.refreshMap(pos);
		    }).catch((error) => {
		    	this.restProvider.loadingAlert(false,true);
		    	this.restProvider.showAlert(error.GeolocationPositionError.message); 
			  	console.log('Error getting location', error);
				this.refreshMap({lat:-6.8822148,lng:113.8400968});
			 // 	this.loadPeta(pos);
		    });
			
			this.positionSubscription = this.geolocation.watchPosition()
		    .pipe(
		        filter((p) => p.coords !== undefined) //Filter Out Errors
		    )
		    .subscribe(data => {
				
		        setTimeout(() => {
			      pos={ lat: data.coords.latitude, lng: data.coords.longitude };
		          this.markers[0].setPosition(pos);
				  //this.refreshMap(pos);
				  console.log("update page location...",pos);
		        }, 1000);
		    });
		}
		else this.refreshMap(pos);
   	}
}

  /**
   * Get Location Data From this API- https://restcountries.eu/rest/v2/all
   */
  getLocations(query='') {
    let i = 0;
   // this.isconfirm=0;
  	this.selected=[];
    let url='';
    if(this.type.fil=='Map')
    {	
    	if(this.isGoogleActive()){
	    	if (query == '') {
			    //this.newLocationList = [];
	      	//	this.map.setCenter(lat: 1.142753, lng: 104.014004}); //batam
	      		this.defValue();
			    return;
			}else{
				this.GoogleAutocomplete.getPlacePredictions({ input: query },
					(predictions, status) => {
					this.locations = [];
					//this.newLocationList=[];
					if(predictions!=null){
					    this.zone.run(() => {
					      predictions.forEach((prediction) => {
					        this.locations.push(prediction);
					      });
					    //  this.newLocationList=this.locations;
					    });
				    }
				});
			}
		}
    }else {
	    if(this.type.fil=='qMap'){
	    	url='map/searchMap';
	    }else if(this.type.fil=='qReklame'){
	    	url='map/searchReklame';
	    }else if(this.type.fil=='qNpwpd'){
	    	url='map/searchNpwpd';
	    }else if(this.type.fil=='qTiang'){
	    	url='map/searchTiang';
	    }
	    let todo;
	    	
	    if(url!=''){
	    	if(this.type.arr==undefined)
		    	todo={
		    		q:query
	    		};
	    	else
	    		todo={
		    		q:query,
		    		arr:JSON.stringify(this.type.arr)
	    		};
	    	
	    	this.restProvider.postRestAPI(todo,url,false)
		    .then(data => {
		    	console.log(data);
		    	this.locations=[];
				//this.newLocationList=[];
		    	if(data['status']=='ok'){
		    	    this.zone.run(() => {
				       Object.keys(data['data']).forEach(key=> {
				          let code = data['data'][key]['id'];
				          let location = data['data'][key]['description'];
				          let jml = data['data'][key]['jml'];
				          let code1=data['data'][key]['code1']==undefined?code:data['data'][key]['code1'];
				          this.locations[i] = {
				          	name:code,
				          	alpha3Code:code1,
				          	count:jml,
				          	location:location
				          };
				          i++;
				        //  this.newLocationList = this.locations;
				       });
				       console.log(this.locations);
					});
					    
			        
		      	}
		    });
	    }
	    //console.log('url:',url,todo);
    }
    
  }

  /**
   * After Pick One Location From List, Dismiss This Current Modal
   * and Go Back to It's Parent Page.
   * 
   * @param location    Selected Location
   */

chooseLocation(location) {
    this.viewCtrl.dismiss(location);
}
	
chooseMapLocation(item){
  this.clearMarkers();
  this.locations=[];
  this.restProvider.loadingAlert(true,true);
  this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
    if(status === 'OK' && results[0]){
      
      // Map Options 
      this.refreshMap(results[0].geometry.location);
      
	  this.selected={
	  	name:item.description,
	  	id:item.place_id,
	  	desc:item.structured_formatting.main_text,
	  	pos:{lat:results[0].geometry.location.lat(),lng:results[0].geometry.location.lng()}
	  };
	  
  	  this.searchInput=this.selected.desc;
   //   this.isconfirm=1;
	 // console.log(results);
    }
    this.restProvider.loadingAlert(false,true);
  		  	
  })
}
  /**
   * Search Query
   * @param ev 
   */
  getItems(ev: any) {
    // Reset items back to all of the items
    
    	// set val to the value of the searchbar
	    let val = ev.target.value;
	//	this.locations=[];
		          
	    // if the value is an empty string don't filter the items
	    if (val && val.length>2 && val.trim() != '') {
	      this.getLocations(val);
	    }
    }
	
  /**
   * Dismiss function
   * This function dismiss the popup modal
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  confirm() {
   // let pos=this.markers[0].getPosition();
    //if(this.type.koord.lat==null||this.type.koord.lng==null)
	this.positionSubscription.unsubscribe();
    this.viewCtrl.dismiss(this.selected);
  }
}

