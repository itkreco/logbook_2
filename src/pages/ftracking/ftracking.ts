import { Component,NgZone,ViewChild} from '@angular/core';
import { IonicPage, Content,NavController, NavParams,ModalController, Platform } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
//import { Geolocation } from '@ionic-native/geolocation'; 
import { DatePipe } from '@angular/common';
//import { isFalsy } from 'utility-types'

/**
 * Generated class for the FmapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//declare var google;
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-ftracking',
  templateUrl: 'ftracking.html',
})
export class FtrackingPage {
	
  @ViewChild(Content) content: Content;
  map: any;
  currentMapTrack = null;

  trackedRoute = [];
//  previousTracks = [];

 // positionSubscription: Subscription;
  
  
  param:any;
  data:any={};
/*{
    id:[''],
    water:[''],
    oil:[''],
    name:[''],
    description:[''],
   // vdate:[''],
    lat:[''],
    lng:[''],
    suhu:[''],
    pressure:[''],
    speed:[''],
	local_time:[''],
    foto:['']
 // });
 };
  */
  
  //latLngPattern:string = "/^[0-9]+(\.[0-9]{1,6})?$/";
  no_pattern:string ="/([0-9])$/";
  //qrFileName:string;
  /*	
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
  */
  
  sUrl:string;

  constructor(
  	public navCtrl: NavController, 
    public modalCtrl:ModalController,
  //	private geolocation : Geolocation,
    public restProvider:RestProvider,
    private zone: NgZone,
    public datepipe: DatePipe,
    private platform: Platform,
  	public navParams: NavParams) {
  	 	if(this.restProvider.user==null){
			let modal=this.modalCtrl.create('SignInPopPage');
        	//modal.onDidDismiss(() => {
		//	    this.loadHistoricRoutes();
		//	});
	  		modal.present();
		}else{
			this.initConstruct(navParams.get('list'));
		}
  }
  
  responseObj = {
    latitude:0,
    longitude:0,
    refLat:-7.730978,
    refLng:113.216579,
    accuracy:0,
    address:"Probolinggo"
  };

  initConstruct(navParamList){
		this.param= this.navParams.get('list');
        //console.log(Math.sin(20));
        console.log('param:',this.param);

   // 	this.responseObj.refLat=this.responseObj.longitude;//this.param.search.lat;
   // 	this.responseObj.refLng=this.responseObj.longitude;//this.param.search.lon;
	//	this.getReklameList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FtrackingPage');
    this.refreshMap();
  }

  isGoogleActive(){
		if (!!google) {
			return true;
		}
		else {
			this.restProvider.showAlert('Something went wrong with the Internet Connection. Please check your Internet.');
			return false;
		}
	}
	
 refreshMap(){
	this.platform.ready().then(() => {
   //   this.loadHistoricRoutes();
    if (this.isGoogleActive()) {
		  let mapOptions = {
	        zoom: 13,
	        mapTypeId: google.maps.MapTypeId.ROADMAP,
	        mapTypeControl: true,
	        streetViewControl: false,
	        fullscreenControl: true
	      }
	      this.map = new google.maps.Map(document.getElementById('maploc'), mapOptions);
		  this.map.setZoom(13);
	      
	        this.trackedRoute=this.param.result;
			//this.getReklameList();
			let path=[];
			
			for(let i=0; i<this.trackedRoute.length; i++){
				if (this.trackedRoute[i][16]&&this.trackedRoute[i][17]) {
					path.push({ lat: parseFloat(this.trackedRoute[i][16].toFixed(8)), lng: parseFloat(this.trackedRoute[i][17].toFixed(8))});
				}
			}
			//if(this.param.isactive!==0)
			this.platform.ready().then(() => {
				console.log("poly:",path);
			    let latLng = new google.maps.LatLng(path[0].lat,path[0].lng);
		  		this.map.setCenter(latLng);
		  		this.redrawPath(path);
				this.assignMarkers();
			});
		}
    });

    
		
		/*if(this.type.koord.lat==null||this.type.koord.lng==null){
	    	let that=this;
		    this.map.addListener('center_changed', function() {
	          // 3 seconds after the center of the map has changed, pan back to the
	          // marker.
	          window.setTimeout(function() {
		          pos=that.map.getCenter();
		          marker.setPosition(pos);
		          that.selected={
				  	pos:{lat:pos.lat().toFixed(6), lng:pos.lng().toFixed(6)}
				  };
				  //console.log(pos);
	          }, 500);
	        });
		}*/
}
  /*
  
  loadHistoricRoutes(idx=1) {
      if  (idx==1) url='sel/logbooks'; else url='sel/eng_logbooks';
      //dstart=new Date();//this.datepipe.transform(new Date(), 'yyyy-MM-dd');
      //dend=dstart.setDate(dstart.getDate() + 1);
	  this.restProvider.postRestAPI({data:"{\"sel\":[\"id\",\"local_time\",\"vtemp\",\"pressure\",\"remark\",\"speed\",\"wave\",\"water\"],\"w\":{\"local_time\":\"between to_date('"+this.dstart+"','YYYY-MM-DD') and to_date('"+this.dstart+"','YYYY-MM-DD')+interval '86399 seconds'\"}}"},url,bol)
	    .then(result => {
	      console.log(result);
	      if(result['code']==200&&result['success']==true){
	        if(result['data'].indexOf('failed') !== -1) //act
	        	this.restProvider.showAlert('Maaf Gagal...');
	        else //if(this.restProvider.loggedIn)
	        {
	        	this.trackedRoute=result['data']['val'];
			 	//this.getReklameList();
				path=[];
				for(let i=0; i<data.products.length; i++){
					path.push({ lat: this.trackedRoute[2], lng: this.trackedRoute[3] });
          		}
				//if(this.param.isactive!==0)
				this.platform.ready().then(() => {
				      this.redrawPath();
				});
		  	}
	      }
	      else
	      	this.restProvider.showAlert('akses problem');//data["error_msgs"]);
	    });
  }
*/
  onInnerPointerUp(event: PointerEvent) {
	if (event && event.preventDefault) {
		event.preventDefault();
	}
  }

  redrawPath(path) {
    if (this.currentMapTrack) {
      this.currentMapTrack.setMap(null);
    }

    if (path.length > 1) {
      this.currentMapTrack = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#ff00ff',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
      this.currentMapTrack.setMap(this.map);
    }
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
  
  iconMarker={
    url: 'assets/imgs/icons/reklame/', // custom background image (marker pin)
    scaledSize: new google.maps.Size(40, 25),
  };

  isNum(val): val is string | number {
	  return (
	    !isNaN(Number(Number.parseFloat(String(val)))) &&
	    isFinite(Number(val))
	  );
  }

reklameMap:any={
	id:'',
    water:'',
   // oil:[''],
    name:"Ganus Satu",
    description:"none",
   // vdate:[''],
    lat:0,
    lng:0,
	local_time:0,
	photo_primary:""
	//is_active:0,
  };

  infoReklame(idx,event: Event=null){
  	if(event!==null){
    	event.stopPropagation();
    }
    this.param.isactive=idx;
    this.content.resize();
  }
	      
  assignMarkers(){
  	for(let i=this.param.result.length-1;i>=0;i--){
  	
  	    if(!(this.isNum(this.param.result[i][16])&&this.isNum(this.param.result[i][17])))
  	    	continue;
  	    let res=this.param.result[i];
  	    //sUrl=sUrl.replace(/api/g, "");
  	    
        let pdetail={
		    id:res[0],
		    water:res[13],
		   // oil:[''],
		    name:res[1]==1?"Gandha Nusantara 01":"Gandha Nusantara 02",
		    description:res[15],
		   // vdate:[''],
		    lat:res[16].toFixed(8),
		    lng:res[17].toFixed(8),
			local_time:res[2]+' '+res[4],
			photo_primary:this.iconMarker.url+(res[1]==1?"ganus1":"ganus2")+".png"
			//is_active:0,
		   // foto:['']
		 // });
		 };
        console.log(pdetail);
  		// Create Marker
        const latlng = new google.maps.LatLng(pdetail.lat, pdetail.lng);
        
        const marker = new google.maps.Marker({
          map: this.map,
          position: latlng,
          icon: {url:this.iconMarker.url+'expiring'+'.png',scaledSize:this.iconMarker.scaledSize}
		 // animation: google.maps.Animation.DROP
        });
        //console.log(marker);
        marker.setZIndex(1);
        
        let textMarker=pdetail.id;//this.currencyPipe.transform(this.lib.getPriceWithFee(reklame.price), ' ', 'symbol', '1.0-2');
        
        let clr='orange';
      /*  if(curreklame.status=='active')clr='green';
        else if(curreklame.status=='expiring')clr='orange';
        else if(curreklame.status=='expired')
*/
		//clr='red';
        
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
			  	this.reklameMap=pdetail;
			  //	this.checkConsole();
			  	console.log(e);
				
			  //	this.checkConsole();
			  //	console.log(e);
		  	});
		  	//console.log(self.reklameMap);console.log('>>active:'+self.param.isactive);
        });
     }
  }
  
}
