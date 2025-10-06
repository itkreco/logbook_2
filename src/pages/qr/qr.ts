import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams,AlertButton} from 'ionic-angular';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { RestProvider } from '../../providers/rest/rest';


/**
 * Generated class for the QrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr',
  templateUrl: 'qr.html',
})
export class QrPage {

  //base64img:any;
  qrName:any='';
  //filePath:any;
  //imageURI:any;
  //lastImg:any;
  sUrl:string;
  flashActive:boolean=false;
  camExist:boolean=false;
  flashExist:boolean=false;
  domElement:HTMLElement;
  
  constructor(
  	public navCtrl: NavController,
  	public modalCtrl: ModalController,
    public restProvider: RestProvider, 
    public zone:NgZone,
  	public navParams: NavParams,
  	private qrScanner: QRScanner
  ) {
  	//this.previewScan(1);
  	this.sUrl=this.restProvider.apiUrl.replace(/api/g, "");
  	
    //this.qrName="444444445@568".replace("@", "-")+".png";
  }
  
  ngOnInit() {
    this.domElement = window.document.querySelector('ion-app') as HTMLElement;
    this.prepare();
  }
  
  ionViewWillLeave() {
    console.log('ionViewWillLeave QrPage');
    this.hideCamera();
  }
  
  prepare() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
         if (status.authorized) {
	       	// camera permission was granted
	       	if(status.canEnableLight){
	       		this.flashExist=true;
	       		this.flashActive=false;
  				this.qrScanner.disableLight();
	       	}
	       	if(status.canChangeCamera){
	       		this.camExist=true;
	       		
	       	}
          	this.showCamera();
	     }else if(!status.authorized){
  			
  			if (status.denied) {
		       // camera permission was permanently denied
		       // you must use QRScanner.openSettings() method to guide the user to the settings page
		       // then they can grant the permission from there
		       this.restProvider.showAlert("Akses camera telah ditolak permanen...");
		    } else {
		       // permission was denied, but not permanently. You can ask for permission again at a later time.
		       this.restProvider.showAlert("Akses camera saat ini ditolak...");
		    }
		    
		    if(status.canOpenSettings){
			    let alertButton:AlertButton={
			        text: 'Buka Setting',
			        handler: () => {
			          this.qrScanner.openSettings();
			        }
				};
	  			this.restProvider.showConfirm("Apakah ingin memberi akses kamera utk scan? Anda bisa mengijinkan akses kamera di menu pengaturan/setting",alertButton);
  			}
  		}
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // Run this function.
  showCamera() {
    this.qrScanner.show();
    this.domElement.classList.add('has-camera');
	
	//this.scanActive=true;
	
    const scanSub = this.qrScanner.scan()
      .subscribe((text: string) => {
        scanSub.unsubscribe();
        this.onScan(text);
      });
  }

  cameraStop(){
  	//scanSub.unsubscribe();
    this.hideCamera();
  }
  
  hideCamera() {
    this.qrScanner.hide();
    this.qrScanner.destroy();
    this.domElement.classList.remove('has-camera');
  }

  onScan(text: string) {
    this.hideCamera();
    this.zone.run(() => { 
	    text=text.replace("@", "-")+".png";
	    this.qrName=text;
	   // this.restProvider.showAlert('Scanned:'+this.qrName);
	    console.log('Scanned:', text);
  	});
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrPage');
  }
  
  
  flashOn(){
  	this.qrScanner.getStatus()
	.then((status: QRScannerStatus) => {
		if(status.lightEnabled){
	  		this.flashActive=false;
	  		this.qrScanner.disableLight();
	  	}
	  	else{
	  		this.flashActive=true;
	  		this.qrScanner.enableLight();
	  	}
	});
  }
  
  cameraChange(){
  	this.qrScanner.getStatus()
	  .then((status: QRScannerStatus) => {
		this.qrScanner.useCamera((status.currentCamera==0?1:0));
	});
  }
  
  getData(){
  	//let formDetail=this.param.detail;
    let todo={
    	id:this.qrName,
    	type:'tiang'
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
		    
		    const modal = this.modalCtrl.create('FmapPage',res);
		    modal.present();
      	}else
            this.restProvider.showAlert(data["diagnostic"]["error_msgs"]);
    });
  }
  
}
