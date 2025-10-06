/**
 * @author    ThemesBuckets <themebucketbd@gmail.com>
 * @copyright Copyright (c) 2018
 * @license   Fulcrumy
 * 
 * File path - '../../src/pages/home/reklame-listwmap/reklame-listwmap'
 */

import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController,Content } from 'ionic-angular';
import { RestProvider } from '../../../providers/rest/rest';
//map
//import { Geolocation } from '@ionic-native/geolocation'; 
//declare var google: any;

@IonicPage()
@Component({
  selector: 'page-reklame-listwmap',
  templateUrl: 'reklame-listwmap.html',
})
export class ReklameListwmapPage {

  @ViewChild(Content) content: Content;

  reklames: any = [];
  param:any;
  //lib:Lib;
 // sUrl:string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
  	//private geolocation : Geolocation,
  //  public platform: Platform,
   // private zone: NgZone,
   // public actionsheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    //public currencyPipe: CurrencyPipe,
    public restProvider: RestProvider,
    //public dataProvider: DataProvider
    ) { 
        this.param= this.navParams.get('list');
        //console.log(Math.sin(20));
        console.log(this.param);
    	//this.responseObj.address=this.param.search.q;
    //	this.lib=new Lib(this.param.feeprice);
    }

  /** Do any initialization */
  ngOnInit() {
     
  }
  
  ngAfterViewInit() {
    this.getReklameList();
  }

  /**
   * -----------------------------------------------------------
   * Get List of Reklame
   * -----------------------------------------------------------
   * From Data Provider Service Call `getreklames` method that Give You List of Reklame
   * 
   * You get `DataProvider` Service at - 'src/providers/data/data';
   */
  getReklameList() {
    this.reklames = JSON.parse(JSON.stringify(this.param.result));
    console.log('reklames:',this.reklames);
  }

  /**
   * Open Reklame Details Page
   */
  viewDetails(idx) {
    let formDetail=this.param.detail;
    let todo={
    	id:this.reklames[idx].npwpd,
    	type:'npwpd'
    };
    this.restProvider.postRestAPI(todo,'map/detail',true)
    .then(data => {
    	console.log(data);
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
		    	list:data['data'][0]
		    };
		    
		    const modal = this.modalCtrl.create(formDetail,res);
		    modal.present();
      	}else
            this.restProvider.showAlert(data["diagnostic"]["error_msgs"]);
    });
  }

  /**
   * Dismiss function
   * This function dismiss the popup modal
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  /**
   * --------------------------------------------------------------
   * Load Google Map
   * --------------------------------------------------------------
   */
  
   reklameMap:any={
		idx:0,
		km:0,
		npwpd:'npwd',
		name:'name',
		photo_primary:'foto',
		desc:'desc',
	  	address:'alamat_tiang',
		kode:'kode',
		status:'exp_status',
		no_daftar:'no_daftar',
		id_tiang:'id_tiang',
		ukuran:0
  };
}
