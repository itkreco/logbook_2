import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams,Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { FreklamePage } from '../freklame/freklame';
import { ReklameListPage } from '../home/reklame-list/reklame-list';
import { RestProvider } from '../../providers/rest/rest';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  homePage:any = HomePage;
  addPage = FreklamePage;
  listPage = ReklameListPage;
  disabledtab:boolean=true;
  constructor(
  	public navCtrl: NavController, 
  	public modalCtrl: ModalController, 
    public events: Events,
  	public restProvider:RestProvider,
  	public navParams: NavParams) {
  	    let comp=this.navParams.get('comp');
  	    console.log('comp '+comp);
  	    if(typeof comp!='undefined')
  			this.homePage = comp;
	
		events.subscribe('active_tab', (email,active) => {
			if(email.indexOf("pengawas") !== -1||active!==true){this.disabledtab=true}else{this.disabledtab=false}
		});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

 /* ngAfterViewInit(){
	document.getElementById('tab-t0-1').addEventListener('click', event => {
		console.log('halo tab new log');
    });
  }*/
}
