import { Component } from '@angular/core';
import { NavController,ModalController,MenuController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';


@Component({
  selector: 'menu-category',
  templateUrl: 'menu-category.html'
})
export class MenuCategoryComponent {

  text: string;

  categories: any = [
    { icon: 'fa fa-anchor', name: 'TRIPoff', component: 'TripPage' },
    { icon: 'fa fa-book', name: 'LOGBOOK', component: 'LogbookPage' 
    },
    { icon: 'fa fa-list', name: 'LISToff', component: 'ChecklistPage'  
    },
    { icon: 'fa fa-video', name: 'STREAM', component: 'StreamPage' 
    },
    { icon: 'fa fa-money', name: 'EXPENSEoff', component: 'ExpensePage' 
    },
    { icon: 'fa fa-map', name: 'TRACK', component: 'TrackPage' 
    }
  ];

  constructor(
  	public navCtrl: NavController,
  	public menuCtrl: MenuController,
    public restProvider: RestProvider,
    public modalCtrl: ModalController) {
     }

  goToCategoryPage(page) {
  	var todo={data:"{\"s\":[\"act\",\"page\"],\"w\":{\"component\":\""+page.component+"\"}}"};
  
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
          var component=result['data']['val'][0][1]; //page
          console.log(component+' ok '+ result['data']['val'][0][0]);
      	  if(component=='none')
	        this.showAlert();
		  else
		  {
		  	this.navCtrl.setRoot(component);
		  }
	    }
      }
   //   else if(data["diagnostic"]["status"]!==200){
   //     this.restProvider.showAlert(data["diagnostic"]["error_msgs"]);
   //   }
      else
      	this.restProvider.showAlert('Menu akses gagal, check koneksi internet...');//data["error_msgs"]);
    });
  }
  
  showAlert() {
    this.restProvider.showAlert('Maaf, Anda tidak punya hak akses!');
  }

}
