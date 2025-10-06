/**
 * @author    ThemesBuckets <themebucketbd@gmail.com>
 * @copyright Copyright (c) 2018
 * @license   Fulcrumy
 * 
 * This File Represent Deals Component
 * File path - '../../src/components/deals/deals'
 */

import { Component, } from '@angular/core';
import { DataProvider, } from '../../providers/data/data';

@Component({
  selector: 'deals',
  templateUrl: 'deals.html'
})
export class DealsComponent {

  // List of Deals
  deals: any = [];

  constructor(public dataProvider: DataProvider) { }

  /** Do any initialization */
  ngOnInit() {
    this.getDeals();
  }

  /**
   * Get Deals
   */
  getDeals() {
    this.deals = this.dataProvider.getDeals();
  }
}
