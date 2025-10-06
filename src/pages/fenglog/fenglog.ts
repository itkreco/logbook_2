import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController,//AlertButton,
NavParams,ModalController,Platform,ActionSheetController } from 'ionic-angular';

import { FormBuilder, Validators,FormControl } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';

//import { Geolocation } from '@ionic-native/geolocation'; 

import { Subscription } from 'rxjs/Subscription';
//import { filter } from 'rxjs/operators';
//import { CalendarModal, CalendarModalOptions } from 'ion2-calendar';
//import { Keyboard } from '@ionic-native/keyboard';

import * as moment from 'moment';

//import { DatePickerDirective } from 'ion-datepicker';

 //  @ViewChild(DatePickerDirective) 

/**
 * Generated class for the FreklamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-fenglog',
  templateUrl: 'fenglog.html',
})
export class FenglogPage {

//  @ViewChild(Content) content: Content;
  isTab:boolean=false;
  bReadonly:boolean=true;
  formInput:any=this.formBuilder.group({
    id:[''],
 //   type_id:[''],
    local_time:[''],
    main_hour:[''],
 //   sea_deg:[''],
 //   deg_id:[''],
    remark:[''],
 //   gen_hour:[''],
    trip_id:[''],
 /*   gen_press:[''],
    gen_water_deg:[''],
    gen_volt:[''],
    gen_current:['']*/
	main_eng_start:[''],
	main_eng_stop:[''],
	batt_eng_sebelum:[''],
	batt_eng_sesudah:[''],
	batt_charge_sebelum:[''],
	batt_charge_sesudah:[''],
	energy:[''],
	token_sebelum:[''],
	token_sesudah:[''],
	jam_genset_start:[''],
	jam_genset_stop:[''],
  });
  
  data:any={
    id:'',
  //  type_id:'',  //logbook
    local_time:'', //logbook
    main_hour:'',
 //   sea_deg:'',
 //   deg_id:'',
    remark:'',
 //   gen_hour:'',
    trip_id:'',
  /*  gen_press:'',
    gen_water_deg:'',
    gen_volt:'',
    gen_current:''*/
	main_eng_start:'',
	main_eng_stop:'',
	batt_eng_sebelum:'',
	batt_eng_sesudah:'',
	batt_charge_sebelum:'',
	batt_charge_sesudah:'',
	energy:'',
	token_sebelum:'',
	token_sesudah:'',
	jam_genset_start:'',
	jam_genset_stop:'',
  };

  //type_id,lat,lon,vtemp,pressure,local_time,remark,speed,wave,weather_id,direct_id,trip_id
/*  mfilter={
    sort:-1
  };*/

  formRule:any={
      	id:[''],
    //  	type_id:new FormControl({value: '', disabled: true},Validators.required),
		local_time:new FormControl({value: '', disabled: true},Validators.required),
		main_hour:[''],
	//    sea_deg:[''],
	//    deg_id:new FormControl({value: '', disabled: true},Validators.required),
	    remark:[''],
	 //   gen_hour:[''],
	    trip_id:new FormControl({value: '', disabled: true},Validators.required),
	/*    gen_press:[''],
	    gen_water_deg:[''],
	    gen_volt:[''],
	    gen_current:[''],*/
		//oil:['']

		main_eng_start:[''],
		main_eng_stop:[''],
		batt_eng_sebelum:[''],
		batt_eng_sesudah:[''],
		batt_charge_sebelum:[''],
		batt_charge_sesudah:[''],
		energy:[''],
		token_sebelum:[''],
		token_sesudah:[''],
		jam_genset_start:[''],
		jam_genset_stop:[''],
  };
  
  //latLngPattern:string = "/^[0-9]+(\.[0-9]{1,6})?$/";
  no_pattern:string ="/([0-9])$/";
  //qrFileName:string;
  fotoFileName:string;
  //maxDate:string;
  idtrip;
  //dtDef:any;
  
 // sUrl:string;
  //@ViewChild(DatePickerDirective) private datepickerDirective:DatePickerDirective;
  
  constructor(
  	public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    public modalCtrl:ModalController,
  	//private geolocation : Geolocation,
  	private ngZone : NgZone,
    public restProvider:RestProvider, 
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
   //public keyboard : Keyboard, 
   // public datePicker : DatePicker,
  	public navParams: NavParams) {
		if(this.restProvider.user==null){
			let modal=this.modalCtrl.create('SignInPopPage');
        	/*modal.onDidDismiss(() => {
			    this.selVessel();
			});*/
	  		modal.present();
		}else{
			this.initConstruct(navParams.get('list'));
			this.idtrip=navParams.get('trip_id');
		}
}
/*
  selVessel(){
	  this.isTab=true;
	  let alertButton:AlertButton={
		    text: 'proses',
		    handler: data => {
			   if(data>=1){
			      this.viewDetails(data.toString());
			   }else{ 
			      this.restProvider.showAlert('Pilihlah nama kapal!');
				  return false;
			   } 
		    }
	  };

	  this.restProvider.getRestAPI('book/vessel',false)
	    .then(result => {
	      console.log(result);
	      if(result['code']==200&&result['success']==true){
	        if(result['data'].indexOf('failed') !== -1) //act
	        	this.restProvider.showAlert('Maaf Gagal...');
	        else //if(this.restProvider.loggedIn)
	        {
	        	let res=result['data'];
	            let arr=[];
				for(let i=0;i<res.length;i++){
					arr.push(
						{
						  name:'radioInp',
					      type:'radio',
					      label:'Gandha '+res[i][0],
					      value:res[i][0]
					    }
					);
				}
				this.restProvider.showConfirm('Silahkan pilih nama kapal:', alertButton,arr);
		  	}
	      }
	      else
	      	this.restProvider.showAlert('akses problem');//data["error_msgs"]);
	    }
	  );
  }
*/
  initConstruct(navList){
	    if(this.restProvider.user['email'].indexOf("pengawas") !== -1){this.bReadonly=true}else{this.bReadonly=false}
		
	//	this.sUrl=this.restProvider.apiUrl;//.replace(/api/g, "");

		if (navList) {
	        let data=navList;
	    	console.log("data:",data);
			if (!(data[0] === undefined) && data[0].length > 0) {
			      
	    	    let dum=data[0];//JSON.parse(data[0]);
	    	    //dum=dum[0];
	        	this.data={
		            id:dum[0],
			//	    type_id:dum[1],  //logbook
				    local_time:dum[2], //logbook
				    main_hour:dum[3],
				//    sea_deg:dum[4],
				//    deg_id:dum[5],
				    remark:dum[6],
				//    gen_hour:dum[7],
				    trip_id:this.idtrip,
				/*    gen_press:dum[9],
				    gen_water_deg:dum[10],
				    gen_volt:dum[11],
				    gen_current:dum[12]*/
				//	oil:dum[35]

					main_eng_start:dum[13],
					main_eng_stop:dum[14],
					batt_eng_sebelum:dum[15],
					batt_eng_sesudah:dum[16],
					batt_charge_sebelum:dum[17],
					batt_charge_sesudah:dum[18],
					energy:dum[19],
					token_sebelum:dum[20],
					token_sesudah:dum[21],
					jam_genset_start:dum[22],
					jam_genset_stop:dum[23],
				  };
		    }
		}
		/*else
		{
			this.selVessel();
		}
		*/
	   // console.log("construct data ",this.data," dtdef:",this.dtDef,"readonly:",this.bReadonly,"=>",this.restProvider.user['email']);		
	}
 
	
  positionSubscription:Subscription;
	
  ionViewDidEnter() {
    console.log('ionViewDidLoad FLogbookPage');
    
    if(this.data.id!=='')this.formInput.id=this.data.id;
	
    if(this.data.local_time!=='')this.formInput.local_time=this.data.local_time; else this.formInput.local_time=moment().format("YYYY-MM-DD HH:mm:ss");
   
    if(this.data.remark!=='')this.formInput.remark=this.data.remark;

    if(this.data.trip_id!=='')this.formInput.trip_id=this.data.trip_id; else this.formInput.trip_id=this.idtrip.toString();
    if(this.data.main_hour!=='')this.formInput.main_hour=this.data.main_hour;
   // if(this.data.sea_deg!=='')this.formInput.sea_deg=this.data.sea_deg;
  //  if(this.data.gen_hour!=='')this.formInput.gen_hour=this.data.gen_hour;
//    if(this.data.water!=='')this.formInput.water=this.data.water;
//    if(this.data.oil!=='')this.formInput.oil=this.data.oil;
					
	if(this.data.main_eng_start!=='')this.formInput.main_eng_start=this.data.main_eng_start;
	if(this.data.main_eng_stop!=='')this.formInput.main_eng_stop=this.data.main_eng_stop;
	if(this.data.batt_eng_sebelum!=='')this.formInput.batt_eng_sebelum=this.data.batt_eng_sebelum;
	if(this.data.batt_eng_sesudah!=='')this.formInput.batt_eng_sesudah=this.data.batt_eng_sesudah;
	if(this.data.batt_charge_sebelum!=='')this.formInput.batt_charge_sebelum=this.data.batt_charge_sebelum;
	if(this.data.batt_charge_sesudah!=='')this.formInput.batt_charge_sesudah=this.data.batt_charge_sesudah;
	if(this.data.energy!=='')this.formInput.energy=this.data.energy;
	if(this.data.token_sebelum!=='')this.formInput.token_sebelum=this.data.token_sebelum;
	if(this.data.token_sesudah!=='')this.formInput.token_sesudah=this.data.token_sesudah;
	if(this.data.jam_genset_start!=='')this.formInput.jam_genset_start=this.data.jam_genset_start;
	if(this.data.jam_genset_stop!=='')this.formInput.jam_genset_stop=this.data.jam_genset_stop;
    
    console.log(this.formInput);
	//this.mfilter.sort=idx;
  }
  
  ngOnInit() {
    	this.formInput = this.formBuilder.group(this.formRule);
		if (this.bReadonly){
			this.formInput.controls['jam_genset_stop'].disable();
			this.formInput.controls['remark'].disable();
		/*	this.formInput.controls['gen_hour'].disable();
			this.formInput.controls['gen_press'].disable();
			this.formInput.controls['gen_water'].disable();
			this.formInput.controls['gen_volt'].disable();
			this.formInput.controls['gen_current'].disable();*/
		//	this.formInput.controls['oil'].disable();

			this.formInput.controls['main_eng_start'].disable();
		    this.formInput.controls['main_eng_stop'].disable();
			this.formInput.controls['batt_eng_sebelum'].disable();
			this.formInput.controls['batt_eng_sesudah'].disable();
			this.formInput.controls['batt_charge_sebelum'].disable();
			this.formInput.controls['batt_charge_sesudah'].disable();
			this.formInput.controls['energy'].disable();
			this.formInput.controls['token_sebelum'].disable();
			this.formInput.controls['token_sesudah'].disable();
			this.formInput.controls['jam_genset_start'].disable();
			this.formInput.controls['jam_genset_stop'].disable();
		}
  }
  
  formReload(rule,form){
	
	  this.ngZone.run(() => {
		this.formInput = this.formBuilder.group(rule);
		//if(this.mfilter.sort>=0){
		  	this.formInput.patchValue(form);
		/*
		Object.keys(this.form.controls).forEach((controlName) => {
        this.form.controls[controlName][state](); // disables/enables each form control based on 'this.formDisabled'
    });*/
		    this.formInput.id=form.id;
		    this.formInput.local_time=form.local_time;
			this.formInput.main_hour=form.main_hour;
			this.formInput.remark=form.remark;
		    this.formInput.trip_id=form.trip_id;
		//    this.formInput.type_id=form.type_id;
		/*	this.formInput.gen_hour=form.gen_hour;
			this.formInput.gen_press=form.gen_press;
			this.formInput.gen_water=form.gen_water;
			this.formInput.gen_volt=form.gen_volt;
			this.formInput.gen_current=form.gen_current;*/
			// 	this.formInput.oil=form.oil;

			this.formInput.main_eng_start=form.main_eng_start;
			this.formInput.main_eng_stop=form.main_eng_stop;
			this.formInput.batt_eng_sebelum=form.batt_eng_sebelum;
			this.formInput.batt_eng_sesudah=form.batt_eng_sesudah;
			this.formInput.batt_charge_sebelum=form.batt_charge_sebelum;
			this.formInput.batt_charge_sesudah=form.batt_charge_sesudah;
			this.formInput.energy=form.energy;
			this.formInput.token_sebelum=form.token_sebelum;
			this.formInput.token_sesudah=form.token_sesudah;
			this.formInput.jam_genset_start=form.jam_genset_start;
			this.formInput.jam_genset_stop=form.jam_genset_stop;
			
			console.log("rule n form:",rule,form);
		//}
	  });
  }

  formValidation() {
    
    let rule = Object.assign({},this.formRule);
    let data={
	    id:this.formInput.id!=undefined?this.formInput.id:null,
	//    type_id:this.formInput.type_id!=undefined?this.formInput.type_id:null,
	    local_time:this.formInput.local_time!=undefined?this.formInput.local_time:null,
		main_hour:this.formInput.main_hour!=undefined?this.formInput.main_hour:null,
		remark:this.formInput.remark!=undefined?this.formInput.remark:null,
		trip_id:this.formInput.trip_id!=undefined?this.formInput.trip_id:this.idtrip,
	/*	gen_hour:this.formInput.gen_hour!=undefined?this.formInput.gen_hour:null,
		gen_press:this.formInput.gen_press!=undefined?this.formInput.gen_press:null,
		gen_water:this.formInput.gen_water!=undefined?this.formInput.gen_water:null,
		gen_volt:this.formInput.gen_volt!=undefined?this.formInput.gen_volt:null,
		gen_current:this.formInput.gen_current!=undefined?this.formInput.gen_current:null,
	  //  oil:this.formInput.oil!=undefined?this.formInput.oil:null*/
		main_eng_start:this.formInput.main_eng_start!=undefined?this.formInput.main_eng_start:null,
	    main_eng_stop:this.formInput.main_eng_stop!=undefined?this.formInput.main_eng_stop:null,
		batt_eng_sebelum:this.formInput.batt_eng_sebelum!=undefined?this.formInput.batt_eng_sebelum:null,
		batt_eng_sesudah:this.formInput.batt_eng_sesudah!=undefined?this.formInput.batt_eng_sesudah:null,
		batt_charge_sebelum:this.formInput.batt_charge_sebelum!=undefined?this.formInput.batt_charge_sebelum:null,
		batt_charge_sesudah:this.formInput.batt_charge_sesudah!=undefined?this.formInput.batt_charge_sesudah:null,
		energy:this.formInput.energy!=undefined?this.formInput.energy:null,
		token_sebelum:this.formInput.token_sebelum!=undefined?this.formInput.token_sebelum:null,
		token_sesudah:this.formInput.token_sesudah!=undefined?this.formInput.token_sesudah:null,
		jam_genset_start:this.formInput.jam_genset_start!=undefined?this.formInput.jam_genset_start:null,
		jam_genset_stop:this.formInput.jam_genset_stop!=undefined?this.formInput.jam_genset_stop:null,

	};
	
    //let form=this.formInput;
	console.log("data:",data);
//	if(idx<5){
		this.formInput.controls['main_hour'].enable();
		this.formInput.controls['remark'].enable();
	/*	this.formInput.controls['gen_hour'].enable();
		this.formInput.controls['gen_press'].enable();
		this.formInput.controls['gen_water'].enable();
		this.formInput.controls['gen_volt'].enable();
		this.formInput.controls['gen_current'].enable();*/
	//	this.formInput.controls['oil'].enable();
		this.formInput.controls['main_eng_start'].enable();
		this.formInput.controls['main_eng_stop'].enable();
		this.formInput.controls['batt_eng_sebelum'].enable();
		this.formInput.controls['batt_eng_sesudah'].enable();
		this.formInput.controls['batt_charge_sebelum'].enable();
		this.formInput.controls['batt_charge_sesudah'].enable();
		this.formInput.controls['energy'].enable();
		this.formInput.controls['token_sebelum'].enable();
		this.formInput.controls['token_sesudah'].enable();
		this.formInput.controls['jam_genset_start'].enable();
		this.formInput.controls['jam_genset_stop'].enable();
		console.log("enable");
	
	    
    //	rule.dept=new FormControl({value: '', disabled: this.bReadonly});
		
	//	this.formInput.controls['dept'].disable();
		console.log("disable : ",this.bReadonly);
		this.formReload(rule,data);
  }
  
  debugForm(){
	//  let rule=this.formRule;
	 // this.formInput.controls['aws'].disable();
  	  console.log("formula forminput",this.formInput);
  }
  
  save(){
  	let rtodo={
		u:{
			main_hour:this.isNum(this.formInput.main_hour)?Number.parseInt(this.formInput.main_hour):null,
		//	oil:this.formInput.oil,
			remark:this.formInput.remark,
			
			main_eng_start:this.formInput.main_eng_start,
			main_eng_stop:this.formInput.main_eng_stop,
			batt_eng_sebelum:this.isNum(this.formInput.batt_eng_sebelum)?Number.parseFloat(this.formInput.batt_eng_sebelum):null,
			batt_eng_sesudah:this.isNum(this.formInput.batt_eng_sesudah)?Number.parseFloat(this.formInput.batt_eng_sesudah):null,
			batt_charge_sebelum:this.isNum(this.formInput.batt_charge_sebelum)?Number.parseFloat(this.formInput.batt_charge_sebelum):null,
			batt_charge_sesudah:this.isNum(this.formInput.batt_charge_sesudah)?Number.parseFloat(this.formInput.batt_charge_sesudah):null,
			energy:this.isNum(this.formInput.energy)?Number.parseFloat(this.formInput.energy):null,
			token_sebelum:this.isNum(this.formInput.token_sebelum)?Number.parseFloat(this.formInput.token_sebelum):null,
			token_sesudah:this.isNum(this.formInput.token_sesudah)?Number.parseFloat(this.formInput.token_sesudah):null,
			jam_genset_start:this.formInput.jam_genset_start,
			jam_genset_stop:this.formInput.jam_genset_stop

		}
	};
	let todo;
	if (this.isNum(this.formInput.id)){
		let wtodo={w:{id:this.formInput.id}};
		todo={...rtodo,...wtodo};
	}else{
		let wu={
			trip_id:this.isNum(this.formInput.trip_id)?Number.parseInt(this.formInput.trip_id):this.idtrip,
			local_time:this.formInput.local_time
		};
		todo={u:{...rtodo.u,...wu}};
	}
	
  	console.log(JSON.stringify(todo));
    this.restProvider.postRestAPI({data:JSON.stringify(todo)},'save/eng_logbooks',true)
    .then(data => {
    	console.log(data);
	    if(data['code']==200&&data['success']==true){
			if(data['data'].indexOf('failed') !== -1) //act
	        	this.restProvider.showAlert(data['data']);
	        else
				this.restProvider.showAlert('Data berhasil disimpan...');
      	}else
            this.restProvider.showAlert('akses problem');
    });
    
  }

  isNum(val): val is string | number {
	  return (
	    !isNaN(Number(Number.parseFloat(String(val)))) &&
	    isFinite(Number(val))
	  );
  }
  
  /*
  openSort() {
	if(this.dtDef!==undefined){
	    let icon="checkmark";
	    let iconClass="actionSheet_withIcomoon";
	    let btn=[];
	    
	    for(let i=0;i<this.dtDef.type.length;i++){
	    	btn.push({
	          text: this.dtDef.type[i].ket,
	          icon:this.mfilter.sort==i?icon:"",
	          cssClass: this.mfilter.sort==i?iconClass:"",
	          handler: () => {
	          	this.formValidation(i);
	          }
	        });
	    }
	    
	    btn.push({
	    	  text: 'Cancel',
	          role: 'cancel', // will always sort to be on the bottom
	          icon: !this.platform.is('ios') ? 'close' : null,
	          handler: () => {
	            console.log('Cancel clicked');
	          }
	    });
	    
	    const actionSheet = this.actionsheetCtrl.create({
	      title: 'Pilih Type',
	      cssClass: 'sort',
	      buttons: btn
	    });
	    
	    actionSheet.present();
    }else{
		this.selVessel();
	}
  }

   viewDetails(vessel) {
   // let formDetail=this.param.detail;
    let todo=["0",vessel];
   
    this.restProvider.postRestAPI(todo,'book/det',true)
    
    .then(result => {
      console.log(result);
      if(result['code']==200&&result['success']==true){
        if(result['data'].indexOf('failed') !== -1) //act
        	this.restProvider.showAlert(result['data']);
        else 
        {
            this.initConstruct(result['data']);
	  	}
      }
      else
      	this.restProvider.showAlert('akses problem');//data["error_msgs"]);
    });
  }*/
}
