// A program ürlapkitöltő része:

// Kinyerjük az adatot a localStorage-ből
   //storage-slot azonosítása:
   function  storageSlotAzonosito()
   {let storedIndexArr = [
   Object.keys(localStorage).indexOf("mefigyMegNemVolt"),
   Object.keys(localStorage).indexOf("gypMegNemVolt"),
   Object.keys(localStorage).indexOf("pszichoMegNemVolt"),
   ]
   // amelyik index nincs benne, az kell nekem!
   let ezkellNekem;
   if(!storedIndexArr.includes(0)){ezkellNekem = 0}
   else if(!storedIndexArr.includes(1)){ezkellNekem = 1}
   else if (!storedIndexArr.includes(2)){ezkellNekem = 2}
   else if (!storedIndexArr.includes(3)){ezkellNekem = 3};
   return ezkellNekem; 
   }


let [vezeteknev, utonev,vizsgDatum, diagnozis, osztalyfok, hanyadikVizsg,megfigyelesVoltE, gyogyPed,pszichologus,OA, KerelmezoFehId,beErkezett, mikorFigyelteMeg,fvTaneve] = JSON.parse(localStorage[Object.keys(localStorage)[storageSlotAzonosito()]]);
if(!vezeteknev){alert('Előbb be kell tölteni adatot az [ADATBETOLTO]-vel, csak utána lehet űrlapot kitölteni! Használd az [ADATBETOLTO]-t!')};


 // ŰRLAPOK KITÖLTÉSE:
 
 function Zoli(){
    urlapAzonosito()

   }
 
 
 //Űrlap beazonosító funkció:
   function urlapAzonosito(){
    if(document.getElementsByTagName('h1').length>0){
       let key = document.getElementsByTagName('h1')[0].textContent.split('-')[0];
       
       switch (key) {
          case 'Ellátott keresése':
             console.log('Ellátott keresése');
             ellatottKeresese()
             break;
       
       case 'Törzslap felvétele':
             console.log('Törzslap felvétele');
             torzslapFelvetele();
          break;

       case 'Törzslap létrehozás':
       ujTorzslap();
       break;

          case 'Törzslap ':
          if(document.querySelector('.modal-title').textContent==='Új ellátás hozzáadása' && (!document.getElementsByTagName('h3')[0] || document.getElementsByTagName('h3')[0].textContent.split(' ').includes("forgalmi"))) /* az utóbbi 'h3' feltétel EDDA esetében lehetetlenné teszi a felismerést, nála ki kell venni*/
          {ujEllatasHozzaAdasa()} else if (document.getElementsByTagName('h3')[0].textContent.split(' ').includes('bizottsági')){
             console.log('hozzáadható új tevékenység!')
             egybekitolt()
          }
          break;

          default:
             alert('Nincs felismerhető kitölthető adatlap! Nyiss meg egy adatlapot és próbáld újra!')
             break;
       }

    }
 }
    
 // Ellátott keresése:
 function ellatottKeresese(){
    document.getElementById('Vezeteknev').value=vezeteknev;
    document.getElementById('Keresztnev').value=utonev;
    document.getElementById('Fhely').value='1999998574';
 }

 //Törzslap felvétle:
 function torzslapFelvetele(){
    document.getElementById('ViseltNev_VezetekNev').value=vezeteknev;
    document.getElementById('ViseltNev_KeresztNev').value=utonev;
 }

// Új törzslap:
function ujTorzslap(){
   document.getElementById('Szemely_IlletekesJarasId').value='109';
   //nemzetiségi hovatartozás:
   document.getElementById('Szemely_NemzetisegiHovatartozas').nextElementSibling.click();
   document.querySelector(`input[value="NEMNYILAT"]`).click();
   document.getElementById('Szemely_NemzetisegiHovatartozas').nextElementSibling.click();
   document.getElementById ('KapcsolatFelvetelDatuma').value = vizsgDatum;
   document.getElementById ('BejegyzesbevetelDatuma').value = beErkezett;
   document.getElementById ('FeladatellatasiHely').value = '1999998574';
}

 // Új ellátás hozzáadása:
 function ujEllatasHozzaAdasa(){
    
    setTimeout(()=>{szakertoiKivalasztasa()},400);
    setTimeout(()=>{UEhozzadasa()},700);
    setTimeout(()=>{szakember()},1000);
    setTimeout(()=>{intezmenyKod()},1000);

 }

  //szakértői ellátás kiválasztása
  function szakertoiKivalasztasa(){
    document.querySelector('option[value="SZAKERTO"]').selected = true;
    // az onchange event triggerelése az aktív elemen:
    $(document.getElementById('Szakterulet')).trigger("change");}

  //ellátó szakember kielölés 
  function szakember(){document.getElementById('EllatoSzakemberek').nextElementSibling.click();
  document.querySelector(`input[value="${gyogyPed}"]`).click();
  document.querySelector(`input[value="${pszichologus}"]`).click();
  if(megfigyelesVoltE){document.querySelector(`input[value="${megfigyelesVoltE}"]`).click();};
  document.getElementById('EllatoSzakemberek').nextElementSibling.click();
}

 function intezmenyKod(){
 document.getElementById('IntezmenyOmkod').value = OA;
 $('#IntezmenyOmkod').trigger('change');}

 function UEhozzadasa(){  
    document.getElementsByName('Mod')[0].value = 'EGY';
    document.getElementById('SzakertoiSzint').value = 'JARASI';

    //aktuális
    if(hanyadikVizsg==='aktuális'){document.getElementById('EllatasTipus').value ='ELLV1'};
    //fv
    if(hanyadikVizsg=== 'fv'||hanyadikVizsg==='rendkívüli fv'){document.getElementById('EllatasTipus').value ='ELLV2'};
    //OH kirendelés
    if(hanyadikVizsg==='OH kirendelés'){document.getElementById('EllatasTipus').value='ELLTIP1'};
    document.getElementById('EllatasbaVetelDatuma').value = vizsgDatum;
    document.getElementsByName('FehId')[0].value = '1999998574';
    document.getElementById('KerelemDatuma').value = beErkezett;
    setTimeout(()=>{kerelmezoIDBeallito()},500);
 
    //intézménytípus választása:
  if(osztalyfok==='ovodába járó'){document.getElementById('IntezmenyTipus').value = 'OVODA'} else if (osztalyfok<9) {
    document.getElementById('IntezmenyTipus').value = 'ATLISK'};

    //osztályfok:
    if(osztalyfok==='ovodába járó'){document.getElementById('EllatottOsztalyFoka').value = 'OVODAS'} 
    else if (typeof(osztalyfok) ==='number') {
       document.getElementById('EllatottOsztalyFoka').value = osztalyfok+'EVF'}
    else if(!osztalyfok){alert('Az osztályfokot kézzel kell kiválasztani!')};
    document.getElementById('VizsgalatraJelentkezesModja').value = 'ELLM1';
    document.getElementById('Gyakorisag').value= 1;
   
    //felülvizsgálat tanéve:
    if(diagnozis==='SNI'){document.getElementById('FelulvizsgalatTanev').value='FVT6'} 
    else if(diagnozis=== 'nem-BTM'){document.getElementById('FelulvizsgalatTanev').value='FVT5'}
    else if(hanyadikVizsg==='fv' || hanyadikVizsg==='aktuális') { 
      document.getElementById('FelulvizsgalatTanev').value=fvTaneve;
    }
 }

 function kerelmezoIDBeallito()
 {if(KerelmezoFehId){document.getElementById('KerelmezoFehId').value = KerelmezoFehId} else
 {alert('Kézzel kell kiválasztani [A vizsgálatot / ellátást kezdeményező feladatellátási hely]-et! Bocsi!')}}
 
 

 // Tevékenység:
 
function megnyit (){
 document.getElementById('tevekenysegModal').click();}
 
function kitolt(gyp_1_VAGY_pszicho_2){ 
 
 console.log("Az időpontot így kell  beírni! Így: \'2022.09.13\'")
 document.getElementsByName('Kategoria')[0].value = hanyadikVizsg==='aktuális' ? 'ALLAPOTM' : 'KONTROLL';   
 document.getElementsByName('FehId')[0].value = '1999998574'; 
 document.getElementById('Erintettek').nextElementSibling.click();
 document.querySelector(`input[value="TAN"]`).click();
 document.getElementById('Erintettek').nextElementSibling.click();
 document.getElementById('Megjelentek').checked=true;
 document.getElementById('Kezdete').value= gyp_1_VAGY_pszicho_2==3? mikorFigyelteMeg : vizsgDatum;
 document.getElementById('Idotartama').value= hanyadikVizsg==='OH kirendelés'? 60 : 180;   

 // Szövegek kitöltése
 let leirasSzoveg, megjegyzesSzoveg;
 
 if(gyp_1_VAGY_pszicho_2===1){leirasSzoveg = "Gyógypedagógiai vizsgálat"; 
   typeof(osztalyfok)==='number'? megjegyzesSzoveg= "Iskolás " : megjegyzesSzoveg= "Óvodás ";
   megjegyzesSzoveg += "képesség- és készségfelmérés";} 
 else if(gyp_1_VAGY_pszicho_2===2){leirasSzoveg = "Pszichológiai vizsgálat"; megjegyzesSzoveg="Képességfelmérés";}
 else if(gyp_1_VAGY_pszicho_2===3){ leirasSzoveg = "Pszichológiai megfigyelés"; megjegyzesSzoveg ='';}

  document.getElementById('Leiras').value= leirasSzoveg; 
 document.getElementById('Megjegyzes').value= megjegyzesSzoveg; 
  
 //ellátó szakember kijelölése 
  // abban az esetben fusson csak le, ha több mint egy ellátó szakember van:
  let hanySzakemberVan = 0;
  if(pszichologus){hanySzakemberVan++};
  if(gyogyPed){hanySzakemberVan++};
  if(megfigyelesVoltE){hanySzakemberVan++};
  
  if(hanySzakemberVan>1){
   console.log('volt több szakember, ezért lefutott a kattintgatós rész');

   document.getElementById('TevekenysegSzakemberek').nextElementSibling.click();
 if(gyp_1_VAGY_pszicho_2===1){document.querySelector(`input[value="${gyogyPed}"]`).click()}
 else if(gyp_1_VAGY_pszicho_2===2){document.querySelector(`input[value="${pszichologus}"]`).click()}
 else if(gyp_1_VAGY_pszicho_2===3){document.querySelector(`input[value="${megfigyelesVoltE}"]`).click()};
 document.getElementById('TevekenysegSzakemberek').nextElementSibling.click();
} else{console.log('nem fut le')}

// Ideje likvidálni a felvitt tevékenységet a várólistáról
if(gyp_1_VAGY_pszicho_2==2){localStorage.pszichoMegNemVolt = 'hamis';}
if(gyp_1_VAGY_pszicho_2==1){localStorage.gypMegNemVolt = 'hamis';}
if(gyp_1_VAGY_pszicho_2==3){localStorage.mefigyMegNemVolt = 'hamis';}

 //tevékenység helye: 
 document.getElementById('Helyek').nextElementSibling.click();
 document.querySelector(`input[value=${gyp_1_VAGY_pszicho_2<3? 'UGYVITELIH' : 'TELEPH' }]`).click()
 document.getElementById('Helyek').nextElementSibling.click();

 //document.querySelector('#SaveAnyway').nextElementSibling.click()
 //document.querySelector('#SaveAnyway').nextElementSibling.click()
 
  }
 
 function egybekitolt(){
  if(Boolean(localStorage.gypMegNemVolt != 'hamis' && gyogyPed)||Boolean(localStorage.pszichoMegNemVolt != 'hamis' && pszichologus) ){
      megnyit();
      if(pszichologus && localStorage.pszichoMegNemVolt === 'igaz'){console.log('van pszichológus, felvisszük!'); setTimeout(()=>{kitolt(2)},1500); }
      else if(localStorage.mefigyMegNemVolt === 'igaz' && megfigyelesVoltE){console.log('kell megfigyelés! Az jön!'); setTimeout(()=>{kitolt(3)},1500); }
      else if(localStorage.gypMegNemVolt === 'igaz'){console.log('nincs pszichológus, GYP jön!'); setTimeout(()=>{kitolt(1)},1500); }
      } 
   else if(localStorage.gypMegNemVolt === 'hamis') {lezaras()}
   else if(!gyogyPed && !megfigyelesVoltE && localStorage.pszichoMegNemVolt === 'hamis') {lezaras()};
}


function lezaras(){
   let vizsg =new Date(vizsgDatum);
   let megfigy = new Date(mikorFigyelteMeg);
   
   document.querySelector('a[title="Ellátás lezárása"]').click();
      
   function lezarasIdopontValaszto(){
      if(megfigyelesVoltE && vizsg<megfigy){document.getElementById('LezarasDatuma').value = mikorFigyelteMeg;} 
      else {document.getElementById('LezarasDatuma').value = vizsgDatum;}}
         
   setTimeout(()=>{lezarasIdopontValaszto()},500);
}

// KEZDD!
 Zoli();