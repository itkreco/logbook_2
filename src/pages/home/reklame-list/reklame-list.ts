/**
 * @author    ThemesBuckets <themebucketbd@gmail.com>
 * @copyright Copyright (c) 2018
 * @license   Fulcrumy
 * 
 * File path - '../../src/pages/home/reklame-list/reklame-list'
 */

import { Component,NgZone,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,Platform, //ActionSheetController, 
ModalController,Content, AlertController,AlertButton, LoadingController  } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer,  FileTransferObject } from '@ionic-native/file-transfer';


import { RestProvider } from '../../../providers/rest/rest';
import { DataProvider } from '../../../providers/data/data';
import { DatePipe } from '@angular/common';

//export pdf
import jsPDF from 'jspdf';
import 'jspdf-autotable'
/*
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file';
*/
//map
import { Geolocation } from '@ionic-native/geolocation'; 
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-reklame-list',
  templateUrl: 'reklame-list.html',
})
export class ReklameListPage {

  @ViewChild(Content) content: Content;

  bReadonly=true;
  reklames: any = [];
  param:any;
  //lib:Lib;
  sUrl:string;
  isTab:boolean=false;
  dumDate:any;
  dumHour:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
  	private geolocation : Geolocation,
    public platform: Platform,
    private zone: NgZone,

	public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private file: File,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,

   // private transfer: FileTransfer, 
   // private file: File,
   // public actionsheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public datepipe: DatePipe,
    //public currencyPipe: CurrencyPipe,
    public restProvider: RestProvider,
    public dataProvider: DataProvider
    ) { 
		console.log('user',this.restProvider.user);
		if(this.restProvider.user==null){
			let modal=this.modalCtrl.create('SignInPopPage');
        	modal.onDidDismiss(() => {
			    this.selVessel();
			});
			
	  		modal.present();
		}else{
			this.initConstruct(navParams.get('list'));
		}
    }

  /** Do any initialization */
  ngOnInit() {
     this.sUrl=this.restProvider.apiUrl;//.replace(/api/g, "");
  }
  
  ionViewDidEnter(){
        if(this.param==undefined)this.param={isactive:0};
		if(this.param.isactive!==0)
		    this.platform.ready().then(() => {
		      this.loadMap();
		});
  }

  
  initConstruct(navParamList){
		if(this.restProvider.user['email'].indexOf("pengawas") !== -1){this.bReadonly=true}else{this.bReadonly=false}
		this.param= this.navParams.get('list');
        //console.log(Math.sin(20));
        console.log('param:',this.param);
    /*	this.param={
    		result:[],//result['data'],
    	//	page:data['pagination'],
    		search:{
		  		lat:14,
		    	lon:7
		    },
    		isactive:0,
    		detail:'FreklamePage'
    		//feeprice:data['feeprice']
    	};*/
		    	
		if(this.param==undefined){
			if(!this.currentLocation()){
				this.selVessel();
			}else{
				this.restProvider.showAlert('gps problem..');
			}
		}  
		else{ 
		    //this.responseObj.longitude=this.param.search.lon;
	    	//this.responseObj.latitude=this.param.search.lat;
	    	this.responseObj.refLat=this.responseObj.longitude;//this.param.search.lat;
	    	this.responseObj.refLng=this.responseObj.longitude;//this.param.search.lon;
			this.getReklameList();
    	}
  }


  loadReklameList(bol=false){
	if(this.param.search==undefined){
		if(!this.currentLocation()){
			this.selVessel();
		}else{
			this.restProvider.showAlert('gps problem..');
		}
	}else if (this.param.search.log==0){
		this.selLogType();
	}else{
	  	this.restProvider.postRestAPI(this.param.search,'book/list',bol)
	    .then(result => {
	      console.log(result);
	      if(result['code']==200&&result['success']==true){
	        if(result['data'].indexOf('failed') !== -1) //act
	        	this.restProvider.showAlert('Maaf Gagal...');
	        else //if(this.restProvider.loggedIn)
	        {
	        	this.param.result=result['data'];
			 	this.getReklameList();
				
				if(this.param.isactive!==0)
				    this.platform.ready().then(() => {
				      this.loadMap();
				});
		  	}
	      }
	      else
	      	this.restProvider.showAlert('akses problem');//data["error_msgs"]);
	    });
	}
  }
  
  download(){
	  let alertButton:AlertButton={
		    text: 'Download',
		    handler: data => {
		        switch(data) { 
				   case 1: { 
				      this.downloadCsvLogbook();
				      break; 
				   } 
				   case 2: { 
				      //statements; 
				      this.downloadPdfLogbook();
				      break; 
				   } 
				   default: { 
				      this.restProvider.showAlert('Pilihlah opsi format file!');
					  return false;
				   } 
				}
			
		    }
	  };
		
	  this.restProvider.showConfirm('Silahkan pilih format file yang akan didownload:',
		alertButton,[
		{
		  name:'radioInp',
	      type:'radio',
	      label:'CSV table',
	      value:1
	    },
		{
	      name:'radioInp',
	      type:'radio',
	      label:'Pdf report',
	      value:2
	    }
	  ]
	 );
  }

  selLogType(){
	let alertButton:AlertButton={
		    text: 'Tipe Logbook',
		    handler: data => {
		        switch(data) { 
				   case 1: { 
				      this.param.search.log="1";
					  this.loadReklameList(true);
				      break; 
				   } 
				   case 2: { 
				      //statements; 
				      this.param.search.log="2";
					  this.loadReklameList(true);
				      break; 
				   } 
				   default: { 
				      this.restProvider.showAlert('Pilihlah opsi tipe logbook!');
					  return false;
				   } 
				}
			
		    }
	  };
		
	  this.restProvider.showConfirm('Silahkan pilih tipe Logbook yang akan ditampilkan:',
		alertButton,[
		{
		  name:'radioInp',
	      type:'radio',
	      label:'Logbook Dek',
	      value:1
	    },
		{
	      name:'radioInp',
	      type:'radio',
	      label:'Logbook Mesin',
	      value:2
	    }
	  ]
	 );
  }

  downloadCsvLogbook(){
  	this.restProvider.postRestAPI(this.param.search,'book/export',true)
    .then(result => {
      console.log(result);
      if(result['code']==200&&result['success']==true){
        if(result['data'].indexOf('failed') !== -1) //act
        	this.restProvider.showAlert('Maaf Gagal...');
        else //if(this.restProvider.loggedIn)
        {
        	//this.param.result=result['data'];
			var repname=result['data'];//this.param.search.status+"_"+this.param.search.tglawal+"_sd_"+this.param.search.tglakhir+".csv";
			const loader = this.loadingCtrl.create({content: "Please wait..."});
		    loader.present();
		
		    const url = this.sUrl+'/report/'+repname;
		    const fileTransfer: FileTransferObject = this.transfer.create();
		    fileTransfer.download(url, this.file.externalRootDirectory + 'Download/'+repname).then((entry) => {     
		       
			   let btn:AlertButton={
		             text: 'Buka',
		             handler: () => {
		               this.fileOpener.open(this.file.externalRootDirectory + 'Download/'+repname, 'application/excel')
		                   .then(() => console.log('File is opened'))
		                   .catch(e => console.log('Error opening file', e));
		             }
		           };

			   this.restProvider.showConfirm('File dokumen berhasil di unduh.<br>'+entry.toURL(),btn);
			
		       loader.dismiss();
		
		     }, (error) => {
		       console.log(error);
               this.restProvider.showAlert('File dokumen gagal di unduh.');
		       loader.dismiss();
		     });
	  	}
      }
      else
      	this.restProvider.showAlert('akses problem');//data["error_msgs"]);
    });
  }
  
  downloadPdfLogbook(){
  	this.restProvider.postRestAPI(this.param.search,'book/pdf',true)
    .then(result => {
      console.log(result);
      if(result['code']==200&&result['success']==true){
        if(result['data'].indexOf('failed') !== -1) //act
        	this.restProvider.showAlert('Maaf Gagal...');
        else //if(this.restProvider.loggedIn)
        {
        	this.exportPdf(result['data']);
	  	}
      }
      else
      	this.restProvider.showAlert('akses problem');//data["error_msgs"]);
    });
  }

  exportPdf(dt){
    //this.paymentDetails = data;
  /*  let epayTransID = 123;
    let status = 1;
    //let ReceiptDate = data[0].ReceiptDate;
    let TaxPeriod = '5 bulan';
    let TotAmount = 2500;
    let BankRefNo = 'Ref12354343';*/
    var doc = new jsPDF('l', 'mm', 'a3');
    var colwidth=12;
	var headheight=32;  //res decimal after divide 4
	var columns = this.param.search.log=='1'?this.dataProvider.getHeaderLogPdf(headheight,colwidth):this.dataProvider.getHeaderEngLogPdf(headheight,colwidth);

	var rows = this.dataProvider.getDataLogPdf(dt,headheight,this.param.search.log);
	/*
		[
		[{
            content: 'Tanggal\nDate', colSpan: 22, rowSpan: 1,
            styles: {halign: 'left',fillColor:[200,210,240],minCellHeight:headheight/4,angle:undefined}
        }],
		["Larut - Malam\nMidle - Watch\n \n00:00-04:00", "19:00", "caca"],
		["Dini - Hari\nMorning - Watch\n \n04:00-08:00", "17:00", "cici\nmomo"],
		["Pagi - Hari\nForenoon - Watch\n \n08:00-12:00", "15:00", "baba"],
        ["Siang - Malam\nAfternoon - Watch\n \n12:00-16:00", "19:00", "caca"],
        ["Petang - Hari\nDog - Watch\n \n16:00-20:00", "17:00", "cici\nmomo"],
        ["Malam - Hari\nFirst - Watch\n \n20:00-24:00", "15:00", "baba"],
	];
	*/
	//let margin=6;
	
	doc.autoTable({  
		head:columns,
		body:rows,
		theme: 'grid',
    		headStyles: {
			lineWidth: 0.1,
            lineColor: [200, 200, 200]
		},
		styles: {
    		overflow: 'linebreak',
    		fontSize: 6,
    		valign: 'middle'
		},
		columnStyles: {
        	0: {	valign: "middle", 
				halign:"center",
				minCellHeight:headheight*3/4,
				cellWidth:Math.ceil(colwidth*4/3),
				angle:90
			}, 
        	1: {
        		cellWidth: colwidth,
        		fontStyle: 'bold',
        		halign: 'center',
        	},
        	2: {
				cellWidth: colwidth,
        		fontStyle: 'bold',
        		halign: 'center',
    		},
		},
		
		willDrawCell: (data) => {
			if(data.row.index>0){
			    if (data.section === 'body' && data.column.index === 0&&typeof data.cell.raw=="object") {
				  let str:string =data.cell.raw.content;
				  if (str==' '){//.indexOf(' ') !== -1){
					 console.log('data start:',data,data.cursor.y,data.cell.y,data.cell.textPos.y,data.cell.styles.fillColor);
				 /* 	 doc.addPage();
					 data.cursor.y = margin * 2;
                     data.cell.y = margin * 2;
					 data.cell.textPos.y = margin * 2+4;
                     //data.cell.styles.fillColor = [200,210,240]; // No effect
                     console.log('data end:',data,data.cursor.y,data.cell.y,data.cell.textPos.y,data.cell.styles.fillColor);
				  	 data.doc.setFontType("bold");
					 data.doc.setFillColor(200, 210, 240);*/
					 data.cursor.y=data.cursor.y+215;
				  }
			    }
			}
		},
		didDrawPage: function (data) {
		    // Header
		    doc.setFontSize(10);
		    doc.setTextColor(40);
		    doc.text("Laporan dicetak dari ShiApp", data.settings.margin.right, 10);
		
		    // Footer
		    var str = "Hal. " + doc.internal.getNumberOfPages();
		
		    doc.setFontSize(10);
		
		    // jsPDF 1.4+ uses getWidth, <1.4 uses .width
		    var pageSize = doc.internal.pageSize;
		    var pageHeight = pageSize.height
		      ? pageSize.height
		      : pageSize.getHeight();
		    doc.text(str, data.settings.margin.right, pageHeight - 10);
			console.log('data end:',data);
			//console.log(data.cursor.y,data.cell.y,data.cell.textPos.y,data.cell.styles.fillColor);
				
			//data.cursor.y=data.cursor.y+155;
		}
	});

 //   doc.save('acaca.pdf');

    const loader = this.loadingCtrl.create({content: "Process..."});
	loader.present();
		
		
    let pdfOutput = doc.output();

	let buffer = new ArrayBuffer(pdfOutput.length);
    let array = new Uint8Array(buffer);
    for (var i = 0; i < pdfOutput.length; i++) {
      array[i] = pdfOutput.charCodeAt(i);
    }
    // For this, you have to use ionic native file plugin
    const directory = this.file.externalRootDirectory+ 'Download' ;
   // alert(directory);
    const stime=this.datepipe.transform(new Date(), 'HHmmss');
    const fileName = "vessel"+this.param.search.vessel+"_"+this.param.search.tglawal+"_sd_"+this.param.search.tglakhir+"_"+stime+".pdf";
  //  doc.save(fileName);

	this.file.writeFile(directory,fileName,buffer)
    .then((success)=> {
		let btn:AlertButton={
	         text: 'Buka',
	         handler: () => {
	           this.fileOpener.open(success.nativeURL, 'application/pdf')
	               .then(() => console.log('File is opened'))
	               .catch(e => console.log('Error opening file', e));
	         }
	    };
	
	    this.restProvider.showConfirm('File dokumen berhasil di unduh.<br>'+success.nativeURL,btn);
	
        loader.dismiss();
	}
    	//this.fileOpener.open(success.nativeURL, 'application/pdf') .then(() => console.log('File is opened'))
    )
    .catch((error)=> {
		console.log(error);
		this.restProvider.showAlert('File dokumen gagal di unduh.');
		loader.dismiss();
	});
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
    this.mfilter={
	    sort:-1,
	    filter:[]
	};
  }

  /**
   * Open Reklame Details Page
   */
  viewDetails(idx) {
    let formDetail=this.param.detail;
    let todo;
	let link;
	if(this.param.search.log==1){
		todo=idx==-1?["0",this.param.search.vessel]:[this.reklames[idx][0].toString(),this.param.search.vessel];
    	link='book/det';
	}
	else
	{
		todo={data:JSON.stringify({
				s:["*"],
				w:{
					trip_id:this.param.search.vessel,
					id:idx==-1?"0":this.reklames[idx][0].toString()
				}
			})};
		link='sel/eng_logbooks';
	}
	
    this.restProvider.postRestAPI(todo,link,true)
    .then(result => { 
      console.log(result);
      if(result['code']==200&&result['success']==true){
       /* if(result['data'].indexOf('failed') !== -1) //act
        	this.restProvider.showAlert(result['data']);
        else  
        {*/
        	let res={
		    	list:(this.param.search.log==1?result['data']:result['data']['val']),
				trip_id:this.param.search.vessel
		    };
		    
		    const modal = this.modalCtrl.create(formDetail,res);
		    modal.present(); 
	  //	}
      }
      else
      	this.restProvider.showAlert('akses problem');//data["error_msgs"]);
    });
  }
  
  addNew(){
  	this.viewDetails(-1);
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
  mfilter={sort:-1,filter:[]};
  
  map: any;
  //geocoder: any;
   
  responseObj = {
    latitude:0,
    longitude:0,
    refLat:1.142753,
    refLng:104.014004,
    accuracy:0,
    address:"Batam"
  };
  
  currentLocation(){
    this.geolocation.getCurrentPosition({
	    	enableHighAccuracy : true
	    }).then((res) => {
      this.responseObj.latitude=res.coords.latitude;
      this.responseObj.longitude=res.coords.longitude;
      console.log(res);
      return true;//this.positionMap();
    }).catch((error) => {
	    console.log('Error getting location', error);
		return false;
    });
  }
  
  canvasMarker(dataName,clr){
  	var canvas, context; 

      canvas = document.createElement("canvas");
      canvas.width = 80;
      canvas.height = 30;
      var  x=1, y=1, width=65, height=20, radius=0,  stroke= true;
      context = canvas.getContext("2d");
      if (typeof stroke == "undefined" ) {
        stroke = true;
      }
      if (typeof radius == "undefined") {
        radius = 5;
      }
      context.beginPath();
      context.moveTo(x + radius, y);
      context.lineTo(x + width - radius, y);
      context.quadraticCurveTo(x + width, y, x + width, y + radius);
      context.lineTo(x + width, y + height - radius);
      context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      context.lineTo(x + radius, y + height);
      context.quadraticCurveTo(x, y + height, x, y + height - radius);
      context.lineTo(x, y + radius);
      context.quadraticCurveTo(x, y, x + radius, y);
      context.fillStyle = clr;
      context.fill();
      context.closePath();
      if (stroke) {
        context.stroke();
      }
    context.lineWidth = 1;
    context.strokeStyle = "#ffffff";
    context.font="11px Arial";
    context.textAlign="center"; 
    context.fillStyle = "black";
    context.fillText(dataName,33,15);
	let url=canvas.toDataURL("image/jpg");
	//console.log(url);
    return url;
  
  }
  
  positionMap(){
  	// Set Latitude and Longitude
        const pos = new google.maps.LatLng(this.responseObj.latitude, this.responseObj.longitude);

       // let pos={lat:this.responseObj.latitude, lng:this.responseObj.longitude};
		// Map Options
	//	console.log(pos);
		let idmap=document.getElementById('map');
		if(idmap)
			console.log('ok');
		else console.log(idmap);
		
        this.map = new google.maps.Map(idmap, {
          zoom: this.responseObj.latitude==1.142753&&this.responseObj.longitude==104.014004?11:18,
          center: pos//,
        //  mapTypeId: google.maps.MapTypeId.ROADMAP
        });
		
		//console.log('=>2');
        // Set Map in Center
       // this.map.setCenter(pos);

		this.assignMarkers();
  }
  
  iconMarker={
    url: 'assets/imgs/icons/reklame/', // custom background image (marker pin)
    scaledSize: new google.maps.Size(40, 25),
  };
	      
  assignMarkers(){
  	for(let i=this.reklames.length-1;i>=0;i--){
  	
  	    if(!(this.isNum(this.reklames[i].lat)&&this.isNum(this.reklames[i].lng)))
  	    	continue;
  	    let reklame=this.reklames[i];
  	    //sUrl=sUrl.replace(/api/g, "");
  	    
        let curreklame={
        	id:i,
        	km:this.getDistance(reklame.lat,reklame.lng),
        	npwpd:reklame.npwpd,
        	name:reklame.name,
        	photo_primary:this.sUrl+'files/foto/'+reklame.foto,
        	desc:reklame.description,
          	address:reklame.alamat_tiang,
        	kode:reklame.kode,
        	status:reklame.exp_status,
        	no_daftar:reklame.no_daftar,
        	id_tiang:reklame.id_tiang,
        	ukuran:reklame.ukuran_bill
        };
        
        console.log(reklame);
  		// Create Marker
        const latlng = new google.maps.LatLng(reklame.lat, reklame.lng);
        
        const marker = new google.maps.Marker({
          map: this.map,
          position: latlng,
          icon: {url:this.iconMarker.url+curreklame.status+'.png',scaledSize:this.iconMarker.scaledSize}
		 // animation: google.maps.Animation.DROP
        });
        //console.log(marker);
        marker.setZIndex(1);
        
        let textMarker=curreklame.id_tiang;//this.currencyPipe.transform(this.lib.getPriceWithFee(reklame.price), ' ', 'symbol', '1.0-2');
        
        let clr='white';
        if(curreklame.status=='active')clr='green';
        else if(curreklame.status=='expiring')clr='orange';
        else if(curreklame.status=='expired')clr='red';
        
        const marker2 = new google.maps.Marker({
          map: this.map,
          position: latlng,
          icon: this.canvasMarker(textMarker,clr)
        });
        
        marker2.setZIndex(2);
		
        // Marker Infor Window
        /*
        const infoWindow = new google.maps.InfoWindow({
          content: this.responseObj.address==''?'Anda disini':this.responseObj.address
        });
        */
		
		//let self=this;
        
        google.maps.event.addListener(marker2, 'click',(e) => {
            this.zone.run(() => { 
	          	this.infoReklame(2);
			  	this.reklameMap=curreklame;
			  	this.checkConsole();
			  	console.log(e);
		  	});
		  	//console.log(self.reklameMap);console.log('>>active:'+self.param.isactive);
        });
     }
  }
  
  checkConsole(){
  	console.log(this.reklameMap);console.log('>>active:'+this.param.isactive);
  }
  
  infoReklame(idx,event: Event=null){
  	if(event!==null){
    	event.stopPropagation();
    }
    this.param.isactive=idx;
    this.content.resize();
  }
  
  goMap(lat,lng,event: Event=null){
  	if(event!==null){
    	event.stopPropagation();
    }
    this.responseObj.latitude=lat;
    this.responseObj.longitude=lng;
    this.openList();
  }
  
  goList(idx,event: Event=null){
  	if(event!==null){
    	event.stopPropagation();
    }
    this.openList();
    setTimeout(() => {
  		this.platform.ready().then(() => {
    		this.scrollTo('list_'+idx);
	    });
    }, 80);
  }
  
  onInnerPointerUp(event: PointerEvent) {
	if (event && event.preventDefault) {
		event.preventDefault();
	}
  }
  
  curScrollIdx:string=null;
  
  scrollTo(element:string) {
    console.log(element);
    if(this.curScrollIdx!=null)
    	this.resetElement(this.curScrollIdx);
    let el = document.getElementById(element);
    if(el!=undefined){
    	this.content.scrollTo(0, el.offsetTop, 1000);
    	el.setAttribute("style", "align-items:end;border-bottom: red 1px dotted;border-right: red 5px solid;background-color:linen");
    	this.curScrollIdx=element;
    }
  }
  
  resetElement(element:string){
  	let el = document.getElementById(element);
    if(el!=undefined){
    	el.setAttribute("style", "align-items:end;");
    	this.curScrollIdx='';
    }
  }
  
  loadMap() {
    
    this.positionMap();
  }
  
  isNum(num){
  	 return num==null||num==''?false:true;
  }
  
  getDistance(lat1,lon1) {
    let lat2=this.responseObj.refLat;
    let lon2=this.responseObj.refLng;
    if(this.isNum(lat1)&&this.isNum(lon1)){
	    let R = 6371; // Radius of the earth in km
	    let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
	    let dLon = this.deg2rad(lon2-lon1); 
	    let a =
	    Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
	    Math.sin(dLon/2) * Math.sin(dLon/2);
	    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	    var d = R * c; // Distance in km
	    return Math.round(d * 10) / 10;
	 }
	 else return '-';
  }

  deg2rad(deg) {
	  return deg * (Math.PI/180)
  }
  
  openList(){
	this.restProvider.loadingAlert(true,true);
	
    if(this.param.isactive==0){
	    this.infoReklame(1);
	    setTimeout(() => {
        
	  		this.platform.ready().then(() => {
		        this.loadMap();
		        
	 			this.restProvider.loadingAlert(false,true);
		    });
	    }, 80);
  	}else{
  		this.infoReklame(0);
  		setTimeout(() => {
        
	  		this.platform.ready().then(() => {
	  			this.restProvider.loadingAlert(false,true);
			});
	    }, 80);
  	}
  	
  }
  
  isDiffDate(dt){
	if (dt.indexOf(this.dumDate)>-1){
		return false;
	}
	else{
		let srdum=dt.split(" ");
		this.dumDate=srdum[0];
		this.dumHour=-1;
		//srdum=srdum[1].split(":");
		//this.dumHour=Math.floor(Number(srdum[0])/4);
		return true;
	}
  }

  isDiffGrHour(dt){
	let srdum=dt.split(" ");
	srdum=srdum[1].split(":");
		
	if (Math.floor(Number(srdum[0])/4)==Math.floor(this.dumHour/4)){
		return false;
	}
	else{
		this.dumHour=Number(srdum[0]);
		return true;
	}
  }

  getGHour(){
	if(this.dumHour>=0&&this.dumHour<4){
		return "00:00-04:00";
	}else if(this.dumHour>=4&&this.dumHour<8){
		return "04:00-08:00";
	}else if(this.dumHour>=8&&this.dumHour<12){
		return "08:00-12:00";
	}else if(this.dumHour>=12&&this.dumHour<16){
		return "12:00-16:00";
	}else if(this.dumHour>=16&&this.dumHour<20){
		return "16:00-20:00";
	}else{
		return "20:00-24:00";
	}
  }

  selVessel(){
	  this.isTab=true;
	  let alertButton:AlertButton={
		    text: 'proses',
		    handler: data => {
			   if(data>=1){
			      	this.param={
			    		result:[],//result['data'],
			    	//	page:data['pagination'],
			    		search:{
							vessel:data.toString(),
				//	  		lon:this.responseObj.longitude,
				//	    	lat:this.responseObj.latitude,
							log:0,
							tglawal:this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
							tglakhir:this.datepipe.transform(new Date(), 'yyyy-MM-dd')
					    },
			    		isactive:0,
			    		detail:'FreklamePage'
			    		//feeprice:data['feeprice']
			    	};
					this.responseObj.refLng=this.responseObj.longitude;
					this.responseObj.refLat=this.responseObj.latitude;
					this.loadReklameList(true);
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
}
