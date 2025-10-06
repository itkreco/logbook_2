import { Component, Input } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';

/**
 * Generated class for the HeaderModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header-modal',
  templateUrl: 'header-modal.html'
})
export class HeaderModalComponent {

  @Input('title') title: string; // Page Title
  @Input('subtitle') subtitle: string; // Page Subtitle
  @Input('page') page: string; // Page Subtitle
  @Input('comp') comp: string;

  constructor(
  	public navCtrl: NavController,
    public viewCtrl: ViewController,
   // public toastCtrl: ToastController
    ) { 
  }

  /**
   * Dismiss function
   * This function dismiss the popup modal
   */
  dismiss(page='') {
  	if(page=='')
    	this.viewCtrl.dismiss();
    else if(this.comp!==''){
    	this.navCtrl.setRoot(page,{'comp': this.comp });
    }
    else
    	this.navCtrl.setRoot(page);
    
  }

}
