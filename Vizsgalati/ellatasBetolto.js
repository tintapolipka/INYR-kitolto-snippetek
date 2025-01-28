// V_ellatasBetolto ver 2023/24.01

//Dev Tools/Sources/Snippets +New snippet -így lehet hozzáadni új kódot az oldalhoz.

//Menü telepítő
const appendMenu = `<div class="Zoli-container"><style>.Zoli-container{display: flex; flex-direction: column; z-index: 2000; position:fixed; top:0; right:0; background-color: lightgreen; padding: 10px;} .Zoli-container p {margin:0;} #BETOLTES{height:40px; } </style><p>Zoli menüje</p>
<button onclick="location.reload()">bezár (x)</button>
<a href="https://docs.google.com/spreadsheets/d/1t1i6un7eAxYQWvkRzA5rgdsrn4u4OuRwKfLxJ7KnYaY/edit#gid=1713518825" target="_blank" rel="noopener noreferrer">Beosztás link</a>
<a href="https://docs.google.com/spreadsheets/d/1nBVdmQx2P_EP8krfNJoXcmYaB0b0V59Uh-rbunUu56w/edit#gid=0" class="megfigyeles-link" target="_blank">Megfigyelések</a>
<textarea name="tabalazat-adat" id="Zoli-tablazat-adat" cols="10" rows="2" placeholder="Ide másold az adatot"
></textarea>
<button id="adat-bonto" onclick="adatBonto()">Új betöltése</button>
<span id="Aktualis-nev-Zoli"></span>
</div> `;

// legutóbbi adatok betöltése a localStorage-ből:
function KiLocalStoragebol(){
   if(localStorage['vizsgaltGyerek'])
   { [oktAz,vezeteknev, utonev,vizsgDatum, diagnozis, osztalyfok, hanyadikVizsg,megfigyelesVoltE, gyogyPed,pszichologus,OA, KerelmezoFehId,beErkezett,mikorFigyelteMeg,fvTaneve] = JSON.parse(localStorage['vizsgaltGyerek'])}
   else {console.log('A localStorage üres.')};
}

function menuTelepito(){document.body.innerHTML+=appendMenu;
   KiLocalStoragebol();
   document.getElementById('Aktualis-nev-Zoli').innerText=`${vezeteknev? vezeteknev :''} ${utonev? utonev: ''}`;
   
}

// A táblázatból kinyerhető adatok:
let oktAz, teljesnev, diagnozis,osztalyfok,vizsgDatum,masodikVD,harmadikVD,hanyadikVizsg,megfigyelesVoltE,gyogyPed,pszichologus,oktatasiInt,beErkezett,kiKeri;

//származtatott adatok:
let vezeteknev, utonev, OA, KerelmezoFehId, mikorFigyelteMeg ,fvTaneve;
//mentendő adatok:
let gyerekMindenAdata;

function adatBonto(){
   if(!document.getElementById('Zoli-tablazat-adat').value){alert(`Nem illesztetted be az Adattal töltött BEOSZTÁS / adat fül megfelelő sorát a fehér mezőbe! Pótold, és próbáld újra. ${vezeteknev? 'VAGY: Használhatod a korábban mentett adatait annak a gyereknek akinek a neve a zöld mezőben olvasható!' : ''}`); return;};
   //localStorage.clear()
   let szetkapni = document.getElementById('Zoli-tablazat-adat').value;
   let darabolt = szetkapni.split(/\t/);
    [teljesnev,,oktAz,,,,diagnozis,osztalyfok,vizsgDatum,,masodikVD,,harmadikVD,,hanyadikVizsg,megfigyelesVoltE,,,gyogyPed,pszichologus,oktatasiInt,beErkezett,kiKeri] = darabolt;

      //Ha több vizsgálati dátuma is volt, a legutóbbi használata:
      harmadikVD? vizsgDatum= harmadikVD : masodikVD? vizsgDatum=masodikVD : vizsgDatum = vizsgDatum;
      // megfelelő dátumformátumra (yyyy.mm.dd) hozás:
      vizsgDatum= vizsgDatum.slice(0,-1);
      beErkezett= beErkezett.slice(0,-1);
      // teljesnév felesleges fehérrészeinek levágása
      teljesnev = teljesnev.trim();
    if(!teljesnev){alert('Nem illesztetted be az Adattal töltött BEOSZTÁS / adat fül megfelelő sorát a fehér mezőbe! Pótold, és próbáld újra. VAGY: Használhatsz mentett adatokat a [régi használata] gombbal. '); return;};
   //hiánypótlás
      
      if(!diagnozis){diagnozis = prompt('Adathiány! Add meg a gyerek diagnózisát! (BTM / SNI / semmi)')};
      
    //származtatott adatok
    vezeteknev = vezeteknevBonto(teljesnev);
    utonev = utonevBonto(teljesnev);
      //oktatási intézmény adatai 
    OA = intezmenyOA(oktatasiInt);
    KerelmezoFehId=intezmenyFehID(oktatasiInt);

    //adat finomítás
      //diagnózis:
     if(!diagnozis){diagnozis = prompt('Add meg a diagnózist! (Nem volt kitöltve a táblázatban?)');}
   /nem|semmi/i.test(diagnozis) ? diagnozis= 'nem-BTM' : /sni/i.test(diagnozis)? diagnozis='SNI': diagnozis='BTM-N';
  
      //osztalyfok meghatározása:
       //Létezik az osztályfok változó?
       if(!osztalyfok){osztalyfok = prompt('A gyerek osztály/ csoportfoka?')};
       //Az osztályfok tartalmaz számot számot?
       /\d+/.test(osztalyfok) ? osztalyfok = +osztalyfok.match(/\d+/)[0] : 
       /csop|nagy|kis|közép/i.test(osztalyfok)? osztalyfok= 'ovodába járó' : '';
       /éves/i.test(osztalyfok) && /3/.test(osztalyfok)?  osztalyfok= 'ovodába járó' : '';
 
       // Hányadik vizsgálat? ('aktuális' / 'fv' / 'rendkívüli fv')
       if(hanyadikVizsg !='OH kirendelés'){
       /fv/i.test(hanyadikVizsg) ? hanyadikVizsg = 'fv' : hanyadikVizsg = 'aktuális';}

        //Megfigyelés volt-e? átkódolása:
        megfigyelesVoltE=/egfigyel/i.test(megfigyelesVoltE)
         let kiFigyeltMeg;
         
         if(megfigyelesVoltE){
         
         kiFigyeltMeg = prompt('Ki végezte a megfigyelést? Kérlek írd be a monogrammját! Brigi : BB / Eszter: SZE / Zoli: MZG / Peti: FPZ / Alen: ZSA ');};
         if(/zsu|Ézs/i.test(kiFigyeltMeg)){megfigyelesVoltE = '5277'};
         if(/eszt|sze/i.test(kiFigyeltMeg)){megfigyelesVoltE = '9770'};
         if(/zol|mzg/i.test(kiFigyeltMeg)){megfigyelesVoltE = '4268'};
         if(/pe|fpz/i.test(kiFigyeltMeg)){megfigyelesVoltE = '4978'};
         if(/ale|zsa/i.test(kiFigyeltMeg)){megfigyelesVoltE = '10646'};
        if(/brig|BB/i.test(kiFigyeltMeg)){megfigyelesVoltE = '12470'};
         
         if(megfigyelesVoltE){
         mikorFigyelteMeg = prompt('Mikor történt a megfigyelés?');
         let atmenetiArr = mikorFigyelteMeg.match(/[0-9]+/g);
         mikorFigyelteMeg = `${atmenetiArr[0]}.${atmenetiArr[1]}.${atmenetiArr[2]}`;
         }

      //Gyógypedagógus átkódolása azonosítóvá
      switch (gyogyPed) {
         case 'VBG':
            gyogyPed = '3977';
            break;
      
         case 'KockA':
            gyogyPed = '6657';
            break;

         case 'DD':
            gyogyPed = '8038';
            break;
            
         case 'VE':
            gyogyPed = '1538';
            break;

         case 'SZTT':
            gyogyPed = '4184';
            break;
                  
         case 'MB':
            gyogyPed = '1542';
            break;
         
         case 'KE':
            gyogyPed = '2378';
            break;

         case 'DM':
            gyogyPed ='1550';
            break;

         case 'KLL':
            gyogyPed = '12479';
            break;

         default:
            gyogyPed= false;
            break;
      }

      // Ki volt a pszichológus?
      
      switch (pszichologus) {
         case 'MZG':
            pszichologus= '4268';
            break;
            
         case 'KSK':
               pszichologus= '12268';
            break;
            
         case 'FPZ':
            pszichologus= '4978';
            break;

         case 'SZE':
            pszichologus= '9770';
            break;
     
         case 'ZSA':
            pszichologus= '10646';   
            break;
           
         case 'BB':
            pszichologus= '12470';   
            break;
         
         case 'ATB':
         pszichologus= '12498';   
         break;
            
         
         default:
            pszichologus= false;
            break;      
         };
         
         // felülvizsgálat tanévének meghatározása:
         function tanevAzonosito(datum) {
           let datesArr = datum.match(/[0-9]+/g); 
           let konstans;
           if(datesArr[1]>8){konstans=2015} else {konstans=2016}  
       if (hanyadikVizsg=== 'aktuális'){return 'FVT' + (parseFloat(datesArr[0])-konstans+1) }
       else if (hanyadikVizsg=== 'fv'){return 'FVT' +  (parseFloat(datesArr[0])-konstans+3) };   
       }

       // 2022/23-as tanév = 'FVT7' Tehát a 'FVT' + 
       fvTaneve =  tanevAzonosito(vizsgDatum);

      // Adatok mentése a Localstorage-be
      gyerekMindenAdata = [oktAz,vezeteknev, utonev,vizsgDatum, diagnozis, osztalyfok, hanyadikVizsg,megfigyelesVoltE, gyogyPed,pszichologus,OA, KerelmezoFehId,beErkezett,mikorFigyelteMeg,fvTaneve];
      localStorage.setItem('vizsgaltGyerek',JSON.stringify(gyerekMindenAdata));
         // segédváltozók a tevékenység felviteléhez:
         localStorage.setItem('pszichoMegNemVolt','igaz');
         localStorage.setItem('mefigyMegNemVolt','igaz');
         localStorage.setItem('gypMegNemVolt','igaz');


      document.getElementById('Aktualis-nev-Zoli').innerText=`${vezeteknev} ${utonev}`
      
      //teszt
   console.log('oktatási azonosító: '+ oktAz +'; teljes név: '+teljesnev+'; Vezetéknév: '+vezeteknev+'; Utónév '+utonev+'; Vizsgálat ideje: '+vizsgDatum+'; Diagnózis '+ diagnozis+
   '; Osztályfok: '+osztalyfok+'; Vizsgálat típusa: '+hanyadikVizsg+'; Megfigyelés volt-e? '+megfigyelesVoltE+'; gyógypedagógus: '+gyogyPed+ '; pszichológus: '+pszichologus+
   ' Okatatási intézmény: '+oktatasiInt+ ' OM kód: ' +OA)
}

function vezeteknevBonto(nev){
   return nev.split(' ')[0];
}

function utonevBonto(nev){
   let koztes = nev.split(' ');
   koztes.splice(0,1);
   return koztes.join(' ');
 }
 
 let intezmenyLista = [

{intezmeny:'Juhász Gyula Református Gimnázium és Szakképző Iskola', om:'029741', regexp1:/uhász|jugyu/i , regexp2:/./i, KerelmezoFehId:'1029741001'},
{intezmeny:'Alföldi ASzC Galamb József Mezőgazdasági Technikum', om:'202728', regexp1:/Galamb/i , regexp2:/Galamb/i, KerelmezoFehId:''},
{intezmeny:'HSZC Makói Návay Lajos Technikum', om:'203039', regexp1:/hszc/i , regexp2:/vay/i, KerelmezoFehId:'2000001442'},
{intezmeny:'Szikszai György Református Általános Iskola', om:'102612', regexp1:/szikszai/i , regexp2:/isk/i , KerelmezoFehId:'2000004150'},
{intezmeny:'Szikszai György Református Általános Iskola', om:'102612', regexp1:/szikszai/i , regexp2:/voda/i , KerelmezoFehId:'1102612001'},
{intezmeny:'Makói Óvoda Kálvin Tér', om:'029427', regexp1:/makói óvoda/i, regexp2:/kálvin/i, KerelmezoFehId:'1999998835'},
{intezmeny:'Makói Óvoda Erdélyi püspök', om:'029427', regexp1:/makói óvoda/i, regexp2:/erdélyi/i, KerelmezoFehId:'1029427001'},
{intezmeny:'Makói Óvoda Kassai Tagóvoda', om:'029427', regexp1:/óvoda/i, regexp2:/kassai/i, KerelmezoFehId:'1999998836'},
{intezmeny:'Makói Óvoda', om:'029427', regexp1:/makói óvoda/i, regexp2:/hold/i, KerelmezoFehId:'1029427001'},
{intezmeny:'Földeáki Návay Lajos Ált. Isk.', om:'029695', regexp1:/földeák/i, regexp2:/návay/i, KerelmezoFehId:'1029695001'},
{intezmeny:'Földeáki Gyermekmosoly Óvoda', om:'029536', regexp1:/földeák/i, regexp2:/voda/i, KerelmezoFehId:'1029536001'},
{intezmeny:'Makói József Attila Gimnázium', om:'029745', regexp1:/J|[o|ó]zsef/i, regexp2:/Gimnázium|jag/i, KerelmezoFehId:'1029745001'},
{intezmeny:'Bárka Református Óvoda', om:'200081', regexp1:/Bárka/i, regexp2:/voda/i, KerelmezoFehId:'1200081001'},
{intezmeny:'Kiszombori Karátson Emília Óvoda', om:'029538', regexp1:/zombor/i, regexp2:/voda/i, KerelmezoFehId:'1029538001'},
{intezmeny:'Kiszombori Dózsa György Általános Iskola', om:'029697', regexp1:/zombor/i, regexp2:/isk/i, KerelmezoFehId:'1029697001'},
{intezmeny:'Szignum Kéttannyelvű Egyházi Általános Iskola', om:'029757', regexp1:/szignum/i, regexp2:/szignum/i, KerelmezoFehId:'1029757001'},
{intezmeny:'Galamb József Mezőgazdasági Szakgimnázium és Szakközépiskola', om:'202744', regexp1:/Galamb/i, regexp2:/zsef|./i, KerelmezoFehId:''},
{intezmeny:'Napsugár Óvoda és Bölcsőde', om:'029533', regexp1:/Napsugár|palota/i, regexp2:/voda|bölcsőde/i, KerelmezoFehId:'1029533001'},
{intezmeny:'Pitvarosi Petőfi Sándor Általános Iskola és Alapfokú Művészeti Iskola', om:'039539', regexp1:/Pitvaros/i, regexp2:/isk/i, KerelmezoFehId:'1039539004'},
{intezmeny:'Pitvaros Térségi Óvoda', om:'202371', regexp1:/pitvaros/i, regexp2:/voda/, KerelmezoFehId:'1202371001'},
{intezmeny:'Apátfalvi Dózsa György Általános Iskola', om:'201360', regexp1:/pátfalv/i, regexp2:/isk/i, KerelmezoFehId:'1201360001'},
{intezmeny:'Bíbic Katolikus Óvoda és Bölcsőde', om:'201361', regexp1:/B[í|i]bic|pátfalv/i, regexp2:/voda/i, KerelmezoFehId:'1201361001'},
{intezmeny:'Bíbic Katolikus Óvoda és Bölcsőde', om:'201361', regexp1:/B[í|i]bic|pátfalv/i, regexp2:/rákóczi/i, KerelmezoFehId:'1201361003'},
{intezmeny:'Csanádpalotai Dér István Általános Iskola', om:'201203', regexp1:/palota/i, regexp2:/iskola/i, KerelmezoFehId:'1201203001'},
{intezmeny:'Csanádpalota Térségi Óvoda', om:'201966', regexp1:/palota/i, regexp2:/voda/i, KerelmezoFehId:'1201966001'},
{intezmeny:'Csanádpalota Térségi Óvoda Királyhegyesi Óvodai Tagintézménye', om:'201966', regexp1:/lyhegyes/i, regexp2:/voda/i, KerelmezoFehId:'1201966007'},
{intezmeny:'Magyarcsanádi Református Általános Iskola és Óvoda', om:'201596', regexp1:/agyarcsan/i, regexp2:/isk|voda/i, KerelmezoFehId:'1201596001'},
{intezmeny:'Makói Általános Iskola', om:'102930', regexp1:/mái|Makói Általános/i, regexp2:/mái|Makói Általános/i, KerelmezoFehId:'1102930006'},
{intezmeny:'Szent Tamás Görögkatolikus Óvoda és Általános Iskola', om:'201420', regexp1:/szent/i, regexp2:/görög|zrínyi/i, KerelmezoFehId:'2000005745'},
{intezmeny:'Kálvin Téri Református Általános Iskola', om:'201665', regexp1:/kálvin/i, regexp2:/iskola|reform/i, KerelmezoFehId:'1201665001'},
{intezmeny:'Makói Katolikus Általános Iskola és Óvoda', om:'201694', regexp1:/katolikus/i, regexp2:/általános iskola/i, KerelmezoFehId:'1201694001'},
{intezmeny:'Makói Katolikus Általános Iskola és Óvoda', om:'201694', regexp1:/katolikus/i, regexp2:/tulipán|makói/i, KerelmezoFehId:'1201694002'},
{intezmeny:'Maroslelei Általános Iskola', om:'029700', regexp1:/maroslele/i, regexp2:/isk/i, KerelmezoFehId:'1029700001'},
{intezmeny:'MAROSLELEI ZENGŐ ÓVODA ÉS MINI BÖLCSŐDE', om:'202185', regexp1:/maroslele/i, regexp2:/voda/i, KerelmezoFehId:'1202185001'},
{intezmeny:'MÁI Nagyéri Tagintézménye', om:'102930', regexp1:/nagyér/i, regexp2:/isk|MÁI/i, KerelmezoFehId:'1102930002'},
{intezmeny:'Pitvaros Térségi Óvoda Nagyéri Tagintézménye', om:'202371', regexp1:/nagyér/i, regexp2:/voda/i, KerelmezoFehId:'1202371002'}
 ];

 // intézményi oktatási azonosító kinyerése 
 function intezmenyOA(oktatasiInt){
   let toReturn ='';
   for (let i = 0; i < intezmenyLista.length; i++) {
      if(intezmenyLista[i].regexp1.test(oktatasiInt) && intezmenyLista[i].regexp2.test(oktatasiInt))
      {toReturn = intezmenyLista[i].om}
      }
    return toReturn;
   }

   function intezmenyFehID(oktatasiInt){
      let toReturn ='';
      for (let i = 0; i < intezmenyLista.length; i++) {
         if(intezmenyLista[i].regexp1.test(oktatasiInt) && intezmenyLista[i].regexp2.test(oktatasiInt))
         {toReturn = intezmenyLista[i].KerelmezoFehId}
         }
       return toReturn;
      }

   menuTelepito();



