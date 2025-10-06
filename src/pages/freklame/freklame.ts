import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController,AlertButton,NavParams,ModalController,Platform,ActionSheetController } from 'ionic-angular';

import { FormBuilder, Validators,FormControl } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';

import { Geolocation } from '@ionic-native/geolocation'; 

import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';
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
  selector: 'page-freklame',
  templateUrl: 'freklame.html',
})
export class FreklamePage {

//  @ViewChild(Content) content: Content;
  isTab:boolean=false;
  bReadonly:boolean=true;
  formInput:any=this.formBuilder.group({
    id:[''],
    type_id:[''],
    local_time:[''],
    lat:[''],
    lon:[''],
    dept:[''],
    dept_id:[''],
    cog:[''],
    hdg:[''],
    twd:[''],
    awa:[''],
    voffset:[''],
    vtemp:[''],
    temp_id:[''],
    sog:[''],
    stw:[''],
    tws:[''],
    aws:[''],
    driftage:[''],
    speed_id:[''],
    pressure:[''],
    pressure_id:[''],
    remark:[''],
    wave:[''],
    weather_id:[''],
    sail_id:[''],
    trip_id:[''],
    sail_reef:[''],
    generator:[''],
	speed:[''],
    water:[''],
  //  oil:[''],
  });
  
  data:any={
    id:'',
    type_id:'',  //logbook
    local_time:'', //logbook
    lat:'', //logbook
    lon:'',//logbook
    dept:'',
    dept_id:'',
    cog:'',
    hdg:'',
    twd:'',
    awa:'',
    voffset:'',
    vtemp:'', //logbook
    temp_id:'', //logbook
    sog:'',
    stw:'',
    tws:'',
    aws:'',
    driftage:'',
    speed_id:'', //logbook
    pressure:'', //logbook
    pressure_id:'', //logbook
    remark:'', //logbook *
    wave:'', //logbook *
    weather_id:'', //logbook
    sail_id:'',
    trip_id:'', 
    sail_reef:'',
    generator:'',
	speed:'', //logbook
    water:'', //logbook *
  //  oil:'',
  };

  //type_id,lat,lon,vtemp,pressure,local_time,remark,speed,wave,weather_id,direct_id,trip_id
  mfilter={
    sort:-1
  };

  formRule:any={
      	id:[''],
      	type_id:new FormControl({value: '', disabled: true},Validators.required),
		local_time:new FormControl({value: '', disabled: true},Validators.required),
		lat:new FormControl({value: '', disabled: true},[Validators.required,Validators.minLength(8), Validators.maxLength(10)]),
		lon:new FormControl({value: '', disabled: true},[Validators.required,Validators.minLength(8), Validators.maxLength(10)]),
		dept:[''],
		dept_id:new FormControl({value: '', disabled: true},Validators.required),
		cog:[''],
		hdg:[''],
		twd:[''],
		awa:[''],
		voffset:[''],
		vtemp:[''],
		temp_id:new FormControl({value: '', disabled: true},Validators.required),
		sog:[''],
		stw:[''],
		tws:[''],
		aws:[''],
		driftage:[''],
		speed_id:new FormControl({value: '', disabled: true},Validators.required),
		pressure:[''],
		pressure_id:new FormControl({value: '', disabled: true},Validators.required),
		remark:[''],
		wave:['54',Validators.compose([Validators.required])],
		weather_id:['66',Validators.compose([Validators.required])],
		sail_id:new FormControl({value: '0', disabled: true},Validators.required),
		trip_id:new FormControl({value: '', disabled: true},Validators.required),
		sail_reef:new FormControl({value: '0', disabled: true},Validators.required),
		generator:['0',Validators.compose([Validators.required])],
		speed:[''],
		water:[''],
	//	oil:[''],
  };
  
  //latLngPattern:string = "/^[0-9]+(\.[0-9]{1,6})?$/";
  no_pattern:string ="/([0-9])$/";
  //qrFileName:string;
  fotoFileName:string;
  //maxDate:string;
  
  dtDef:any;
  
  sUrl:string;
  //@ViewChild(DatePickerDirective) private datepickerDirective:DatePickerDirective;
  
  constructor(
  	public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    public modalCtrl:ModalController,
  	private geolocation : Geolocation,
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
		}
  	    
}

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

	  this.loadVesselList(alertButton);
	 /* this.restProvider.getRestAPI('book/vessel',false)
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
	  );*/
  }
  
  loadVesselList(alertButton){
  	let url='sel/vship_active'; 
    this.restProvider.postRestAPI({data:"{\"s\":[\"id\",\"name\"],\"w\":{\"key\":\""+this.restProvider.accessToken+"\"},\"sort\":{\"name\":\"\"}}"},url,false)
	.then(result => {
      console.log(result);
      if(result['code']==200&&result['success']==true){
            let res=result['data']['val'];
			let arr=[];
			for(let i=0;i<res.length;i++){
				arr.push(
					{
					  name:'radioInp',
				      type:'radio',
				      label:res[i][1],
				      value:res[i][0]
				    }
				);
			}
			this.restProvider.showConfirm('Silahkan pilih nama kapal:', alertButton,arr);
      }
      else
      	this.restProvider.showAlert('akses problem');//data["error_msgs"]);
    });
  }

  initConstruct(navList){
	    if(this.restProvider.user['email'].indexOf("pengawas") !== -1){this.bReadonly=true}else{this.bReadonly=false}
		
		this.sUrl=this.restProvider.apiUrl;//.replace(/api/g, "");

		if (navList) {
	        let data=navList;
	    	console.log("data:",data);
			if (!(data[0] === undefined) && data[0].length > 0) {
			      
	    	    let dum=data[0][0];//JSON.parse(data[0]);
	    	    //dum=dum[0];
	        	this.data={
				    id:dum[0],
				    type_id:dum[1],
				    local_time:dum[2],
				    lat:dum[3],
				    lon:dum[4],
				    dept:dum[5],
				    dept_id:dum[6],
				    cog:dum[7],
				    hdg:dum[8],
				    twd:dum[9],
				    awa:dum[10],
				    voffset:dum[11],
				    vtemp:dum[12],
				    temp_id:dum[13],
				    sog:dum[14],
				    stw:dum[15],
				    tws:dum[16],
				    aws:dum[17],
				    driftage:dum[18],
				    speed_id:dum[19],
				    pressure:dum[20],
				    pressure_id:dum[21],
				    remark:dum[22],
				    wave:dum[23],
				    weather_id:dum[24],
				    sail_id:dum[25],
				    trip_id:dum[26],
				    sail_reef:dum[27],
				    generator:dum[28],
					speed:dum[33],
					water:dum[34],
				//	oil:dum[35]
				  };
		    }
		       
	        let ref=data[5];
	        let type=[];
	        let wave=[{name: 'col1',options:[]}];
		    let weather=[{name: 'col1',options:[]}];
	        for(let i = 0;i<ref.length;i++) { 
			   if(ref[i][3]==9)type.push({id:ref[i][0].toString(),ket:ref[i][2]});
			   else if(ref[i][3]==12)wave[0].options.push({text:ref[i][2],value:ref[i][0].toString()});
			   else if(ref[i][3]==14)weather[0].options.push({text:ref[i][2],value:ref[i][0].toString()});
			}
	        
	        this.dtDef={
	        	trip:data[3][0],
	        	def:data[4][0],
	        	type:type,
	        	wave:wave,
	        	weather:weather
	        };
		    
		}
		/*else
		{
			this.selVessel();
		}
		*/
	    console.log("construct data ",this.data," dtdef:",this.dtDef,"readonly:",this.bReadonly,"=>",this.restProvider.user['email']);		
	}
 
	
  positionSubscription:Subscription;
	
  ionViewDidEnter() {
    console.log('ionViewDidLoad FLogbookPage');
    
    if(this.data.id!=='')this.formInput.id=this.data.id;else{
		this.positionSubscription = this.geolocation.watchPosition()
	    .pipe(
	        filter((p) => p.coords !== undefined) //Filter Out Errors
	    )
	    .subscribe(data => {
	        setTimeout(() => {
		      let xpos={ lat: data.coords.latitude, lon: data.coords.longitude };
	          this.formInput.patchValue(xpos);
			  this.formInput.local_time=moment().format("YYYY-MM-DD HH:mm:ss");
			  console.log("update form location...",xpos);
	        }, 100);
	    });
	}
	
    if(this.data.type_id!==''){
		this.formInput.type_id=this.data.type_id;
		this.mfilter.sort=this.data.type_id-28;
	} //else this.mfilter.sort=-1;
    if(this.data.local_time!=='')this.formInput.local_time=this.data.local_time; else this.formInput.local_time=moment().format("YYYY-MM-DD HH:mm:ss");
    if(this.data.lat!=='')this.formInput.lat=this.data.lat;
    if(this.data.lon!=='')this.formInput.lon=this.data.lon;
    if(this.data.dept!=='')this.formInput.dept=this.data.dept;
    if(this.data.dept_id!=='')this.formInput.dept_id=this.data.dept_id;
    if(this.data.cog!=='')this.formInput.cog=this.data.cog;
    if(this.data.hdg!=='')this.formInput.hdg=this.data.hdg;
    if(this.data.twd!=='')this.formInput.twd=this.data.twd;
    if(this.data.awa!=='')this.formInput.awa=this.data.awa;
    if(this.data.voffset!=='')this.formInput.voffset=this.data.voffset;
    if(this.data.vtemp!=='')this.formInput.vtemp=this.data.vtemp;
    if(this.data.temp_id!=='')this.formInput.temp_id=this.data.temp_id;
    if(this.data.sog!=='')this.formInput.sog=this.data.sog;
    if(this.data.stw!=='')this.formInput.stw=this.data.stw;
    if(this.data.tws!=='')this.formInput.tws=this.data.tws;
    if(this.data.aws!=='')this.formInput.aws=this.data.aws;
    if(this.data.driftage!=='')this.formInput.driftage=this.data.driftage;
    if(this.data.speed_id!=='')this.formInput.speed_id=this.data.speed_id;
    if(this.data.pressure!=='')this.formInput.pressure=this.data.pressure;
    if(this.data.pressure_id!=='')this.formInput.pressure_id=this.data.pressure_id;
    if(this.data.remark!=='')this.formInput.remark=this.data.remark;
    if(this.data.wave!=='')this.formInput.wave=this.data.wave;
    if(this.data.weather_id!=='')this.formInput.weather_id=this.data.weather_id;
    if(this.data.sail_id!=='')this.formInput.sail_id=this.data.sail_id;
    if(this.data.trip_id!=='')this.formInput.trip_id=this.data.trip_id; else this.formInput.trip_id=this.dtDef.trip[0].toString();
    if(this.data.sail_reef!=='')this.formInput.sail_reef=this.data.sail_reef;
    if(this.data.generator!=='')this.formInput.generator=this.data.generator;
    if(this.data.speed!=='')this.formInput.speed=this.data.speed;
    if(this.data.water!=='')this.formInput.water=this.data.water;
//    if(this.data.oil!=='')this.formInput.oil=this.data.oil;
    
    
    console.log(this.formInput);
	//this.mfilter.sort=idx;
  }
  
  ngOnInit() {
    	this.formInput = this.formBuilder.group(this.formRule);
		if (this.bReadonly){
			this.formInput.controls['dept'].disable();
			this.formInput.controls['cog'].disable();
			this.formInput.controls['hdg'].disable();
			this.formInput.controls['twd'].disable();
			this.formInput.controls['awa'].disable();
			this.formInput.controls['voffset'].disable();
			this.formInput.controls['vtemp'].disable();
			this.formInput.controls['sog'].disable();
			this.formInput.controls['stw'].disable();
			this.formInput.controls['tws'].disable();
			this.formInput.controls['aws'].disable();
			this.formInput.controls['driftage'].disable();
			this.formInput.controls['pressure'].disable();
			this.formInput.controls['wave'].disable();
			this.formInput.controls['weather_id'].disable();
			this.formInput.controls['generator'].disable();
			this.formInput.controls['speed'].disable();
			this.formInput.controls['water'].disable();
		//	this.formInput.controls['oil'].disable();
			this.formInput.controls['remark'].disable();
		}
  }
  
  formReload(rule,form){
	
	  this.ngZone.run(() => {
		this.formInput = this.formBuilder.group(rule);
		if(this.mfilter.sort>=0){
		  	this.formInput.patchValue(form);
		/*
		Object.keys(this.form.controls).forEach((controlName) => {
        this.form.controls[controlName][state](); // disables/enables each form control based on 'this.formDisabled'
    });*/
		    this.formInput.id=form.id;
		    this.formInput.local_time=form.local_time;
		    this.formInput.lat=form.lat;
		    this.formInput.lon=form.lon;
		    this.formInput.dept=form.dept;
		    this.formInput.dept_id=form.dept_id;
		    this.formInput.cog=form.cog;
		    this.formInput.hdg=form.hdg;
		    this.formInput.twd=form.twd;
		    this.formInput.awa=form.awa;
		    this.formInput.voffset=form.voffset;
		    this.formInput.vtemp=form.vtemp;
		    this.formInput.temp_id=form.temp_id;
		    this.formInput.sog=form.sog;
		    this.formInput.stw=form.stw;
		    this.formInput.tws=form.tws;
		    this.formInput.aws=form.aws;
		    this.formInput.driftage=form.driftage;
		    this.formInput.speed_id=form.speed_id;
		    this.formInput.pressure=form.pressure;
		    this.formInput.pressure_id=form.pressure_id;
		    this.formInput.remark=form.remark;
		    this.formInput.trip_id=form.trip_id;
		    this.formInput.wave=form.wave;
		    this.formInput.weather_id=form.weather_id;
		    this.formInput.sail_id=form.sail_id;
			this.formInput.sail_reef=form.sail_reef;
		   	this.formInput.generator=form.generator;
		   	this.formInput.speed=form.speed;
		   	this.formInput.water=form.water;
		  // 	this.formInput.oil=form.oil;
			console.log("rule n form:",rule,form);
		}
	  });
  }

  formValidation(idx) {
    
    let rule = Object.assign({},this.formRule);
    let data=//this.formInput.value;

{
	    id:this.formInput.id!=undefined?this.formInput.id:null,
	    type_id:this.formInput.type_id!=undefined?this.formInput.type_id:null,
	    local_time:this.formInput.local_time!=undefined?this.formInput.local_time:null,
	    lat:this.formInput.lat!=undefined?this.formInput.lat:null,
	    lon:this.formInput.lon!=undefined?this.formInput.lon:null,
	    dept:this.formInput.dept!=undefined?this.formInput.dept:null,
	    dept_id:this.formInput.dept_id!=undefined?this.formInput.dept_id:null,
	    cog:this.formInput.cog!=undefined?this.formInput.cog:null,
	    hdg:this.formInput.hdg!=undefined?this.formInput.hdg:null,
	    twd:this.formInput.twd!=undefined?this.formInput.twd:null,
	    awa:this.formInput.awa!=undefined?this.formInput.awa:null,
	    voffset:this.formInput.voffset!=undefined?this.formInput.voffset:null,
	    vtemp:this.formInput.vtemp!=undefined?this.formInput.vtemp:null,
	    temp_id:this.formInput.temp_id!=undefined?this.formInput.temp_id:null,
	    sog:this.formInput.sog!=undefined?this.formInput.sog:null,
	    stw:this.formInput.stw!=undefined?this.formInput.stw:null,
	    tws:this.formInput.tws!=undefined?this.formInput.tws:null,
	    aws:this.formInput.aws!=undefined?this.formInput.aws:null,
	    driftage:this.formInput.driftage!=undefined?this.formInput.driftage:null,
	    speed_id:this.formInput.speed_id!=undefined?this.formInput.speed_id:null,
	    pressure:this.formInput.pressure!=undefined?this.formInput.pressure:null,
	    pressure_id:this.formInput.pressure_id!=undefined?this.formInput.pressure_id:null,
	    remark:this.formInput.remark!=undefined?this.formInput.remark:null,
	    wave:this.formInput.wave!=undefined?this.formInput.wave:null,
	    weather_id:this.formInput.weather_id!=undefined?this.formInput.weather_id:null,
	    sail_id:this.formInput.sail_id!=undefined?this.formInput.sail_id:null,
	    trip_id:this.formInput.trip_id!=undefined?this.formInput.trip_id:null,
	    sail_reef:this.formInput.sail_reef!=undefined?this.formInput.sail_reef:null,
	    generator:this.formInput.generator!=undefined?this.formInput.generator:null,
	    speed:this.formInput.speed!=undefined?this.formInput.speed:null,
	    water:this.formInput.water!=undefined?this.formInput.water:null,
	  //  oil:this.formInput.oil!=undefined?this.formInput.oil:null
	};
	
    //let form=this.formInput;
	console.log("idx n data:",idx,data);
	if(idx<5){
		this.formInput.controls['dept'].enable();
		this.formInput.controls['cog'].enable();
		this.formInput.controls['hdg'].enable();
		this.formInput.controls['twd'].enable();
		this.formInput.controls['awa'].enable();
		this.formInput.controls['voffset'].enable();
		this.formInput.controls['vtemp'].enable();
		this.formInput.controls['sog'].enable();
		this.formInput.controls['stw'].enable();
		this.formInput.controls['tws'].enable();
		this.formInput.controls['aws'].enable();
		this.formInput.controls['driftage'].enable();
		this.formInput.controls['pressure'].enable();
		this.formInput.controls['wave'].enable();
		this.formInput.controls['weather_id'].enable();
		this.formInput.controls['generator'].enable();
		this.formInput.controls['speed'].enable();
		this.formInput.controls['water'].enable();
	//	this.formInput.controls['oil'].enable();
		this.formInput.controls['remark'].enable();
		console.log("enable");
	}
 //   if(idx==0){
 //   	this.formReload(rule,data);
 //   }else 
    if(idx<=1) {
    	this.formReload(rule,data);
    	
	    /*this.formInput.sail_id=form.sail_id;
    	this.formInput.sail_reef=form.sail_reef;*/
    	
	    //engine or sail all off
	    this.formInput.sail_id=0;
    	this.formInput.sail_reef=0;
    	this.formInput.generator=0;
    	
    }else if(idx==2){
    	this.formReload(rule,data);
    
    	//engine all on if all status off.   	
    	this.formInput.generator=0;
    }else if(idx==3){ //layar
		rule.sail_id=['0',Validators.compose([Validators.required])];
		rule.sail_reef=['0',Validators.compose([Validators.required])];
		this.formReload(rule,data);
    }else if(idx==4){ //layar n mesin
		rule.sail_id=['0',Validators.compose([Validators.required])];
		rule.sail_reef=['0',Validators.compose([Validators.required])];
		this.formReload(rule,data);
/*    }else if(idx==5){ //layar n mesin
		rule.sail_id=['0',Validators.compose([Validators.required])];
		rule.sail_reef=['0',Validators.compose([Validators.required])];
		this.formReload(rule,data);*/
    }else{
	    
    	rule.dept=new FormControl({value: '', disabled: this.bReadonly});
		rule.cog=new FormControl({value: '', disabled: this.bReadonly});
		rule.hdg=new FormControl({value: '', disabled: this.bReadonly});
		rule.twd=new FormControl({value: '', disabled: this.bReadonly});
		rule.awa=new FormControl({value: '', disabled: this.bReadonly});
		rule.voffset=new FormControl({value: '', disabled: this.bReadonly});
		rule.vtemp=new FormControl({value: '', disabled: this.bReadonly});
		rule.sog=new FormControl({value: '', disabled: this.bReadonly});
		rule.stw=new FormControl({value: '', disabled: this.bReadonly});
		rule.tws=new FormControl({value: '', disabled: this.bReadonly});
		rule.aws=new FormControl({value: '', disabled: this.bReadonly});
		rule.driftage=new FormControl({value: '', disabled: this.bReadonly});
		rule.pressure=new FormControl({value: '', disabled: this.bReadonly});
		rule.wave=new FormControl({value: '54', disabled: this.bReadonly},Validators.required);
		rule.weather_id=new FormControl({value: '66', disabled: this.bReadonly},Validators.required);
		rule.generator=new FormControl({value: '0', disabled: this.bReadonly},Validators.required);
		
		this.formInput.controls['dept'].disable();
		this.formInput.controls['cog'].disable();
		this.formInput.controls['hdg'].disable();
		this.formInput.controls['twd'].disable();
		this.formInput.controls['awa'].disable();
		this.formInput.controls['voffset'].disable();
		this.formInput.controls['vtemp'].disable();
		this.formInput.controls['sog'].disable();
		this.formInput.controls['stw'].disable();
		this.formInput.controls['tws'].disable();
		this.formInput.controls['aws'].disable();
		this.formInput.controls['driftage'].disable();
		this.formInput.controls['pressure'].disable();
		this.formInput.controls['wave'].disable();
		this.formInput.controls['weather_id'].disable();
		this.formInput.controls['generator'].disable();
		this.formInput.controls['speed'].disable();
		this.formInput.controls['water'].disable();
	//	this.formInput.controls['oil'].disable();
		this.formInput.controls['remark'].disable();
		console.log("disable : ",this.bReadonly);
		this.formReload(rule,data);
		
    }

	
    
    this.formInput.type_id=(idx+28).toString();
    this.mfilter.sort=idx;
    console.log("idx ke="+idx,this.formInput);
	this.formInput.updateValueAndValidity();
	//let active = this.navCtrl.getActive(); // or getByIndex(int) if you know it
    //this.navCtrl.remove(active.index);
    //this.navCtrl.push(active.component);
  }
  
  debugForm(){
	//  let rule=this.formRule;
	  this.formInput.controls['aws'].disable();
  	  console.log("formula forminput",this.formInput);
  }
  
  save(){
  	let rtodo={
		u:{
			dept:this.isNum(this.formInput.dept)?Number.parseFloat(this.formInput.dept):null,
			cog:this.isNum(this.formInput.cog)?Number.parseFloat(this.formInput.cog):null,
			hdg:this.isNum(this.formInput.hdg)?Number.parseFloat(this.formInput.hdg):null,
			twd:this.isNum(this.formInput.twd)?Number.parseFloat(this.formInput.twd):null,
			awa:this.isNum(this.formInput.awa)?Number.parseFloat(this.formInput.awa):null,
			voffset:this.isNum(this.formInput.voffset)?Number.parseFloat(this.formInput.voffset):null,
			vtemp:this.isNum(this.formInput.vtemp)?Number.parseFloat(this.formInput.vtemp):null,
			sog:this.isNum(this.formInput.sog)?Number.parseInt(this.formInput.sog):null,
			stw:this.isNum(this.formInput.stw)?Number.parseInt(this.formInput.stw):null,
			tws:this.isNum(this.formInput.tws)?Number.parseFloat(this.formInput.tws):null,
			aws:this.isNum(this.formInput.aws)?Number.parseFloat(this.formInput.aws):null,
			driftage:this.isNum(this.formInput.driftage)?Number.parseFloat(this.formInput.driftage):null,
			pressure:this.isNum(this.formInput.pressure)?Number.parseFloat(this.formInput.pressure):null,
			wave:this.isNum(this.formInput.wave)?Number.parseInt(this.formInput.wave):null,
			weather_id:this.isNum(this.formInput.weather_id)?Number.parseFloat(this.formInput.weather_id):null,
			generator:this.formInput.generator?true:false,
			speed:this.isNum(this.formInput.speed)?Number.parseFloat(this.formInput.speed):null,
			water:this.isNum(this.formInput.water)?Number.parseInt(this.formInput.water):null,
		//	oil:this.formInput.oil,
			remark:this.formInput.remark
		}
	};
	let todo;
	if (this.isNum(this.formInput.id)){
		let wtodo={w:{id:this.formInput.id}};
		todo={...rtodo,...wtodo};
	}else{
		let wu={
			type_id:this.isNum(this.formInput.type_id)?Number.parseInt(this.formInput.type_id):null,
			trip_id:this.isNum(this.formInput.trip_id)?Number.parseInt(this.formInput.trip_id):Number.parseInt(this.dtDef.trip[0]),
			lat:this.isNum(this.formInput.lat)?Number.parseFloat(this.formInput.lat):null,
			lon:this.isNum(this.formInput.lon)?Number.parseFloat(this.formInput.lon):null,
			local_time:this.formInput.local_time
		};
		todo={u:{...rtodo.u,...wu}};
	}
	
  	console.log(JSON.stringify(todo));
    this.restProvider.postRestAPI({data:JSON.stringify(todo)},'save/logbooks',true)
    .then(data => {
    	console.log(data);
	    if(data['code']==200&&data['success']==true){
		/*
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
	      	//console.log(data['data']);
	      //	this.qrFileName=data['param']['qr'];
	      	this.fotoFileName=data['param']['foto'];
	      	this.formInput.id=data['param']['id'];*/
		    this.restProvider.showAlert('Data berhasil disimpan...');
      	}else
            this.restProvider.showAlert('akses problem');
    });
    
    
  }
  /*
  isNum(num){
  	 return num==null||num==''||isNaN(Number(num.toString()))?false:true;
  }*/
  isNum(val): val is string | number {
	  return (
	    !isNaN(Number(Number.parseFloat(String(val)))) &&
	    isFinite(Number(val))
	  );
  }
  
  getLocation() {
    //batam
    let pos={lat:null,lng:null};
    if(this.formInput.id==""||this.formInput.id==undefined||this.formInput.id==null){
		//this.positionSubscription.unsubscribe();
 		this.loadPeta(pos);
	}else if(this.isNum(this.formInput.lat)&&this.isNum(this.formInput.lon)){
 		pos={lat:Number(this.formInput.lat),lng:Number(this.formInput.lon)}; 
	    //this.positionSubscription.unsubscribe();
 		this.loadPeta(pos);
 	}
  	else {
  		this.restProvider.loadingAlert(true,true);
		this.geolocation.getCurrentPosition({
	    	enableHighAccuracy : true
	    }).then((res) => {
	        pos.lat=res.coords.latitude;
		    pos.lng=res.coords.longitude;
			this.restProvider.loadingAlert(false,true);
			this.loadPeta(pos);
	    }).catch((error) => {
	    	this.restProvider.loadingAlert(false,true);
	    	this.restProvider.showAlert(error.GeolocationPositionError.message); 
		  	console.log('Error getting location', error);
		 // 	this.loadPeta(pos);
	    });
  	}
  	  
  }
  
  loadPeta(pos){
  	
    let todo={
	  	fil:"Map",
	  	label:'Lokasi Lat/lon',
	  	koord:pos
	  };
    const modal = this.modalCtrl.create('LocationPage',{list:todo});
    modal.onDidDismiss((data: any) => {
      	if (data!=undefined) {
	        //this.formInput.originLocationName = data.desc;
	        console.log(data);
		//	if(this.formInput.id==""){
				this.positionSubscription.unsubscribe();
				this.formInput.local_time=moment().format("YYYY-MM-DD HH:mm:ss");
		//	}
	        this.formInput.lat=data.pos.lat;
	        this.formInput.lon=data.pos.lng;
	    }
    });
    modal.present();
  }

  
  
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
  }
}
