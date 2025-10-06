/**
 * @author    ThemesBuckets <themebucketbd@gmail.com>
 * @copyright Copyright (c) 2018
 * @license   Fulcrumy
 * 
 * This File Represent Search Component of Hotel
 * File path - '../../../src/pages/hotel/search-tiang/search-tiang'
 */

import { Component } from '@angular/core';
import { IonicPage, //ActionSheetController, //Platform, 
NavController, NavParams, ModalController } from 'ionic-angular';
import { Search } from '../../../models/search';
//import { CalendarModal, CalendarModalOptions } from 'ion2-calendar';
import { RestProvider } from '../../../providers/rest/rest';
//import { CurrencyPipe } from '@angular/common';
import { Geolocation } from '@ionic-native/geolocation'; 
//import { GeocoderProvider } from '../../../providers/data/hotel_lib';
//import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-search-tiang',
  templateUrl: 'search-tiang.html',
})
export class SearchTiangPage {
  tabBarElement: any;

  searchObjects: Search = new Search();
  
  defStatus = '0';
  status = [
    {
      name: 'col1',
      options: [
        { text: 'All Data', value: '0' },
        { text: 'Active', value: '1' },
        { text: 'Expiring', value: '2' },
        { text: 'Expired', value: '3' }
      ]
    }
  ];
  
  defMapStatus = '0';
  mapstatus = [
    {
      name: 'col1',
      options: [
        { text: 'All Data', value: '0' },
        { text: 'Map Verified', value: '1' },
        { text: 'Map Unverified', value: '2' }
      ]
    }
  ];
  
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,  
    public restProvider: RestProvider,
  	private geolocation : Geolocation,
   // public actionsheetCtrl: ActionSheetController,
    public modalCtrl: ModalController) {
      	this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
      	this.reset();
  }

  disekitar(){
	 	this.restProvider.loadingAlert(true,true);
		this.geolocation.getCurrentPosition({
	    	enableHighAccuracy : true
	    }).then((res) => {
	      this.searchObjects.originLocationName='Map di Sekitar Anda';
		  this.searchObjects.lat=res.coords.latitude;
	      this.searchObjects.lng=res.coords.longitude;
		  this.restProvider.loadingAlert(false,true);
	      //this.reverseGeocoding(res.coords);
	      //this.loadMapList(todo,idx);
	    }).catch((error) => {
	    	this.restProvider.loadingAlert(false,true);
		  	console.log('Error getting location', error);
	    });
  }
   
  getLocation(lbl,type) {
    let todo={
	  	fil:type,
	  	label:lbl,
	  	koord:this.searchObjects
	  };
    const modal = this.modalCtrl.create('LocationPage',{list:todo});
    modal.onDidDismiss((data: any) => {
      	if (data!=undefined) {
      		if(type=='Map'){
		        this.searchObjects.originLocationName = data.desc;
		        this.searchObjects.lat=data.pos.lat;
		        this.searchObjects.lng=data.pos.lng;
		    	console.log(this.searchObjects);
	    	}else{
	    		this.searchObjects.querysearch = data.name;
	    	}
	    }
    });
    modal.present();
  }

  onChange(newValue,idx=0) {
  	if(idx==0)
    	this.filter.status=newValue;
    else
    	this.filter.mapstatus=newValue;
  }
  
  opsi={
  	isactive:0,
  	label:''
  };
  
  filter={ status:'',mapstatus:''};
  	
  reset(){
  	this.filter={ status:'',mapstatus:''};
  	this.defStatus='0';
  	this.defMapStatus='0';
  	this.searchObjects.originLocationName = 'Batam';
  	this.searchObjects.querysearch='';
    this.searchObjects.lat=1.142753;
    this.searchObjects.lng=104.014004;
  }
  /**
   * -------------------------------------------------------------
   * Find Map
   * -------------------------------------------------------------
   */
  findMap(idx=0) {
   // let valstatus=this.filter.status;
	let todo={
    	q:(this.searchObjects.querysearch),//=='Map di Sekitar Anda'?'':this.searchObjects.originLocationName),
    	status:this.filter.status,
    	verify:this.filter.mapstatus,
    	lat:this.searchObjects.lat,
    	lng:this.searchObjects.lng,
    	arr:"[\"mr.id_tiang\"]"
    };
    this.loadMapList(todo,idx);
  }
  
  loadMapList(todo,idx){
  	console.log(todo);
  	this.restProvider.postRestAPI(todo,'map/mapreklame',true)
    .then(data => {
    	console.log(data);
    	//console.log(JSON.parse(JSON.stringify(data)));
    	//console.log(data);
	    if(data["status"]!=='ok'){
		      if(data['error_msgs'].indexOf('ogin Expired')>=0){
	          	  this.restProvider.clearStorage();
		          let modal=this.modalCtrl.create('SignInPopPage');
				  modal.present();
			  }
			  else{
			  	 this.restProvider.showAlert(data['error_msgs']);
			  }
		}
		else if(data['diagnostic']['status']==200){
	      
	       let res={
		    	list:{
		    		result:data['data'],
		    	//	page:data['pagination'],
		    		search:todo,
		    		isactive:idx,
		    		detail:'FmapPage'
		    		//feeprice:data['feeprice']
		    	}
		    };
		    
		    const modal = this.modalCtrl.create('ReklameListPage',res);
		    modal.present();
      	}else
            this.restProvider.showAlert(data["diagnostic"]["error_msgs"]);
    });
  }

}
