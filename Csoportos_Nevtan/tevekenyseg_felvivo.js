// Variables
    let szakember, oktataisInt, elsoAlkalomDatum, foglDatumok, foglTemak, fejlTeruletek, oraHossza, fejlTerv;
    foglDatumok = JSON.parse(localStorage.CS_fogldatumok);
    
// Fő LEFUTTATANDÓ FUNKCIÓ!    
function kezdjukMarEl(){
  [csoportNev,csoportURL,szakember,oktataisInt,ellatasNapja,oraHossza,fejlTerv] = JSON.parse(localStorage.NT_aktualis_csoport);
      
    // Feltéve, hogy a csoportok felvételénél vagyunk katt a tevékenységekre:
    if(/inyr.hu\/Csoport\/Adatlap/.test(window.location.href)
    && document.getElementsByTagName('h2')[0].textContent.split('-').includes('Csoport adatlap '))
{document.querySelectorAll('h4[class="fa fa-comments-o fa-2x"]')[0].parentElement.click()
  //Ha nincs meghatározva a szakember, akkor használja a csoport létrehozójának adatát
  if(!szakember[0]){tobbSzakemberMeghatarozo();}  
}
//különben hibaüzenet és return:
else {alert ('Kérlek nyisd meg a Csoport adatlapját annak a csoportnak, ahová tevékenységet akarsz felvenni, és próbáld újra!'); return;}; 

setTimeout(()=> {folyamatKoveto()},3000);

  }

  
  function maigHianyzoTevekenysegek(){
    let MA = new Date();
    let eddigFelvittAlkalmakGlobal = felvittDatumGyujto()
  let uccsoFelvittAlkalom = new Date(eddigFelvittAlkalmakGlobal[0]);
if(MA>uccsoFelvittAlkalom ){
    //generáljunk dátumokat
      let hianyzoAlkalmak = datumArrKeszito(kovetkezoAdottNap(uccsoFelvittAlkalom,ellatasNapja),MA);
      //az első elemet töröljük, mert azt már felvittük
      hianyzoAlkalmak.shift();
    // generáljunk fejlesztési tervet:
      let egeszTanev = eddigFelvittAlkalmakGlobal.concat(hianyzoAlkalmak);
      //fejlesztési terv egész évre:
        let tanmenet = fejlTeruletValaszto(egeszTanev);
        console.log('teljes tanmenet hossza: '+ tanmenet.length)
      // csak a kimaradt időszakra:
      let kimaradtTanmenet = tanmenet.slice((eddigFelvittAlkalmakGlobal.length));  
      return kimaradtTanmenet;
    }
    
}

function szakemberMeghatarozo(){let kinyertNev = document.querySelectorAll('div.col-lg-6 div[class="col-lg-6"]')[9].textContent.match(/[A-Z].+/)[0];
    document.querySelectorAll('h4[class="fa fa-comments-o fa-2x"]')[0].parentElement.click();
    document.getElementById("tevekenysegModal").click();
      function szakemberKodKinyero(){
        szakember = document.querySelector(`label[title="${kinyertNev}"] input`).value;
      }
      function tevekenysegModalBezaro(){document.querySelector('div.modal-header button').click()}
      setTimeout(()=>{szakemberKodKinyero()},500);

      setTimeout(()=>{tevekenysegModalBezaro()},700);
}

function tobbSzakemberMeghatarozo(){let kinyertNevek = document.querySelectorAll('div.col-lg-6 div[class="col-lg-6"]')[13].textContent.match(/[A-Z].+/)[0].split(', ');
  console.log('kinyertNevek: '+kinyertNevek)
  function szakemberKiegeszito(){localStorage.setItem('NT_aktualis_csoport',JSON.stringify([csoportNev,csoportURL,szakember,oktataisInt,ellatasNapja,oraHossza,fejlTerv]));}

    
    document.querySelectorAll('h4[class="fa fa-folder-open fa-2x"]')[0].parentElement.click();
    document.getElementById("tevekenysegModal").click();
     
    function szakemberKodKinyero(i){szakember.push(document.querySelector(`label[title="${kinyertNevek[i]}"] input`).value);}
    function tevekenysegModalBezaro(){document.querySelector('div.modal-header button').click()
    document.querySelectorAll('h4[class="fa fa-comments-o fa-2x"]')[0].parentElement.click()  
    }
    
        szakember = [];
        for(let i = 0; i<=kinyertNevek.length;i++){
          if(i<kinyertNevek.length){setTimeout(()=>{szakemberKodKinyero(i)},i*400+500);}
          if(i===kinyertNevek.length){setTimeout(()=>{szakemberKiegeszito(); tevekenysegModalBezaro()},i*400+900);}    
        }
        
}

// Az a funkció, ami ellenőrzi, hogy hol tart a a felvitel folyamata:
function folyamatKoveto(){
  //Hogyan állunk a felvitt tevékenységekkel?
    let MA = new Date();
    let eddigFelvittAlkalmakGlobal = felvittDatumGyujto()
    let uccsoFelvittAlkalom = new Date(eddigFelvittAlkalmakGlobal[0]);
    let tanevUtolsoNapja = new Date(`${MA.getFullYear()}.06.16`);
    // Az adott dátum a tanév időtartamában van?
    function tanevbenVanE(datumom){return Boolean(datumom.getMonth()<5 || (datumom.getMonth()==5 && datumom.getDate<15) || datumom.getMonth()>8)}
    
    // az utolsó felvitt alkalom óta kimaradt alkalmak  
      //Ha a tanévben vagyunk még, akkor lehet használni a MA-t, ha már nem akkor a tanév végét kell használni:
          let hianyzoAlkalmak; 
          //Ha volt utolsó felvitt alkalom (tehát legalább 1 felvitt alkalom):
          if(uccsoFelvittAlkalom != 'Invalid Date'){
          hianyzoAlkalmak = datumArrKeszito(kovetkezoAdottNap(uccsoFelvittAlkalom,ellatasNapja), tanevbenVanE(MA)? MA : tanevUtolsoNapja);
          //az első elemét töröljük, mert azt már felvittük (az az uccsoFelvittAlkalom)
          if(uccsoFelvittAlkalom.getTime() == kovetkezoAdottNap(uccsoFelvittAlkalom,ellatasNapja).getTime()){
          hianyzoAlkalmak.shift();
          }
          console.log('hianyzoAlkalmak: '+ hianyzoAlkalmak)}
  
      

      //folyamat állás kiválasztása
  switch (localStorage.CS_folyamat_koveto) {
    case 'választási szakasz':
    console.log('választási szakasz');

      // Nincs felvitt alkalom még:
      let kezdoDatum,befejezoDatum;  
          // Pontosítsuk a tanévet, amiről szó van: 
            if(MA.getMonth()<8){kezdoDatum = szeptemberElsoAlkalma((MA.getFullYear()-1))}
            else {kezdoDatum = szeptemberElsoAlkalma(MA.getFullYear())};
      if(eddigFelvittAlkalmakGlobal.length ==0){
         if(confirm(`Ehhez a csoporthoz egyetlen tevékenység sem került még felvitelre. Szeretnél ${kezdoDatum.toLocaleString("hu")} és ${MA.toLocaleString("hu")} között felvinni egy alklalmat minden héten a ${hetNapjaSzoveggel(ellatasNapja)}i napra?`) ){
          befejezoDatum = MA;
          foglDatumok = datumArrKeszito(kezdoDatum,MA)
          localStorage.setItem('CS_fogldatumok',JSON.stringify(foglDatumok));
          foglTemak = fejlTeruletValaszto(foglDatumok);
          localStorage.setItem('CS_folyamat_koveto','tevékenység felvitel');
          teljesTanev(foglDatumok);
          return;
         }
      }
      // vannak felvitt alkalmak, ajánljuk hogy többet is felvigyünk egyszerre:
      else if(confirm(`Jelen csoportnál ${/*Első tevékenység ideje*/eddigFelvittAlkalmakGlobal[eddigFelvittAlkalmakGlobal.length-1]}. és ${/*legutolsó tevékenység ideje*/eddigFelvittAlkalmakGlobal[0]}. 
      között ${eddigFelvittAlkalmakGlobal.length} tevékenység lett bejegyezve. Szeretnél a máig eltelt időszakra felvinni egy alklalmat minden héten a ${hetNapjaSzoveggel(ellatasNapja)}i napra?` )) {
        //Válasszunk, hogy hány alkalmat vigyünk fel:
        if(Boolean(MA>uccsoFelvittAlkalom && tanevbenVanE(MA)) ||
       Boolean(!tanevbenVanE(MA) && tanevUtolsoNapja>uccsoFelvittAlkalom)){
        //Több alkalom is hiányzik.
        if(hianyzoAlkalmak.length>1){
          if(confirm(`${hianyzoAlkalmak.length} alkalom hiányzik még! Felviszed?`)){
            foglDatumok = hianyzoAlkalmak;
            localStorage.setItem('CS_fogldatumok',JSON.stringify(foglDatumok));
            foglTemak = maigHianyzoTevekenysegek();
            teljesTanev(hianyzoAlkalmak)
            localStorage.setItem('CS_folyamat_koveto','tevékenység felvitel');
          }
          else {return;}
        }
        else if(hianyzoAlkalmak.length===1){
          if(confirm('Csak egy alkalom hiányzik. Felviszed most?')){
            foglDatumok = hianyzoAlkalmak;
            localStorage.setItem('CS_fogldatumok',JSON.stringify(foglDatumok));
            foglTemak = maigHianyzoTevekenysegek();
            teljesTanev(foglDatumok);
            localStorage.setItem('CS_folyamat_koveto','tevékenység felvitel');
          
          }
          else {return;}
        }
        
        
        //////////////////////////////////////////////////////
        }
      
    }
    
    function szeptemberElsoAlkalma(refenciaEv){
      let datumToReturn;
      for(i=1;i<8;i++){
  let teszteltDatum = new Date(`${refenciaEv}.09.${i}`);
  if(teszteltDatum.getDay()===ellatasNapja){datumToReturn=teszteltDatum;}}
      return datumToReturn;
  }
    break;
  
    case 'tevékenység felvitel':
      jelenletiAdatokKattintos()
    break;

  case 'ellenőrző szakasz':
    
    console.log('jelenlétiívek kitöltése'); 
    jelenletiAdatokKattintos();
    break;

  case 'kész':
    console.log('A felvitel elkészült!')
    alert('Az ebben a munkamenetben a felvitel kész. Újabb munkamenet kezdéséhez először újra meg kell nyitnod a csoportkezelő menüben egy csoportot.');
    location.reload();
 
  default:
    alert('Előbb ki kell választani a csoport kiválasztó/felvivő alkalmazással, csak utána lehet felvinni dolgokat!');
    break;
}

}

// Egy funkció, ami kiolvassa az összes eddig felvitt tevékenység dátumát:
function felvittDatumGyujto(){
  //odanavigálunk a tevékenységekhez:
  document.querySelectorAll('h4[class="fa fa-comments-o fa-2x"]')[0].parentElement.click();
  let toReturn =[];
  for(let i = 0; i<document.querySelectorAll('#tevekenyseg-lista td').length; i+=5)
  { if(/\d{4}\.\d{2}\.\d{2}/.test(document.querySelectorAll('#tevekenyseg-lista td')[i].textContent)){
    //console.log(i +'. dik: '+ document.querySelectorAll('#tevekenyseg-lista td')[i].textContent)
  toReturn.push(document.querySelectorAll('#tevekenyseg-lista td')[i].textContent.slice(0,-1)); 
  } else {i += 100}
}  
return toReturn;
};

function kovetkezoAdottNap(datumom,ellatasNapja){
  let belsoDatum;
  if(typeof(datumom) =='object'){ belsoDatum = new Date(datumom.toLocaleString().split(' ')[0]+datumom.toLocaleString().split(' ')[1]+datumom.toLocaleString().split(' ')[2])} 
  else if(typeof(datumom) =='string'){ belsoDatum = new Date(datumom)}
  console.log(belsoDatum)

  let egyNapEgyOraMsban = 25*60*60*1000;
  let dateToReturn;
  for(let i = 0; i<7;i++){
    
    dateToReturn = new Date(belsoDatum.getTime() + i*egyNapEgyOraMsban)
    console.log(i+': '+ dateToReturn.toLocaleString('hu'))
    if(dateToReturn.getDay()==ellatasNapja){return dateToReturn;}
  }
}

 //Sikerült-e minden alkalmat felvinni, és ha nem, melyiket nem?
function utanToltes(){    
let mindenFelvittDatum = felvittDatumGyujto();
let kimaradtAlkalmakArr = foglDatumok.filter(date=>!mindenFelvittDatum.includes(date));
      function koviSzakaszbaLepes(){alert('Folytassuk a JELENLÉTI ÍVEKKEL!')}       

      function utanTolto (datumokArray){
        for (let index = 0; index <= datumokArray.length; index++) {
        if(index<datumokArray.length){setTimeout(()=>{egyAlkalomFelvitele(kimaradtAlkalmakArr[index],foglTemak[Math.floor(Math.random()*(foglTemak.length-2))+1])}, 3000*index +500);}
        if(index===datumokArray.length){setTimeout(()=>{koviSzakaszbaLepes()}, 3000*index +500);} 
      }}

    if(kimaradtAlkalmakArr.length>0){
        if(confirm(`A lassú internet, vagy az INYR csuklása miatt nem sikerült felvinni ${kimaradtAlkalmakArr.length} alkalmat. Újrapróbáljuk most?`))
        {utanTolto(kimaradtAlkalmakArr)} else {koviSzakaszbaLepes()};
        
    };
  }


// tevékenységek felvitele:
  function megnyit() {
        document.getElementById("tevekenysegModal").click();
      }


function tobbSzakemberKivalszto(){document.getElementById('TevekenysegSzakemberek').nextElementSibling.click();
      for(let j=0;j<szakember.length;j++){  
      document.querySelector(`input[value="${szakember[j]}"]`).click();
      }
      document.getElementById('TevekenysegSzakemberek').nextElementSibling.click();
    }      

function kitolt(idopont,leiras) {
        console.log("Foglalkozás felvitele a következő időponttal: "+idopont);
        document.getElementsByName("Kategoria")[0].value = "BEAVATKOZ";
        document.getElementsByName("FehId")[0].value = "1999998574";
        document.getElementById("Kezdete").value = idopont;
        document.getElementById("Idotartama").value = oraHossza;
        document.getElementById("Leiras").value = leiras;
        document.getElementById("Megjegyzes").value = "";
        tobbSzakemberKivalszto();
        document.getElementsByName("Helyek")[0].value = oktataisInt;
         
        document.querySelector('i[class="fa fa-save"]').parentElement.click()
      }


function jelenletiAdatokKattintos(){
  let k = +localStorage.CS_kovi_jelenleti;
  if(k==2){
    document.querySelectorAll('h4[class="fa fa-comments-o fa-2x"]')[0].parentElement.click();
    setTimeout(()=>{document.querySelectorAll('i[class="fa fa-edit"]')[2].click()},500);
    setTimeout(()=>{document.querySelector('a[title="Új jelenléti adatok hozzáadása"]').click();console.log('Kézzel kell kattintani az összes kijelölése gombra!');},1000);
    setTimeout(()=>{document.querySelector('a[title="Összes hozzáadása"]').addEventListener('click',jelenletiAdatokKattintos); document.querySelector('a[alt="Összes hozzáadása"]').style.backgroundColor = "purple"},1500);

  }
  else if(k<=(foglDatumok.length+2)){ 
  document.querySelector('button[data-dismiss="modal"]').click();
  setTimeout(()=>{document.querySelector('i[class="fa fa-backward"]').parentElement.click()},500);
  setTimeout(()=>{document.querySelectorAll('i[class="fa fa-edit"]')[k].click()},1000);
  setTimeout(()=>{document.querySelector('a[title="Új jelenléti adatok hozzáadása"]').click();console.log('Kézzel kell kattintani az összes kijelölése gombra!');},1500);
  
  setTimeout(()=>{document.querySelector('a[title="Összes hozzáadása"]').addEventListener('click',jelenletiAdatokKattintos),document.querySelector('a[alt="Összes hozzáadása"]').style.backgroundColor = "purple"},2000);
  if(k==(foglDatumok.length+2)){alert('Az ebben a munkamenetben felvitt csoportos tevékenységek jelenléti ívei elkészültek. Újabb munkamenet kezdéséhez először újra meg kell nyitnod a csoportkezelő menüben egy csoportot.');
  localStorage.setItem('CS_folyamat_koveto','kész');
    location.reload();
    return;
                                }
  }
  
  k++;
  localStorage.setItem('CS_kovi_jelenleti',`${k}`);
 
}

function egyAlkalomFelvitele(idopont,leiras){
        
        megnyit();
        setTimeout(()=>{kitolt(idopont,leiras)},1500);
        //összesen 4000ms egy felvitele!
      }

  function teljesTanev (datumokArray){
        for (let index = 0; index <= datumokArray.length; index++){
      if(index<datumokArray.length){setTimeout(()=>{egyAlkalomFelvitele(foglDatumok[index],foglTemak[index])}, 3000*index +500);}
        if(index === (datumokArray.length)){
          setTimeout(()=>{utanToltes()}, 3100*index +1500);
          console.log('ellenőrző szakasz'); 
          localStorage.setItem('CS_folyamat_koveto','ellenőrző szakasz');
        }
     }    
  }
    

      fejlTeruletek = {
     ovoda: [
      ['Csoport megszervezésével kapcsolatos feladatok','Szervezési feladatok'],['Szociális készségek (feladattudat, feladattartás, figyelem, szabálykövetés) fejlesztése.','feladattudat, feladattartás fejlesztése'],
      ['nagymozgások ügyesítése', 'alapmozgások koordinációjának fejlesztése', 
      'egyensúly-gyakorlatok','finommotoros tevékenység alakítása','kéz és ujjak ügyesítése', 'vonalvezetés gyakorlása' ],
      ['mozgásutánzás ügyesítése', 'a két testfél mozgásának összerendezése', 'saját mozgás észlelésének pontosítása', 'a látás és a mozgás összerendezése', 'a szem-kéz szem-láb koordináció javítása',
      'ritmusérzék fejlesztése', 'ritmus-mozgás-beszéd koordinálása'],
      
      ['Észlelés fejlesztése: Taktilis, kinesztéziás ingerek feldolgozása, megkülönböztetése','Észlelés fejlesztése: Akusztikus, vizuális ingerek feldolgozása, megkülönböztetése', 'Észlelés fejlesztése: az ismeretek feldolgozásának segítése az érzékelés, észlelés folyamatain keresztül'],
      
      ['látásérzékelés és észlelés fejlesztése', 'differenciálás, diszkrimináció, azonosságok, különbözőségek felismertetése', 'alaklátás-formaállandóság fejlesztése', 'alak-háttér felfogás fejlesztése', 'vizuális minta helyes követése', 'vizuális szeriális készség alakítása', 'vizuális megfigyelő és elemző készség fejlesztése'],
      
      ['hallásészlelés és érzékelés fejlesztése','hallási figyelem, diszkrimináció, differenciálás', 'akusztikus szerialitás', 'tagolási, szótagolási és hanganalizáló gyakorlatok'],
      
      ['téri helyzetek, viszonylatok észlelésének alakítása', 'téri fogalmak bővítése', 'idői fogalmak kialakítása',' időrendiség észrevevése', 'fogalmak használata'],
      
      ['jobb-bal irányok szerinti tájékozódás saját testen-térben-síkban', 'tárgyak egymáshoz való viszonyának elemzése', 'relációs fogalmak tudatosítása a megértés és kifejezés szintjén'],
      
      ['tartósság, intenzitás, akaratlagos, szelektív és megosztott figyelem terjedelmének növelése', 'megfigyelőképesség fejlesztése', 'Gyors reagálóképesség vizuális figyelem, diszkrimináció fejlesztése','Auditív emlékezet, figyelem fejlesztése'],
      
      ['emlékezet fejlesztése vizuális és verbális területen'],
      
      ['tiszta hangejtés kialakítása', 'helyes beszédlégzés kialakítása', 'szókincs gyarapítása, szavak aktivizálásának gyorsítása', 'főfogalom alá rendezés, főfogalom meghatározása', 'mondatalkotási készség fejlesztése', 'mondatok grammatikai rendezése', 'egymásutániság- időrendiség helyes visszaadása', 'összefüggő beszéd fejlesztése', 'eseményképről szövegalkotás', 'verbális emlékezet fejlesztése', 'beszédészlelés, beszédértés fejlesztése'],
      
      ['testkép, testfogalom fejlesztése', 'testséma fejlesztése', 'bal-jobb irányok felismertetése', 'lateralitás, a dominancia erősítése', 'iránydifferenciálás fejlesztése', 'szimmetria észrevetetése'],
      
      ['azonosságok-különbözőségek észrevétele', 'összehasonlítás készségének fejlesztése', 'változás megfigyelése', 'analizáló-szintetizáló készség fejlesztése' , 'rész-egész viszony, szimmetria észlelésének fejlesztése', 'analógiás gondolkodás fejlesztése', 'logikai-funkcionális összefüggések felismerése', 'lényegkiemelés, általánosítás, következtetések átlátása', 'absztrahálási készség fejlesztése'],
      ['Szenzoros integráció, szenzomotoros koordináció alakítása','Alakkonstancia észlelés fejlesztése'],
      ['globális mennyiség felismerés', 'mennyiségi relációk alkotása','mennyiségi állandóság', 'számnév-számjegy-mennyiség egyeztetése']
      ],

      iskola: 
        [
          ['Csoport megszervezésével kapcsolatos feladatok'],
          ['finommotoros tevékenység alakítása','kéz és ujjak ügyesítése', 'saját mozgás észlelésének pontosítása', 'a látás és a mozgás összerendezése'],
          ['az ismeretek feldolgozásának segítése az érzékelés, észlelés folyamatain keresztül'],
          ['Vizuális részképességek javítása', 'látásérzékelés és észlelés fejlesztése', 'differenciálás, diszkrimináció, azonosságok, különbözőségek felismertetése', 'alaklátás-formaállandóság fejlesztése osztályfoknak megfelelően'],
          [ 'alak-háttér felfogás fejlesztése', 'vizuális minta helyes követése', 'vizuális szeriális készség alakítása', 'vizuális megfigyelő és elemző készség fejlesztése'],
          ['hallásészlelés és érzékelés fejlesztése','hallási figyelem, diszkrimináció, differenciálás fejlesztése', 'akusztikus szerialitás, tagolási, szótagolási és hanganalizáló gyakorlatok'],
          ['téri helyzetek, viszonylatok észlelésének alakítása', 'téri-, idői fogalmak bővítése', 'időrendiség észrevevése, fogalmak használata'],
          ['figyelem tartósságának, intenzitásának fejlesztése', 'akaratlagos, szelektív és megosztott figyelem terjedelmének növelése', 'megfigyelőképesség fejlesztése'],
          ['emlékezet fejlesztése vizuális és verbális területen', 'figyelem, emlékezet fejlesztése'],
          ['szókincs gyarapítása, szavak aktivizálásának gyorsítása', 'főfogalom alá rendezés, főfogalom meghatározása', 'szótagolási készség, mondatalkotási készség fejlesztése', 'mondatok grammatikai rendezése', 'egymásutániság- időrendiség helyes visszaadása', 'fonológiai tudatosság, auditív analízis-szintézis'],
          [ 'összefüggő beszéd fejlesztése', 'eseményképről szövegalkotás', 'verbális emlékezet fejlesztése', 'beszédészlelés, beszédértés fejlesztése'],
          ['stabil betűismeret alakítása', 'összeolvasás tanítása a diszlexia - prevenciós módszertan alapján', 'olvasás technikájának segítése'],
          [ 'olvasási rutin kialakítása', 'hibatípusok korrekciója', 'szövegolvasás képességének fejlesztése', 'szövegek értelmezése, megértése'],
          ['vizuomotoros koordináció fejlesztése', 'egyenletes vonalvezetés alakítása', 'balról jobbra haladó soralkotás megtanítása', 'a helyes sorváltás begyakorlása', 'betűformálás stabilizálása', 'betűelemek, betűkapcsolatok, íráskép rendezése'],
          [ 'olvasási készség fejlesztése','időtartam differenciálás', 'szó- és mondathatárok észlelésének fejlesztése', 'nyelvi és helyesírási szabályok bevésése, rögzítése, alkalmazása', 'helyesírási gyakorlatok', 'szövegalkotás technikájának elsajátítása', 'önálló írásbeli fogalmazás segítése'],
          ['analizáló-szintetizáló készség fejlesztése' , 'analógiás gondolkodás fejlesztése', 'logikai összefüggések felismerése', 'lényegkiemelés, általánosítás, következtetések átlátása', 'absztrahálási készség fejlesztése'],
          ['számlálás, számfogalom kialakítása életkornak, osztályfoknak megfelelően', 'matematikai jellegű feladatok és velük végezhető manipulációk',  'helyi érték fogalom kialakítása, megerősítése', 'alapműveletek és inverzeiknek alakítása', 'algoritmusok bevésése', 'a tízes-átlépés technikájának megerősítése', 'megfelelő számolási technika kialakítása, automatizálása, absztrahálása', 'matematikai ismeretek begyakorlása' ],
          [ 'logikai sorozatok alkotása, szabály felismerés', 'matematikai szöveges feladatok megoldási technikájának segítése', 'szöveg és számemlékezet fejlesztése','matematikai gondolkodás fejlesztése'],
        ]
    }

function kiLocalStoregebol(){
  if(!localStorage['NT_aktualis_csoport']){alert('Kérlek használd a csoportválsztó funkciót, hogy tudjam melyik csoportot kell felvinnem! Köszi!')}
  [csoportNev,csoportURL,szakember,oktataisInt,ellatasNapja,oraHossza,fejlTerv] = JSON.parse(localStorage['NT_aktualis_csoport']);
}

    function fejlTeruletValaszto(foglDatumok){
  let fejlTeruletekArr;
      if(fejlTerv){ /*Ha megadott a User fejlesztési tervet, azt húzzuk szét az alkalmakra*/
        fejlTeruletekArr= foglDatumok.map((item,index) =>fejlTerv[Math.floor((index)*(fejlTerv.length/foglDatumok.length))]);
      }
      else {
    //random generált fejlesztési tervekhez:
        if(oktataisInt && oktataisInt=== 'OVODA'){
          fejlTeruletekArr= foglDatumok.map((item,index) =>fejlTeruletek.ovoda[Math.floor((index)*(fejlTeruletek.ovoda.length/foglDatumok.length))]
          [Math.floor(Math.random()*fejlTeruletek.ovoda[Math.floor((index)*(fejlTeruletek.ovoda.length/foglDatumok.length))].length)]
          )

        } 
        else if(oktataisInt && oktataisInt=== 'ISKOLA'){
          fejlTeruletekArr= foglDatumok.map((item,index) =>fejlTeruletek.iskola[Math.floor((index)*(fejlTeruletek.iskola.length/foglDatumok.length))]
          [Math.floor(Math.random()*fejlTeruletek.iskola[Math.floor((index)*(fejlTeruletek.iskola.length/foglDatumok.length))].length)]
          )
        }
      }
        //a kezdőbetűt nagyra cseréljük:
        let arrToReturn= fejlTeruletekArr.map(text=>{
          let nyersArr=text.trim().split('');
          nyersArr.splice(0,1,nyersArr[0].toUpperCase());
          let keszArr = nyersArr.reduce((accu,actu)=>{return accu+actu},'')
          return keszArr;
        })
        return arrToReturn;
    }


 //Dátum tömb készítő funkció bemenettel:
 function datumArrKeszito(kezdoDatum,befejezoDatum) {
  // az input beszerzése, ha nem kapott kívülről:
  if(!kezdoDatum)
  // kezdő dátum:
  {let kezdoNyers = prompt("Mikor kezdődött az ellátás?");
  let kezdNyersArr = kezdoNyers.match(/[0-9]+/g);
  let kezdoTiszta =
    kezdNyersArr[0] + "." + kezdNyersArr[1] + "." + kezdNyersArr[2];
  kezdoDatum = new Date(kezdoTiszta);}
  console.log('A foglalkozássorozatunk kezdődik: ' + kezdoDatum);
  if(!befejezoDatum)
  {//befejező dátum:
  let befejezoNyers = prompt("Mikor fejeződött be az ellátás?");
  let befNyersArr = befejezoNyers.match(/[0-9]+/g);
  let befejezoTiszta =
    befNyersArr[0] + "." + befNyersArr[1] + "." + befNyersArr[2];
  befejezoDatum = new Date(befejezoTiszta);}
  console.log('És befejeződik:'+ befejezoDatum);
  // az output legenerálása
  let dateToAdd = kezdoDatum.getTime();
  let arrToReturn = [
    `${kezdoDatum.getFullYear()}.${
        (kezdoDatum.getMonth()+1) < 10
          ? "0" + (kezdoDatum.getMonth()+1)
          : (kezdoDatum.getMonth()+1)
      }.${kezdoDatum.getDate() < 10
          ? "0" + kezdoDatum.getDate()
          : kezdoDatum.getDate()}`
  ];
  const melyikNapjaA7nek = kezdoDatum.getDay(); 
  let max = 0;
  while (dateToAdd < befejezoDatum && max < 42) {
    dateToAdd = dateToAdd + 604800010;
    // megfelelő formátum
    let dateToManipulate = new Date(dateToAdd);
    // javítsuk ki az ismeretlen hibát:
    if(dateToManipulate.getDay() != melyikNapjaA7nek){dateToManipulate = new Date(dateToAdd+86400000)};
    let toPush = 
    `${dateToManipulate.getFullYear()}.${
        (dateToManipulate.getMonth()+1) < 10
          ? "0" + (dateToManipulate.getMonth()+1)
          : (dateToManipulate.getMonth()+1)
      }.${dateToManipulate.getDate() < 10
          ? "0" + dateToManipulate.getDate()
          : dateToManipulate.getDate()}`;
    arrToReturn.push(toPush);
    max++;
  }
  
  //rohadt olcsó megoldás arra, hogy ne legyen egy felesleges alkalom a végén:
  arrToReturn.pop();
  return arrToReturn;
}

// a hét napját meghatározó funkció:
function hetNapjaSzoveggel(hetnapjaSzammal){
 let toReturn;
 switch (hetnapjaSzammal) {
  case 1:
    toReturn = 'hétfő';
    break;
    
    case 2:
      toReturn = 'kedd';
    break;
    case 3:
      toReturn = 'szerda';
    break;
    case 4:
      toReturn = 'csütörtök';
    break;
    case 5:
      toReturn = 'péntek';
    break;
    case 6:
      toReturn = 'szombat';
      break;
    case 0:
      toReturn = 'vasárnap';
      break;
    
  default:
    console.warn('Nem megfelelő bemenet a hetNapjaSzoveggel() funkcióban!')
    break;
 }
  return toReturn;
}

  //TESZTHEZ
  [csoportNev,csoportURL,szakember,oktataisInt,ellatasNapja,oraHossza,fejlTerv] = JSON.parse(localStorage.NT_aktualis_csoport);
  if(csoportNev&&csoportURL&&oktataisInt&&ellatasNapja){
    kezdjukMarEl()}
    else {alert('Előbb válassz csoportot!')};