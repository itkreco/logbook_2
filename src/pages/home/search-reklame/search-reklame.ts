/**
 * @author    ThemesBuckets <themebucketbd@gmail.com>
 * @copyright Copyright (c) 2018
 * @license   Fulcrumy
 * 
 * This File Represent Search Component of Hotel
 * File path - '../../../src/pages/hotel/search-reklame/search-reklame'
 */

import { Component } from '@angular/core';
import { IonicPage, //ActionSheetController, //Platform, 
NavController, NavParams, ModalController } from 'ionic-angular';
import { Search } from '../../../models/search';
import { CalendarModal, CalendarModalOptions } from 'ion2-calendar';
import { RestProvider } from '../../../providers/rest/rest';
//import { CurrencyPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
//import { Geolocation } from '@ionic-native/geolocation'; 
//import { GeocoderProvider } from '../../../providers/data/hotel_lib';
//import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-search-reklame',
  templateUrl: 'search-reklame.html',
})
export class SearchReklamePage {
  tabBarElement: any;

  searchObjects: Search = new Search();
  
  defStatus:any;
 // dumStatus:any;
  status = [
    {
      name: 'col1',
      options: []
    }
  ];
  
  defLogStatus = '1';
  logstatus = [
    {
      name: 'col1',
      options: [
        { text: 'Deck Logbook', value: '1' },
        { text: 'Engine Logbook', value: '2' }
      ]
    }
  ];
  
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,  
    public restProvider: RestProvider,
    public datepipe: DatePipe,
  	//private geolocation : Geolocation,
   // public actionsheetCtrl: ActionSheetController,
    public modalCtrl: ModalController) {
      	this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
      //	this.reset();
  }
   
  ngOnInit(){
	this.loadVesselList();
  }

  openCalendar() {

    // Calendar Modal Config Options
    //if()
   // let ppWay=this.searchObjects.tripType!='oneWay';
    const options: CalendarModalOptions = {
      pickMode: 'range',
      color: 'primary',
	  canBackwardsSelected:true
    };

    // Create Calendar Modal
    let myCalendar = this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    // When Calendar Modal Dismiss
    myCalendar.onDidDismiss((date: any, type: string) => {
      if (date) {
        // Set CheckIn Date
        console.log(date);
        this.searchObjects.dstart = date.from.string;
        // Set CheckOut Date
        this.searchObjects.dend = date.to.string;
      }
    })
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
      		this.searchObjects.querysearch = data.name;
	    }
    });
    modal.present();
  }

  onChange(newValue,idx=0) {
  	if(idx==0)
    	this.filter.status=newValue;
    else
    	this.filter.logstatus=newValue;
  }
  
  opsi={
  	isactive:0,
  	label:''
  };
  
  filter={ status:'',logstatus:''};
  	
  reset(){
  	this.filter={ status:'1',logstatus:'1'};
  	this.defStatus=undefined;
  	this.defLogStatus='1';
  	this.searchObjects.originLocationName = 'Batam';
  	this.searchObjects.querysearch='';
    this.searchObjects.lat=1.142753;
    this.searchObjects.lng=104.014004;
    this.searchObjects.dstart=new Date();
    this.searchObjects.dend=new Date();
    //=======test
    //const modal = this.modalCtrl.create('FreklamePage');
	//modal.present();
  }
  /**
   * -------------------------------------------------------------
   * Find Reklame
   * -------------------------------------------------------------
   */
  findReklame(idx=0) {
   // let valstatus=this.filter.status;
    if(this.defStatus!==undefined){
		let todo={
	    /*	q:(this.searchObjects.querysearch),//=='Reklame di Sekitar Anda'?'':this.searchObjects.originLocationName),
	    	status:this.filter.status,
	    	verify:this.filter.mapstatus,*/
			vessel:this.filter.status,
			log:this.filter.logstatus,
	    	//lat:this.searchObjects.lat,
	    	//lng:this.searchObjects.lng
			tglawal:this.datepipe.transform(this.searchObjects.dstart, 'yyyy-MM-dd'),
	      	tglakhir:this.datepipe.transform(this.searchObjects.dend, 'yyyy-MM-dd'),
	    };
	    this.loadReklameList(todo,idx);
	}
	else{
		this.restProvider.showAlert('Pilih nama kapal...');
	}
  }
  
  loadReklameList(todo,idx){
  	console.log(todo);
  	this.restProvider.postRestAPI(todo,'book/list',true)
    .then(result => {
      console.log(result);
      if(result['code']==200&&result['success']==true){
        if(result['data'].indexOf('failed') !== -1) //act
        	this.restProvider.showAlert('Maaf Gagal...');
        else //if(this.restProvider.loggedIn)
        {
        	let res={
		    	list:{
		    		result:result['data'],
		    	//	page:data['pagination'],
		    		search:todo,
		    		isactive:idx,
		    		detail:todo.log==1?'FreklamePage':'FenglogPage',
		    		//feeprice:data['feeprice']
		    	}
		    };
		    
		    const modal = this.modalCtrl.create('ReklameListPage',res);
		    modal.present();
	  	}
      }
      else
      	this.restProvider.showAlert('akses problem');//data["error_msgs"]);
    });
  }

  loadVesselList(){
  	let url='sel/vship_active'; //else url='sel/eng_logbooks';
    this.restProvider.postRestAPI({data:"{\"s\":[\"id\",\"name\"],\"w\":{\"key\":\""+this.restProvider.accessToken+"\"},\"sort\":{\"name\":\"\"}}"},url,false)
	.then(result => {
      console.log(result);
      if(result['code']==200&&result['success']==true){
            let res=result['data']['val'];
			let arr=[];
			for(let i=0;i<res.length;i++){
				arr.push({ text: res[i][1], value: res[i][0] });
			}
			this.status[0].options=arr;
			//this.defStatus=arr[0][0];
			this.reset();
      }
      else
      	this.restProvider.showAlert('akses problem');//data["error_msgs"]);
    });
  }
}
