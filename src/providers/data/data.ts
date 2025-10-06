import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DataProvider {

  constructor(public http: HttpClient) { }

  getSideMenus() {
    return [
      {
        title: 'HOME', icon: 'home_sidemenu', component: 'TabsPage'
      },
      {
        title: 'CARI', icon: 'search',
        subPages: [{
          title: 'TRIP',
          icon: 'TRIP',
          mode:'TabsPage',
          component: 'TripPage',
        }, {
          title: 'LOGBOOK',
          icon: 'LOGBOOK',
          mode:'TabsPage',
          component: 'LogbookPage'
        }, {
          title: 'CHECKLIST',
          icon: 'LIST',
          mode:'TabsPage',
          component: 'ChecklistPage'
        }, {
          title: 'EXPENSES',
     	  icon: 'EXPENSE',
          component: 'ExpensePage'
        }, {
          title: 'TRACK',
     	  icon: 'TRACK',
          component: 'TrackPage'
        }]
      },
      { title: 'TENTANG KAMI', 
      	icon: 'about_us', 
      	component: 'AboutUsPage'
        }
    ]
  }

	
  getDeals() {
    return [
      {
        image: 'assets/imgs/gallery/01.jpg'
      },
      {
        image: 'assets/imgs/gallery/02.jpg'
      },
      {
        image: 'assets/imgs/gallery/03.jpg'
      }
    ]
  }
  
  //export pdf logbook
  
	
  getDataLogPdf(dt, headheight,type) {
	let formatRow=["Larut - Malam\nMidle - Watch\n \n00:00-04:00",
		"Dini - Hari\nMorning - Watch\n \n04:00-08:00",
		"Pagi - Hari\nForenoon - Watch\n \n08:00-12:00",
		"Siang - Malam\nAfternoon - Watch\n \n12:00-16:00",
		"Petang - Hari\nDog - Watch\n \n16:00-20:00",
		"Malam - Hari\nFirst - Watch\n \n20:00-24:00"];
	let val=[]; 
	for(let i = 0,dumTgl='';i<dt.length;i++) { 
		let resDt=dt[i];
		if(dumTgl!=resDt[1]){
			dumTgl=resDt[1];
			let dtTgl=[{
			    content: 'Tanggal\nDate: ', colSpan: 1, rowSpan: 1,
			    styles: {halign: 'left',fillColor:[200,210,240],minCellHeight:headheight/4,angle:undefined}
			},{
			    content: dumTgl, colSpan: (type=='1'?21:33), rowSpan: 1,
			    styles: {halign: 'left',fillColor:[200,210,240]}
			}];
			//dtTgl[1].content=dumTgl;
			val.push(dtTgl);
			
		}
		resDt.shift();resDt.shift(); //remove shipid,tgl
		if (type=='1'){
			resDt.splice(2,0, '');
			resDt.splice(6,0,'','','');
			resDt.splice(10,0,'');
			resDt.splice(14,0,'');
			resDt.splice(17,0,'','');
			resDt.splice(20,0,'');
		}else{
			resDt.splice(1,1); //remove jam
			resDt.splice(2,0,'','','','','','','','','','','','','','','','','','','','','','');
			resDt.splice(25,0,'','');
			resDt.splice(32,0,'');
		}
		resDt[0]=formatRow[resDt[0]];		
		val.push(resDt);
		//jumlah oil log mesin
		if(type!='1'){
			if(i==dt.length-1||dumTgl!=dt[i+1][1]){
				val.push([{
				    content: '', colSpan: 34, rowSpan: 1,
				    styles: {halign: 'left',minCellHeight:headheight/4,angle:undefined}
				}]);
				val.push([{
				    content: '', colSpan:14, rowSpan:2,
				    styles: {halign: 'left',minCellHeight:headheight/2,angle:undefined}
				},{
				    content: 'Pemakaian dalam 24 jam\nConsumption in 24 hours', colSpan: 4, rowSpan: 1,
				    styles: {fontStyle: 'bold',halign: 'center'}
				},{
				    content: 'Sisa Kemarin\nPrevious remain', colSpan: 3, rowSpan: 1,
				    styles: {fontStyle: 'bold',halign: 'center'}
				},{
				    content: 'Motor Induk\nMain engine', colSpan: 2, rowSpan: 1,
				    styles: {fontStyle: 'bold',halign: 'center'}
				},{
				    content: 'Motor Bantu\nAux. engine', colSpan: 2, rowSpan: 1,
				    styles: {fontStyle: 'bold',halign: 'center'}
				},{
				    content: 'Lain - lain\nOthers', colSpan: 2, rowSpan: 1,
				    styles: {fontStyle: 'bold',halign: 'center'}
				},{
				    content: 'Sisa Sekarang\nRemain', colSpan: 2, rowSpan: 1,
				    styles: {fontStyle: 'bold',halign: 'center'}
				},{
				    content: 'Ditambah\nAdded', colSpan: 2, rowSpan: 1,
				    styles: {fontStyle: 'bold',halign: 'center'}
				},{
				    content: 'Jumlah sekarang\nRemain at 12.00', colSpan:2, rowSpan: 1,
				    styles: {fontStyle: 'bold',halign: 'center'}
				},{
				    content: '', colSpan: 1, rowSpan: 2,
				    styles: {halign: 'left',minCellHeight:headheight/4,angle:undefined}
				}]);
				let cur=isNaN(parseInt(resDt[34]))?0:parseInt(resDt[34]);
				let ume=isNaN(parseInt(resDt[35]))?0:parseInt(resDt[35]);
				let uau=isNaN(parseInt(resDt[36]))?0:parseInt(resDt[36]);
				let uot=isNaN(parseInt(resDt[37]))?0:parseInt(resDt[37]);
				let add=isNaN(parseInt(resDt[38]))?0:parseInt(resDt[38]);
				let lastOil=cur+(ume+uau+uot)-add;
				val.push([{
				    content: 'Bahan bakar DO\nDiesel oil', colSpan: 4, rowSpan: 1,
				    styles: {fontStyle: 'bold',halign: 'center'}
				},{
				    content: lastOil, colSpan: 3, rowSpan: 1,
				    styles: {halign: 'center'}
				},{
				    content: ume, colSpan: 2, rowSpan: 1,
				    styles: {halign: 'center'}
				},{
				    content: uau, colSpan: 2, rowSpan: 1,
				    styles: {halign: 'center'}
				},{
				    content: uot, colSpan: 2, rowSpan: 1,
				    styles: {halign: 'center'}
				},{
				    content: cur-add, colSpan: 2, rowSpan: 1,
				    styles: {halign: 'center'}
				},{
				    content: add, colSpan: 2, rowSpan: 1,
				    styles: {halign: 'center'}
				},{
				    content: cur, colSpan: 2, rowSpan: 1,
				    styles: {halign: 'center'}
				}]);
				val.push([{
				    content: ' ', colSpan: 34, rowSpan: 1,
				    styles: {halign: 'left',minCellHeight:headheight/4,angle:undefined}
				}]);
			}
			resDt.pop();resDt.pop();resDt.pop();resDt.pop();resDt.pop();
		}
		
	 }
	 console.log(val);
	 return val;
  }

  getHeaderLogPdf(headheight,colwidth) {
    return [
	[
		{
			content: 'Jaga\nWatch', colSpan: 1, rowSpan: 4,
			styles: {halign: 'center',valign:'middle',minCellHeight:headheight, cellWidth:Math.ceil(colwidth*4/3),angle:90}
		},
		{
			content: 'Jam\nHours', colSpan: 1, rowSpan: 4,
			styles: {halign: 'center',valign:'middle',minCellHeight:headheight,cellWidth:colwidth,angle:90}
		},
		{
			content: 'Jumlah Putaran / Menit\nRotation per minute', colSpan: 1, rowSpan: 4,
			styles: {halign: 'center',valign:'middle',minCellHeight:headheight,cellWidth:colwidth,angle:90}
		},
		{
            content: 'Kecepatan Kapal\nSpeed', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight, cellWidth:colwidth,angle:90}
        },
        {
            content: 'Haluan Kemudi\nSteered Course', colSpan: 3, rowSpan: 1,
            styles: {halign: 'center'}
        },
        {
            content: 'Variasi + Deviasi\nVar + Dev', colSpan: 2, rowSpan: 1,
            styles: {halign: 'center'}
        },
		{
            content: 'Haluan Sejati Dlm\nTrue Course In', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight, cellWidth:colwidth,angle:90}
        },
        {
            content: 'Jarak Tempuh\nDistance Run', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight,cellWidth:colwidth,angle:90}
        },
        {
            content: 'Arah & Kekuatan Angin\nWind Direct & Force', colSpan: 1, rowSpan: 1,
            styles: {halign: 'center',cellWidth:Math.ceil(colwidth*8/3)}
        },
		{
            content: 'Barometer', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight, cellWidth:colwidth,angle:90}
        },
        {
            content: 'Suhu Udara\nAir Temperature', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight,cellWidth:colwidth,angle:90}
        },
        {
            content: 'Suhu Air Laut\nSea Water Temperatur', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight,cellWidth:colwidth,angle:90}
        },
		{
            content: 'Pengukuran\nSoundings', colSpan: 4, rowSpan: 1,
            styles: {halign: 'center'}
        },
        {
            content: 'Penentuan posisi kapal secara nyata baringan2 sejati, pemeruman, catatan2, kejadian2, hukuman2, dsb.\nObservation true bearings, soundings, remarks, incidents, penalties, etc.', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',cellWidth:colwidth*4}
        },
        {
            content: 'Paraf Mualim Jaga\nSign (On Service Mate)', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight,cellWidth:colwidth,angle:90}
        },
        {
            content: 'Catatan Nahkoda\nAnnotations of the Master', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center'}
        }
	],
	[
		{
            content: 'Pedoman Standart\nStand Compass', colSpan: 1, rowSpan: 3,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4,cellWidth:colwidth,angle:90}
        },
        {
            content: 'Pedoman Kemudi\nSteer Compass', colSpan: 1, rowSpan: 3,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4, cellWidth:colwidth,angle:90}
        },
        {
            content: 'Pedoman Gasing\nGyro Compass', colSpan: 1, rowSpan: 3,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4,cellWidth:colwidth,angle:90}
        },
        {
            content: 'Pedoman Standart\nStand Compass', colSpan: 1, rowSpan: 3,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4,cellWidth:Math.ceil(colwidth*4/3),angle:90}
        },
        {
            content: 'Pedoman Kemudi\nSteer Compass', colSpan: 1, rowSpan: 3,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4,cellWidth:Math.ceil(colwidth*4/3),angle:90}
        },
        {
            content: 'Keadaan Awan\nCloudiness', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: 'Tangki (Cm)\nTank (Cm)', colSpan: 2, rowSpan: 2,
            styles: {halign: 'center'}
        },
        {
            content: 'Got2 (Cm)\nBilge (Cm)', colSpan: 2, rowSpan: 2,
            styles: {halign: 'center'}
        }
	],
	[
		{
            content: 'Keadaan Cuaca\nWeather Condition', colSpan: 1, rowSpan: 1,
            styles: {halign: 'center'}
        }
	],
	[
		{
            content: 'Keadaan Laut\nSea Condition', colSpan: 1, rowSpan: 1,
            styles: {halign: 'center'}
        },
        {
            content: 'Kiri\nPS', colSpan: 1, rowSpan: 1,
            styles: {halign: 'center',cellWidth:colwidth}
        },
        {
            content: 'Kanan\nSB', colSpan: 1, rowSpan: 1,
            styles: {halign: 'center',cellWidth:colwidth}
        },
        {
            content: 'Kirir\nPS', colSpan: 1, rowSpan: 1,
            styles: {halign: 'center',cellWidth:colwidth}
        },
        {
            content: 'Kanan\nSB', colSpan: 1, rowSpan: 1,
            styles: {halign: 'center',cellWidth:colwidth}
        }
	]];
  }

  getHeaderEngLogPdf(headheight,colwidth) {
    return [
	[
		{
			content: 'Waktu Jaga\nWatch-hours', colSpan: 1, rowSpan: 5,
			styles: {halign: 'center',valign:'middle',minCellHeight:headheight, cellWidth:Math.ceil(colwidth*4/3),angle:90}
		},
		{
			content: 'Jam Kerja Motor Induk\nMain engine running hours', colSpan: 1, rowSpan: 5,
			styles: {halign: 'center',valign:'middle',minCellHeight:headheight,cellWidth:colwidth,angle:90}
		},
		{
			content: 'Putaran / menit\nRotation per minute', colSpan: 1, rowSpan: 5,
			styles: {halign: 'center',valign:'middle',minCellHeight:headheight,cellWidth:colwidth,angle:90}
		},
		{
            content: 'Penunjuk Putaran\nRotation Counter', colSpan: 1, rowSpan: 5,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight, cellWidth:colwidth,angle:90}
        },
		{
            content: 'Posisi Handel bahan bakar\nPosition handle of fuoel oil', colSpan: 1, rowSpan: 5,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight, cellWidth:colwidth,angle:90}
        },
        {
            content: 'Suhu\nTemperature', colSpan: 20, rowSpan: 1,
            styles: {halign: 'center'}
        },
        {
            content: 'Tekanan\nPresure', colSpan: 2, rowSpan: 1,
            styles: {halign: 'center'}
        },
        {
            content: 'Motor bantu / Generator\nAuxiliary engine / Generator', colSpan: 5, rowSpan: 1,
            styles: {halign: 'center'}
        },
		{
            content: 'Masinis Jaga\nEngineer on duty', colSpan: 1, rowSpan: 5,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight, cellWidth:colwidth,angle:90}
        },
        {
            content: 'KETERANGAN LAIN - LAIN\nOther remarks', colSpan: 1, rowSpan: 5,
            styles: {halign: 'center'}
        }
	],
	[
		{
            content: 'Pendingin\nCoolers', colSpan: 4, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: 'Air Tawar Pendingin Cylinder\nCylinder cylinder water', colSpan: 7, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: 'Gas buang\nExhaust gas', colSpan: 6, rowSpan: 1,
			styles: {halign: 'center'}
        },
        {
            content: 'Kamar Mesin\nEngine room', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4, cellWidth:colwidth,angle:90}
        },
        {
            content: 'Blok Pendorong\nColar block', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4, cellWidth:colwidth,angle:90}
        },
        {
            content: 'Air Laut\nSea water', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4, cellWidth:colwidth,angle:90}
        },
        {
            content: 'Air pendingin silinder\nCylinder cooling water', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4, cellWidth:colwidth,angle:90}
        },
        {
            content: 'Minya lumas\nLubricating oil', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4, cellWidth:colwidth,angle:90}
        },
        {
            content: 'Jam Kerja\nRunning hours', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4, cellWidth:colwidth,angle:90}
        },
        {
            content: 'Tekanan M.L\nL.O pressure', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4, cellWidth:colwidth,angle:90}
        },
        {
            content: 'Suhu air pendingin\nCooling water temp.', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4, cellWidth:colwidth,angle:90}
        },
        {
            content: 'Volts', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*1/2, cellWidth:colwidth,angle:90}
        },
        {
            content: 'Amperes', colSpan: 1, rowSpan: 4,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*1/2, cellWidth:colwidth,angle:90}
        }
	],
	[
		{
            content: 'Minyak Lumas\nLub oil', colSpan: 2, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: 'Air tawar\nF. water', colSpan: 2, rowSpan: 1,
			styles: {halign: 'center'}
        },
        {
            content: 'Masuk\nInlet', colSpan: 1, rowSpan: 3,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4, cellWidth:colwidth,angle:90}
        },
		{
            content: 'Keluar cylinder No.\nOutlet cyliner No.', colSpan: 6, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: 'Cylinder No.', colSpan:6, rowSpan: 1,
			styles: {halign: 'center'}
        }
	],
	[
		{
            content: 'Masuk\nInlet', colSpan: 1, rowSpan: 2,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4, cellWidth:colwidth,angle:90}
        },
		{
            content: 'Masuk\nInlet', colSpan: 1, rowSpan: 2,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4, cellWidth:colwidth,angle:90}
        },
		{
            content: 'Masuk\nInlet', colSpan: 1, rowSpan: 2,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4, cellWidth:colwidth,angle:90}
        },
		{
            content: 'Masuk\nInlet', colSpan: 1, rowSpan: 2,
            styles: {halign: 'center',valign:'middle',minCellHeight:headheight*3/4, cellWidth:colwidth,angle:90}
        },
		{
            content: '1', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '2', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '3', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '4', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '5', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '6', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '1', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '2', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '3', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '4', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '5', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '6', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        }
	],
	[
		{
            content: '7', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '8', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '9', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '10', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '11', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '12', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '7', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '8', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '9', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '10', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '11', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        },
		{
            content: '12', colSpan: 1, rowSpan: 1,
			styles: {halign: 'center'}
        }
	]];
  }
}
