import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HeaderOneComponent } from './header-one/header-one';
import { HeaderTwoComponent } from './header-two/header-two';
import { HeaderModalComponent } from './header-modal/header-modal';

import { DealsComponent } from './deals/deals';
import { MenuCategoryComponent } from './menu-category/menu-category';

@NgModule({
	declarations: [
		HeaderOneComponent,
		HeaderTwoComponent,
		HeaderModalComponent,
		DealsComponent,
		MenuCategoryComponent
	],
	imports: [IonicModule],
	exports: [
		HeaderOneComponent,
		HeaderTwoComponent,
		HeaderModalComponent,
		DealsComponent,
		MenuCategoryComponent,
	]
})
export class ComponentsModule { }
