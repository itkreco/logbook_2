
import { Component} from '@angular/core';
import { IonicPage, //ActionSheetController, //Platform, 
NavController, NavParams, ModalController } from 'ionic-angular';
//import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { RestProvider } from '../../../providers/rest/rest';
//import { DOCUMENT } from '@angular/common';
//import { get } from 'scriptjs';

//import * as Hls from 'hls.js';

import videojs from 'video.js';


@IonicPage()
@Component({
  selector: 'page-stream',
  templateUrl: 'stream.html'
})
export class StreamPage {

status=0;
defCamStatus = '0';
camStatus = [
    {
      name: 'col1',
      options: []
    }
  ];
  
arrStream=[];
  
  constructor(
//	@Inject(DOCUMENT) private document: Document,
	public navCtrl: NavController,
    public navParams: NavParams,  
    public modalCtrl: ModalController,
//    private streamingMedia: StreamingMedia,
    public restProvider: RestProvider) {
//	console.log("plugin",window.plugins);
	
  }
/*
 options: StreamingVideoOptions = {
	  successCallback: () => { console.log('Video played') },
	  errorCallback: (e) => { console.log('Error streaming') },
	  orientation: 'landscape',
	  shouldAutoClose: true,
	  controls: false
   };
   
  */ 
  player: videojs.Player=[];
//  videojsoptions={autoplay: true, controls: true, sources: [{ src: '', type: 'application/vnd.mpegurl' }]};

  bInitVidjs=[];
  
  initVidjs(urlconf,idx){
	if (this.status>=1){
		if (this.bInitVidjs[idx]=== undefined){
			this.bInitVidjs[idx]=false;
		}
		
		if (!(this.bInitVidjs[idx])){
			this.player[idx] = videojs('vid'+idx, {muted: true,autoplay: true, controls: true, sources: [urlconf]}, function onPlayerReady() {
			      console.log('onPlayerReady', this);
				//  this.player.play();	
		    });
		    this.bInitVidjs[idx]=true;
	    }
	    else{
			console.log('mulai: ', urlconf.src);
			this.player[idx].src(urlconf);
		  	this.player[idx].play();
		}
    }
  }
  
  runStream(){
	//window.cndStream.reset();
    if (this.status>=1) {
		for(let i=0; i<this.arrStream.length; i++){
			this.initVidjs({
			  src: 'http://10.8.0.'+this.arrStream[i][3]+':4080/hls/'+this.arrStream[i][2]+'vid.m3u8?watchkey=16356b9f',
			  type: 'application/vnd.apple.mpegurl'
			},i);
		}
	}else{
		this.restProvider.showAlert('Pilih lokasi streaming...');
	}
  }
  
  
 ngOnInit(){
	this.loadVesselList();
  }
  
  ngOnDestroy() {
	for(let i=0; i<this.player.length; i++){
	    if (this.player[i]) {
	      this.player[i].dispose();
	    }
    }
    this.player=[];
    this.bInitVidjs=[];
  }

 ngAfterViewInit() {

   //   get("https://cdnjs.cloudflare.com/ajax/libs/hls.js/0.4.0/hls.min.js", () => {
	 //     console.log("HLS ok...");
	//      let script = document.createElement('script');
	/*	  script.onload = () => {
		    // perform actions you need on load of the script
		    console.log("load script hls");
		  }
		  script.innerHTML = "console.log('mantap');";
		 */ 
      
 /*     let player = document.querySelector('#player');
	  console.log("load script hls",Hls);
	   if (Hls.isSupported()) {
		  console.log('==== Loading....');
		  
		  var hls = new Hls({ debug: true });
		  hls.loadSource(
		    'https://pancabuana.co.id/cctv2.mp4'
		  );
		  hls.attachMedia(player);
		  
		  hls.on(Hls.Events.MANIFEST_PARSED, function () {
			console.log("Siap Play",player);
			//player.muted = true;
	        //player.play();
		  });
		  
		  
		  hls.on(Hls.Events.ERROR, function (err) {
		    console.log('!!!');
		    console.log(err.error);
		  });
		  
		  
		//  window.Hls = Hls;
		  
		} else {
		  console.log('=============ngga support');
		}
			  
			  script.onerror = () => {
			      // handle errors
			      console.log("error script hls");
			  };*/
			//  document.body.appendChild(script);
		//  });
	};

  onChange(newValue) {
  	this.status=newValue;
  	this.loadStreamList(this.status);
  }

loadVesselList(){
  	let url='sel/vship_active'; //else url='sel/eng_logbooks';
    this.restProvider.postRestAPI({data:"{\"s\":[\"id\",\"name\"],\"w\":{\"key\":\""+this.restProvider.accessToken+"\"},\"sort\":{\"name\":\"\"}}"},url,false)
	.then(result => {
      console.log(result);
      if(result['code']==200&&result['success']==true){
            let res=result['data']['val'];
			let arr=[];
			for(let i=0;i<res.length;i++){
				arr.push({ text: 'Cam '+res[i][1], value: res[i][0] });
			}
			this.camStatus[0].options=arr;
			this.defCamStatus = '0';
			this.status=0;
      }
      else
      	this.restProvider.showAlert('akses problem');//data["error_msgs"]);
    });
  }
loadStreamList(id){
  	let url='sel/streaming'; //else url='sel/eng_logbooks';
    this.restProvider.postRestAPI({data:"{\"s\":[\"*\"],\"w\":{\"ship_id\":"+id+"},\"sort\":{\"stream_id\":\"\"}}"},url,true)
    .then(result => {
      console.log(result);
      if(result['code']==200&&result['success']==true){
            this.ngOnDestroy();
		    this.arrStream=result['data']['val'];
      }
      else
      	this.restProvider.showAlert('akses problem');//data["error_msgs"]);
    });
  }
}
