import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController, MenuController,Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { RestProvider } from '../providers/rest/rest';
import { DataProvider } from '../providers/data/data';
import { TitleCasePipe } from '@angular/common';

import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'TabsPage';
  
  pages: any;
  
  // Selected Side Menu
  selectedMenu: any;
  avatar:any={
  			welcome:'Halo, Guest',
  			email:'Silahkan login',
	    	active:null,
  		};

  constructor(
  	public platform: Platform, 
  	public statusBar: StatusBar, 
  	public splashScreen: SplashScreen,
  	
    private androidPermissions: AndroidPermissions,

    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public events: Events,
  	
    public restProvider: RestProvider, 
    public dataProvider: DataProvider,
    private titlecasePipe:TitleCasePipe) {
    
	this.androidPermissions.requestPermissions(
        [
          androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, 
          androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
        ]
      );

    this.initializeApp();

    
    // Get List of Side Menu Data
    this.getSideMenuData();
    
	events.subscribe('welcomeuser', (welcome, email,active) => {
      	this.avatar.welcome = this.titlecasePipe.transform(welcome);
  		this.avatar.email=email;
	    this.avatar.active=active;
		this.events.publish('active_tab', email,active);
	  });   
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  
  getSideMenuData() {
    this.pages = this.dataProvider.getSideMenus();
  }

  openPage(comp, index, mode) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (comp) {
			    
	    var todo={data:"{\"s\":[\"act\",\"page\"],\"w\":{\"component\":\""+comp+"\"}}"};
  
	  	this.restProvider.postRestHome(todo,'sel/menu_access')
	    .then(result => {
          console.log(result);
          if(result['code']==200&&result['success']==true){
	        if(result['data']['val'][0][0]=='none') //act
	        	this.showAlert();
            else if(result['data']['val'][0][0]=='login'&&!this.restProvider.loggedIn){
            	let modal=this.modalCtrl.create('SignInPopPage');
            	modal.onDidDismiss(() => {
				    // Navigate to new page.  Popover should be gone at this point completely
					this.menuCtrl.enable(true);
				});
		  		modal.present();
		  	}
            else {
	          var component=result['data']['val'][0][1];
          	  if(component=='none')
		        this.showAlert();
		   /*   else if(component=='FlightHistoryPage'){
			  		console.log('modal '+mode+' '+component);
			        let modal=this.modalCtrl.create(component);
				    modal.onDidDismiss(() => {
						// Navigate to new page.  Popover should be gone at this point completely
						this.menuCtrl.enable(true);
					});
					modal.present();
			  }*/
			  else
			  {
			  		console.log('nav '+mode +' '+component+(this.restProvider.loggedIn?'login':'no login')+(result['data']['val'][0][0]=='login'?' actionLogin':'no action'));
			  		if(typeof mode=='undefined')
			  			this.nav.setRoot(component);
			  		else{
			  			let rootPageParams = {'comp': component };
			  			this.nav.setRoot(mode,rootPageParams);
			  		}
			        this.menuCtrl.close();
			  }
		    }
          }
          else
            this.restProvider.showAlert('Menu akses problem');//data["error_msgs"]);
        });
    } else {
      if (this.selectedMenu) {
        this.selectedMenu = 0;
      } else {
        this.selectedMenu = index;
      }
    }
  }

  // Logout
  logout() {
  //  this.showLoader();
   /* this.restProvider.logout().then((result) => {
     
       console.log('sukses logout'); 
    }, (err) => {
  		console.log(err);
    });
    */
    
    this.events.publish('welcomeuser', 'Halo, Guest', 'Silahkan login', null);
    this.restProvider.clearStorage();
    this.nav.setRoot('TabsPage');
  }
  
  // Login
  login() {
    // this.nav.setRoot('SignInPopPage');
     let modal=this.modalCtrl.create('SignInPopPage');
     modal.onDidDismiss(() => {
		    // Navigate to new page.  Popover should be gone at this point completely
			this.menuCtrl.enable(true);
		});
	 modal.present();
  }
  
  showAlert() {
     this.restProvider.showAlert('Maaf, Tidak ada hak akses!');
  }
}
