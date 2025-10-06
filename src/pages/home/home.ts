
import { Component } from '@angular/core';
import { IonicPage,ModalController, MenuController,Events,,Platform} from 'ionic-angular';
import { TitleCasePipe } from '@angular/common';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
	// Contact Information 
	contactInfos = {
		email: 'cs@shiranti.co.id',
		phone1: '+62-8524-1875-444',
		tel1: '+62-8524-1875-444',
		whatsapp1: '+62-8524-1875-444',
		cs1: '+62-8524-1875-444',
		address: 'Surabaya, Indonesia'
	};
	
  avatar:any={
  			welcome:'Halo, Guest',
  			email:'Silahkan login',
	    	active:null
  		};
  		
  constructor(
    public events: Events,
	public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public platform: Platform,
    public restProvider: RestProvider,
	private titlecasePipe:TitleCasePipe) {
	
	    this.menuCtrl.enable(true); // Enable SideMenu
	    
	    events.subscribe('welcomeuser', (welcome, email, active) => {
			this.avatar.welcome = this.titlecasePipe.transform(welcome);
	  		this.avatar.email=email;
		    this.avatar.active=active;
		}); 
		
		console.log("home create");
  }

  logIn(){
	 let modal=this.modalCtrl.create('SignInPopPage');
	 modal.present();
  }

  logOut() {
    this.events.publish('welcomeuser', 'Halo, Guest', 'Silahkan login', null);
    this.restProvider.clearStorage();
  }

  ionViewDidEnter(){
	console.log("enter homepage... refresh user");
	this.restProvider.updateProfile();
  }
}

