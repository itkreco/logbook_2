import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController,NavParams,ModalController,Platform } from 'ionic-angular';

import { FormBuilder, //Validators,
FormControl} from '@angular/forms';

/**
 * Generated class for the FnpwpdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fnpwpd',
  templateUrl: 'fnpwpd.html',
})
export class FnpwpdPage {

  
  formInput:any=this.formBuilder.group({
    npwpd:[''],
    nama_wp:[''],
    alamat:['']
  });
  
  data:any={
    npwpd:'',
    nama_wp:'',
    alamat:''
  };
  
 // sUrl:string;
  //@ViewChild(DatePickerDirective) private datepickerDirective:DatePickerDirective;
  
  constructor(
  	public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    public modalCtrl:ModalController,
  	public viewCtrl:ViewController,
  	//private geolocation : Geolocation,
    //public restProvider:RestProvider, 
    public platform: Platform,
    //public keyboard : Keyboard, 
   // public datePicker : DatePicker,
  	public navParams: NavParams) {
  	 	
  		//this.sUrl=this.restProvider.apiUrl.replace(/api/g, "");
  		//let current_datetime = new Date()
		//this.maxDate = (current_datetime.getFullYear()+1) + "/" + (current_datetime.getMonth() + 1) + "/" + current_datetime.getDate()
  		//console.log(this.maxDate);
  		if (navParams.get('list')) {
	        let data=navParams.get('list');
	    	console.log(data);
	    	if(data.npwpd!==undefined){
	        	this.data={
				    npwpd:data.npwpd,
				    nama_wp:data.nama_wp,
				    alamat:data.alamat
				  };
	        }
	    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FmapPage');
    if(this.data.npwpd!=='')this.formInput.npwpd=this.data.npwpd;
    if(this.data.alamat!=='')this.formInput.alamat=this.data.alamat;
    if(this.data.nama_wp!=='')this.formInput.nama_wp=this.data.nama_wp;
    
    console.log(this.formInput);
  }
  
  
  ngOnInit() {
    this.formValidation();
  }
  
  formValidation() {
    this.formInput = this.formBuilder.group({
     // id:[''],
      npwpd: new FormControl({value: '', disabled: true}),
      nama_wp: new FormControl({value: '', disabled: true}),
      alamat:new FormControl({value: '', disabled: true})
    });
    
    console.log(this.formInput);
  }
  
  close() {
	 this.viewCtrl.dismiss();
  }  

}
