import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';

import { LoadingController,AlertController,Events, Platform,ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';


@Injectable()
export class RestProvider {

  accessToken: string;
  user: any=null;
  loggedIn: boolean;
  //headers:any;
  
  devmobile:any={
	  name:  "",
	  osVersion: "",
	  uuid: ""
  };
  
  tool='SimrekDroid7';
  //apiUrl = "http://ganussatu.local:2000";
  //apiUrl = "https://api.shiranti.co.id:2000";
  //apiUrl = "http://127.0.0.1:2000";
  //apiUrl = "https://ykadonline.com:2000";
  apiUrl = "http://10.8.0.1";//"http://122.200.149.185";
  //apiUrl = "https://103.101.239.76:2003/api";
  
  constructor(
    //public http: HttpClient, 
    public http: HTTP,
  //	private transfer: FileTransfer,
    public alertCtrl: AlertController,
    private storage: Storage,
    public events: Events,
	private device: Device,
	private platform: Platform,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController) {
    	this.storage.get('profile').then(user => this.user = user);
	    this.storage.get('access_token').then(token => this.accessToken = token);
	    this.storage.get('expires_at').then(
	    	exp => {
	        	this.loggedIn = Date.now() < JSON.parse(exp);
		       	console.log("cek user login: "+this.user+":"+this.accessToken+":"+this.loggedIn );
		       	this.updateProfile();
	      	}
	    );
	    
	    console.log('Hello RestProvider Provider');
	    this.platform.ready().then(() => {
	        this.devmobile.osVersion = this.device.version;
	        this.devmobile.uuid = this.device.uuid;
	        this.devmobile.name = (window as any).device.name;
	    });
 	}

  getDevice(){
  	return this.devmobile;
  }
  
  updateProfile() {
  	if(this.accessToken&&this.loggedIn){
  		
  		this.postRestAPI({data:"{\"s\":[\"username\",\"email\"],\"w\":{\"email\":\""+this.user["email"]+"\",\"is_active\":true}}"},'sel/auth_user',false)//userInfo()
  		.then((result) => {
        	console.log(result);
		    if(result['code']==200&&result['success']==true){
	      		this.events.publish('welcomeuser', 
		        	result['data']['val'][0][0],//['username'], 
		        	result['data']['val'][0][1],//['email'], 
		        	true//result['user']['active']
		        );
	      	}
	      	else{
	     		console.log('Data kurang sesuai, clear user');//result['msg']);
	     		this.events.publish('welcomeuser', 'Halo, Guest', 'Silahkan login', null);
    			this.clearStorage();
	     	}
    	}, (err) => {
    		console.log(err);
	    });
  	}
  }
  
  setHeaders(withToken=false){  
    return withToken?{
    	Accept:'application/json',
    	'Content-Type':'application/json',  
  //  	'X-Auth-Token': this.accessToken==null?'':this.accessToken,
    	'Cache-Control':'no-chace',
    //	'Origin':'http://127.0.0.1:8000/',
		//'Referer':'http://127.0.0.1:2000/',
    	'Authorization': 'Bearer '+(this.accessToken==null?'':this.accessToken),
 //   	'E-Simrek-Key':'4ssc004kk8cwks44owc0ok8os0gck8kgws000oc4',
  //  	'X-Device':this.tool,
    }:{
    	Accept:'application/json',
    	'Content-Type':'application/json', 
    	'Cache-Control':'no-chace', 
    //	'Origin':'http://127.0.0.1:8000/',
		//'Referer':'http://127.0.0.1:2000/',
 //   	'E-Simrek-Key':'4ssc004kk8cwks44owc0ok8os0gck8kgws000oc4',
 //   	'X-Device':this.tool,
 //   	'Access-Control-Allow-Origin': '*',  
    };
  }
  
  
  // *******======Start General POST n REST ========
  execHttp(resolve,str,wload,type,wheader=false,value={}): void | any{
  	  this.loadingAlert(true,wload);
  	  console.log(this.apiUrl+'/'+str);
      
      //this.http.post(this.apiUrl+'/pesawat/schedule',value,this.setHeaders()).then(
	  //let self=this;
	  //this.http.setSSLCertMode('nocheck');
	  
	  if(type=='pos'){
		  console.log(JSON.stringify(value));
      	  this.http.setDataSerializer('json');
	  	  this.http.post(this.apiUrl+'/'+str,value,this.setHeaders(wheader)).then(
		  	  data => {
	      	 	 let ret=this.respHttp(data,wload);
    			 this.loadingAlert(false,wload);
    			 resolve(ret);
			  }, 
			  err => {
			  	 this.errHttp(err,wload);
			  }
		  );
	  }else if(type=='get'){
		  this.http.get(this.apiUrl+'/'+str,{},this.setHeaders(wheader)).then(
			  data => {
	      	 	 let ret=this.respHttp(data,wload);
    			 this.loadingAlert(false,wload);
    			 resolve(ret);
			  }, 
			  err => {
			  	 this.errHttp(err,wload);
			  }
		  );
	  }
  }
  
  respHttp(data,wload): void | any {
    console.log(JSON.stringify(data));
	if(typeof data.data==='undefined'){
    	this.showAlert('Gagal Koneksi...');
    	console.log('response',data);
    }
    else
        return JSON.parse(data.data);//resolve(JSON.parse(data.data));
  }
  
  errHttp(err,wload){
    console.log(err.error);
    if(err.error.indexOf("not valid") !== -1||err.error.indexOf("No auth") !== -1){
    	this.clearStorage();
		this.showAlert('Login Expired/not valid...',{
			text: 'OK',
			role: 'ok',
			handler: () => {
			    let modal=this.modalCtrl.create('SignInPopPage');
				modal.present();
        	}
        });
    }
    else{
	    this.showAlert('Gagal Koneksi...');
    }
	this.loadingAlert(false,wload);
  }
  
  postRestAPI(value,str,wload=true) {
  
    return new Promise(resolve => {
      	this.execHttp(resolve,str,wload,'pos',true,value);
    });
  }
  
  getRestAPI(str,wload=true) {
    
    return new Promise(resolve => {
        this.execHttp(resolve,str,wload,'get',true);
    });
  }
  
  loading:any;
  
  loadingAlert(isactive,wload,txt='Please wait...'){
	if(wload){
	  	if(isactive){
		    this.loading = this.loadingCtrl.create({
		      content: txt
		    });
		    this.loading.present();
	  	}else{
	  		setTimeout(() => {
	          this.loading.dismiss();
	        }, 1000);
	  	}
  	}
  }
  // *******======END General POST n REST =======
  
  login(credentials) {
    let wload=true;
    let str='user/login'; 
    let value={email:credentials.email,password:credentials.password,response:credentials.response};
         
    return new Promise((resolve) => {
        this.execHttp(resolve,str,wload,'pos',false,value);
      	//resolve(res);
    });
  }
  
  
  userInfo() {
    
    return new Promise((resolve) => {
		this.execHttp(resolve,'user/profile',false,'get',true);
    });
  }
  
  apiRest(str,value=null) {
    return new Promise(resolve => {
	  if(value!==null){
      	  this.execHttp(resolve,str,true,'pos',true,value);
      }
      else{
		  this.execHttp(resolve,str,true,'get',true);
      }
    });
  }

  logout(){
    return new Promise((resolve) => {
	    this.execHttp(resolve,'user/logout',true,'get',true);
    });
  }

  clearStorage(){
    this.storage.remove('profile');
    this.storage.remove('access_token');
    this.storage.remove('expires_at');
    this.accessToken = null;
    this.user = null;
    this.loggedIn = false;
  }
  

  showAlert(txt,btn:any='OK') {
    const alert = this.alertCtrl.create({
      title: 'Info!',
      subTitle: txt,
      buttons: [btn]
    });
    alert.present();
  }

  showConfirm(txt,btn,input=[]) {
    let alert = this.alertCtrl.create({
      title: 'Konfirmasi',
      message: txt,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        btn
      ]
    });
	for(let i=0;i<input.length;i++){
		alert.addInput(input[i]);
	}
    alert.present();
  }
  
  postRestHome(value,str) {
    return new Promise(resolve => {
        this.execHttp(resolve,str,true,'pos',false,value);
    });
  }
}
