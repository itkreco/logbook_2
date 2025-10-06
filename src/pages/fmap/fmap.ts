import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';

import { FormBuilder, Validators,FormControl } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { Geolocation } from '@ionic-native/geolocation'; 

/**
 * Generated class for the FmapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fmap',
  templateUrl: 'fmap.html',
})
export class FmapPage {

  formInput:any=this.formBuilder.group({
    id:[''],
    water:[''],
    oil:[''],
    name:[''],
    description:[''],
   // vdate:[''],
    lat:[''],
    lng:[''],
    suhu:[''],
    tekanan:[''],
    speed:[''],
	time:[''],
    foto:[''],
  });
  
  data:any={
  	id:'',
    npwpd:'',
    id_tiang:'',
    no_daftar:'',
    name:'',
    description:'',
   // vdate:'',
    lat:'',
    lng:'',
    location_status:'',
    foto:'',
  };
  
  
  //latLngPattern:string = "/^[0-9]+(\.[0-9]{1,6})?$/";
  no_pattern:string ="/([0-9])$/";
  qrFileName:string;
  	
  locstatus = [
    {
      name: 'col1',
      options: [
        { text: 'Tidak Aktif', value: '0' },
        { text: 'Aktif', value: '1' },
        { text: 'Bongkar', value: '2' },
        { text: 'Masa Perpanjangan', value: '3' },
        { text: 'Fasum/Fasos', value: '4' }
      ]
    }
  ];
  
  
  sUrl:string;

  constructor(
  	public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    public modalCtrl:ModalController,
  	private geolocation : Geolocation,
  	private zone : NgZone,
    public restProvider:RestProvider,
  	public navParams: NavParams) {
  	 	
  		this.sUrl=this.restProvider.apiUrl.replace(/api/g, "");
  		if (navParams.get('list')) {
	        let data=navParams.get('list');
	    	console.log(data);
	    	if(data.id!==undefined){
	        	this.data={
				  	id:data.id,
				    npwpd:data.npwpd,
				    id_tiang:data.id_tiang,
				    no_daftar:data.no_daftar,
				    name:data.name,
				    description:data.description,
				//    vdate:data.vdate,
				    lat:data.lat,
				    lng:data.lng,
				    location_status:data.location_status,
				    foto:data.foto,
				  };
	        	this.qSearch=data.npwpd;
	        		
	        	if(data.qr!=='')this.qrFileName=data.qr;
	        }
	    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FmapPage');
    if(this.data.id!=='')this.formInput.id=this.data.id;
    if(this.data.npwpd!=='')this.formInput.npwpd=this.data.npwpd;
    if(this.data.id_tiang!=='')this.formInput.id_tiang=this.data.id_tiang;
    if(this.data.no_daftar!=='')this.formInput.no_daftar=this.data.no_daftar;
    if(this.data.description!=='')this.formInput.description=this.data.description;
    if(this.data.name!=='')this.formInput.name=this.data.name;
   // if(this.data.vdate!=='')this.formInput.vdate=this.data.vdate;
    if(this.data.lat!=='')this.formInput.lat=this.data.lat;
    if(this.data.lng!=='')this.formInput.lng=this.data.lng;
    if(this.data.location_status!=='')this.formInput.location_status=this.data.location_status;
    if(this.data.foto!=='')this.formInput.foto=this.data.foto;
    
    
    
    console.log(this.formInput);
  }
  
  isNum(num){
  	 return num==null||num==''?false:true;
  }
  
  getLocation() {
    //batam
    let pos={lat:1.142753,lng:104.014004};
    
    if(this.isNum(this.formInput.lat)&&this.isNum(this.formInput.lng)){
 		pos={lat:Number(this.formInput.lat),lng:Number(this.formInput.lng)}; 
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
		  	this.loadPeta(pos);
	    });
  	}
  	  
  }
  
  loadPeta(pos){
  	
    let todo={
	  	fil:"Map",
	  	label:'Lokasi Lat/Lng',
	  	koord:pos
	  };
    const modal = this.modalCtrl.create('LocationPage',{list:todo});
    modal.onDidDismiss((data: any) => {
      	if (data!=undefined) {
	        //this.formInput.originLocationName = data.desc;
	        console.log(data);
	        this.formInput.lat=data.pos.lat;
	        this.formInput.lng=data.pos.lng;
	    }
    });
    modal.present();
  }
  
  presentCamera() {
    const modal = this.modalCtrl.create('FotoPage');
    modal.onDidDismiss((data: any) => {
      	if (data!=undefined) {
		    this.formInput.foto=data.foto;
	    }
    });
    modal.present();
  }
  
  ngOnInit() {
    this.formValidation();
  }
  
  formValidation() {
    this.formInput = this.formBuilder.group({
      id:[''],
      npwpd: ['',Validators.compose([
      	Validators.required,
      //	Validators.pattern(this.no_pattern),
      	Validators.minLength(9), Validators.maxLength(9)
      ])],
      id_tiang:['',Validators.compose([
      	Validators.required,
      //	Validators.pattern("/^T[0-9]{3}$/i"),
      	Validators.minLength(4), Validators.maxLength(4)
      ])],
	  no_daftar: ['', Validators.compose([
	  	Validators.required,
	  //	Validators.pattern(this.no_pattern),
	  	Validators.minLength(11), Validators.maxLength(11)
	  ])],
      name: ['',Validators.compose([
      	Validators.required,
     // 	Validators.pattern('[a-zA-Z]')
      ])],
      description:[''],
/*	  vdate: ['', Validators.compose([
	  	Validators.required
	  ])],
  */    lat:['',Validators.compose([
      	Validators.required,
     // 	Validators.pattern(this.latLngPattern),
      	Validators.minLength(8), Validators.maxLength(10)
      ])],
	  lng: ['', Validators.compose([
	  	Validators.required,
	  //	Validators.pattern(this.latLngPattern),
      	Validators.minLength(8), Validators.maxLength(10)
	  ])],
      location_status:['',Validators.compose([
      	Validators.required
      ])],
	  foto: new FormControl({value: '', disabled: true},
	  	Validators.required
	  ),
    });
    
    console.log(this.formInput);
  }
  
  save(){
  	let todo={
	    id:this.formInput.id,
	    npwpd:this.formInput.npwpd,
	    id_tiang:this.formInput.id_tiang,
	    no_daftar:this.formInput.no_daftar,
	    name:this.formInput.name,
	    description:this.formInput.description,
	  //  vdate:this.formInput.vdate,
	    lat:this.formInput.lat,
	    lng:this.formInput.lng,
	    location_status:this.formInput.location_status,
	    foto:this.formInput.foto
	};
	
  	console.log(todo);
    this.restProvider.postRestAPI(todo,'map/simpan',true)
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
	      	//console.log(data['data']);
	      	this.qrFileName=data['param']['qr'];
	      	this.formInput.id=data['param']['id'];
		    //this.restProvider.showAlert('Data berhasil disimpan...');
      	}else
            this.restProvider.showAlert(data["diagnostic"]["error_msgs"]);
    });
  }
  
  qSearch:string;
  arrSearch:any;
  searchValid:boolean=true;
  txtValid:string;
  
  getNpwpd(lbl,type) {
    let todo={
	  	fil:type,
	  	label:lbl,
	  	arr:["rk.npwpd","rk.id_tiang","rk.nodaftar","rk.wpnama","rk.alamat","rk.lokasi"]
	  };
    const modal = this.modalCtrl.create('LocationPage',{list:todo});
    modal.onDidDismiss((data: any) => {
      	if (data!=undefined) {
	    	this.formInput.npwpd=data.name;
		    this.zone.run(() => {
	    		this.qSearch = data.name;
	    		this.arrSearch=data.location.split(',');
	    		console.log(this.arrSearch);
	    		if(this.arrSearch[0]!=this.formInput.id||this.arrSearch[1]!=this.formInput.no_daftar){
	    			this.txtValid='id tiang:'+this.arrSearch[0]+'('+this.formInput.id+'), no daftar: '+this.arrSearch[1];
	    			this.searchValid=false;
	    		}
	    		else this.searchValid=true;
	    		
	    		//this.fotoFileName=data.alpha3Code;
		    });
	    }
    });
    modal.present();
  }

}
