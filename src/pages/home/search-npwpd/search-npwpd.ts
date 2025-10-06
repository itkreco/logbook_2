/**
 * @author    ThemesBuckets <themebucketbd@gmail.com>
 * @copyright Copyright (c) 2018
 * @license   Fulcrumy
 * 
 * This File Represent Search Component of Hotel
 * File path - '../../../src/pages/hotel/search-npwpd/search-npwpd'
 */

import { Component } from '@angular/core';
import { IonicPage, //ActionSheetController, //Platform, 
NavController, NavParams, ModalController } from 'ionic-angular';
import { Search } from '../../../models/search';
//import { CalendarModal, CalendarModalOptions } from 'ion2-calendar';
import { RestProvider } from '../../../providers/rest/rest';
//import { CurrencyPipe } from '@angular/common';
//import { Geolocation } from '@ionic-native/geolocation'; 
//import { GeocoderProvider } from '../../../providers/data/hotel_lib';
//import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-search-npwpd',
  templateUrl: 'search-npwpd.html',
})
export class SearchNpwpdPage {
  tabBarElement: any;

  searchObjects: Search = new Search();
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,  
    public restProvider: RestProvider,
  	//private geolocation : Geolocation,
   // public actionsheetCtrl: ActionSheetController,
    public modalCtrl: ModalController) {
      	this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
      	this.reset();
  }
   
  getLocation(lbl,type) {
    let todo={
	  	fil:type,
	  	label:lbl,
	  	arr:['mp.npwpd'],
	  	koord:this.searchObjects
	  };
    const modal = this.modalCtrl.create('LocationPage',{list:todo});
    modal.onDidDismiss((data: any) => {
      	if (data!=undefined) {
      		this.searchObjects.querysearch = data.name;
	    }
    });
    modal.present();
  }
  //filter={ status:'',mapstatus:''};
  	
  reset(){
  	this.searchObjects.querysearch='';
  }
  /**
   * -------------------------------------------------------------
   * Find Npwpd
   * -------------------------------------------------------------
   */
  findReklame() {
   // let valstatus=this.filter.status;
	let todo={
    	q:(this.searchObjects.querysearch),//=='Reklame di Sekitar Anda'?'':this.searchObjects.originLocationName),
    	arr:JSON.stringify(['mp.npwpd'])
    };
    
    this.loadReklameList(todo);
  }
  
  loadReklameList(todo){
  	console.log(todo); //search.arr defined
  	this.restProvider.postRestAPI(todo,'map/npwpd',true)
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
		    		//isactive:idx,
		    		detail:'FnpwpdPage'
		    		//feeprice:data['feeprice']
		    	}
		    };
		    // variable no map, isactive undefined
		    const modal = this.modalCtrl.create('ReklameListwmapPage',res);
		    modal.present();
      	}else
            this.restProvider.showAlert(data["diagnostic"]["error_msgs"]);
    });
  }

}
