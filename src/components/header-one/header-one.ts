import { Component, Input } from '@angular/core';
import { NavController, ViewController, ModalController,MenuController,Events } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'header-one',
  templateUrl: 'header-one.html'
})
export class HeaderOneComponent {

  @Input('title') title: string; 
  constructor(
  	public navCtrl: NavController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public menuCtrl: MenuController,
    public events: Events,
    public restProvider: RestProvider) { 
    }
/*
   updateProfile() {
  	if(this.restProvider.accessToken&&this.restProvider.loggedIn){
  		
  		this.restProvider.postRestAPI({data:"{\"s\":[\"username\",\"email\"],\"w\":{\"email\":\""+this.restProvider.user["email"]+"\",\"is_active\":true}}"},'sel/auth_user',false)//userInfo()
  		.then((result) => {
        	console.log(result);
		    if(result['code']==200&&result['success']==true){
	      		this.events.publish('welcomeuser', 
		        	result['data']['val'][0][0],//['username'], 
		        	result['data']['val'][0][1],//['email'], 
		        	true//result['user']['active']
		        );
	      	}
	      	else
	     		this.restProvider.showAlert('Data kurang sesuai');//result['msg']);
    	}, (err) => {
    		console.log(err);
	    });
  	}
  }
*/
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
