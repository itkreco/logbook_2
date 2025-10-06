import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController, ViewController,ModalController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';


import { RestProvider } from '../../../providers/rest/rest';

/**
 * Generated class for the FotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-foto',
  templateUrl: 'foto.html',
})
export class FotoPage {

  base64img:any;
  imageFileName:any='';
  filePath:any;
  imageURI:any;
  lastImg:any;
  sUrl:string;
  data:any;
  
  constructor(
	  public navCtrl: NavController,
	 // private transfer: FileTransfer,
      public actionSheetCtrl: ActionSheetController, 
      public restProvider: RestProvider,
	  private camera: Camera, 
	  public navParams: NavParams,
      public viewCtrl: ViewController,
      public modalCtrl: ModalController
  ) {
  	this.base64img=null;
  	this.sUrl=this.restProvider.apiUrl.replace(/api/g, "");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FotoPage');
  }
  
  presentActionSheet() {
  	//let icon="checkmark";
    let iconClass="actionSheet_withIcomoon";
    
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Pilih sumber gambar',
      cssClass: 'fotosheet',
      buttons: [
        {
          text: 'Ambil foto',
          cssClass: iconClass,
          handler: () => {
            this.getImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Ambil dari galeri',
          cssClass: iconClass,
          handler: () => {
            this.getImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },        
        {
          text: 'Batal',
          cssClass: iconClass,
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  
  getImage(sourceType) {
	  const options: CameraOptions = {
	    quality: 100,
	    //destinationType: this.camera.DestinationType.FILE_URI,
	    sourceType: sourceType,
        destinationType:this.camera.DestinationType.DATA_URL,
      	encodingType:this.camera.EncodingType.JPEG
      	//saveToPhotoAlbum:sourceType==this.camera.MediaType.PICTURE?true:false
	  }
	
	  this.camera.getPicture(options).then((imageData) => {
	    this.base64img = "data:image/jpeg;base64,"+imageData;
	    this.imageURI=imageData;
	   // this.lastImg=1;
	  }, (err) => {
	    console.log(err);
	    this.restProvider.showAlert(err);
	  //  this.presentToast(err);
	  });
  }
  
  
  upload() {
     
	  
  	  let todo={
  	  	id:123,
  	  	foto:this.imageURI
  	  };
  	  this.uploadFile(todo);
  }
  
  uploadFile(todo){
  	console.log(todo);
  	this.restProvider.postRestAPI(todo,'map/foto',true)
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
		   // 		isactive:idx,
		    		//feeprice:data['feeprice']
		    	}
		    };
		    console.log('hasil:',res);
		    this.imageFileName =data['data'];
		    this.base64img=null;
		 //   const modal = this.modalCtrl.create('ReklameListPage',res);
		 //   modal.present();
      	}else
            this.restProvider.showAlert(data["diagnostic"]["error_msgs"]);
    });
  }

	confirm(){
		this.viewCtrl.dismiss({foto:this.imageFileName});
	}
}
