/**
 * @author    ThemesBuckets <themebucketbd@gmail.com>
 * @copyright Copyright (c) 2018
 * @license   Fulcrumy
 * 
 * This File Represent Sign In Component
 * File path - '../../../src/pages/authentication/sign-in/sign-in'
 */

import { Component,//ViewChild//, NgZone 
	} from '@angular/core';
import { IonicPage, 
	//ModalController, 
		NavController,ViewController,  NavParams, MenuController, LoadingController, 
		//ToastController , 
		Events} from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../../providers/rest/rest';
import { Storage } from '@ionic/storage'; 


//import { Country } from '../../../providers/data/country';
//import { PhoneValidator } from '../../../validators/phone.validator';
//import {RecaptchaComponent} from 'ng-recaptcha';


@IonicPage()
@Component({
  selector: 'page-sign-inpop',
  templateUrl: 'sign-inpop.html',
})
export class SignInPopPage {

  // Sign In Form
  loading: any;
  signInForm: any;//={email:'itkreco@yahoo.com',password:'010879'};
   
  // Email Validation Regex Patter
  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  //phone: Country;
  //@ViewChild('captchaRef1')
  //recaptchaRef1: RecaptchaComponent;
 
  constructor(
  	public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    private storage: Storage, 
   // public zone: NgZone,
   // private toastCtrl: ToastController,
   // public modalCtrl: ModalController,
    private events: Events,
    public restProvider: RestProvider, 
    public menuCtrl: MenuController) {
    this.menuCtrl.enable(false); // Disable SideMenu
  }

  /** Do any initialization */
  ngOnInit() {
    this.formValidation();
  }

  /***
   * --------------------------------------------------------------
   * Form Validation
   * --------------------------------------------------------------
   * @method    formValidation    This function build a Login form with validation
   * 
   */
  formValidation() {
    this.signInForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern(this.emailPattern), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(3), Validators.required])]
    });
  }

  /**
   * --------------------------------------------------------------
   * Login Action
   * --------------------------------------------------------------
   * @method doLogin    Login action just redirect to your home page.
   * 
   * ** You can call any backend API into this function. **
   */
  doLogin(
  //captchaResponse: string=''
  ) {
  	//console.log(captchaResponse);
  	let arrinput={
  		email:this.signInForm.email,
  		password:this.signInForm.password,
  		//response:captchaResponse
  	};

    this.restProvider.login(arrinput).then((result) => {
     // this.loading.dismiss();
      console.log('result:',result);
      if(result['code']==200&&result['success']==true){
      	// Set Access Token
      	let dt=JSON.parse(result["data"]);
        this.storage.set('access_token', dt["token"]);
        this.restProvider.accessToken = dt["token"];
        // Set Access Token expiration
        const expiresAt = JSON.stringify((7200 * 1000) + new Date().getTime()); //2jam
        this.storage.set('expires_at', expiresAt);
        // Set logged in
        this.restProvider.loggedIn = true;
               // var profile = JSON.parse(dt["profile"]);
        this.storage.set('profile', dt["profile"]);
        this.restProvider.user = dt["profile"];
       
        this.events.publish('welcomeuser', 
        	this.restProvider.user['username'], 
        	this.restProvider.user['email'], 
        	true//this.restProvider.user['active']
        	);
        	
        //this.restProvider.notifUpdate();
        this.dismiss();
      }
      else{
     	this.restProvider.showAlert('problem email or pass');//result['msg']);
     //	this.recaptchaRef1.reset();
      }
    }, (err) => {
    	console.log(err);
    });
    
  }
  
  dismiss() {
	 //let data = { 'foo': 'bar' };
     this.menuCtrl.enable(true);
	 this.viewCtrl.dismiss();
  }   
 
}
