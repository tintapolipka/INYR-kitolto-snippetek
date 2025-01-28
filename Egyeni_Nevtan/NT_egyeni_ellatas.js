/*Egyéni Pszichológiai  Ellátás  ver: 1.2/2024 */
// Variables:
let szakember;
let kezdoDatum;
let befejezoDatum;

//A rota funkciói:

function megnyit() {
  document.getElementById("tevekenysegModal").click();
}

function kitolt(idopont) {
  console.log("Az időpontot így kell  beírni! Így: '2022.09.13'");
  document.getElementsByName("Kategoria")[0].value = "BEAVATKOZ";
  document.getElementsByName("FehId")[0].value = "1999998574";
  document.getElementsByName("Erintettek")[0].value = "TAN";
  document.getElementById("Megjelentek").checked = true;
  document.getElementById("Idotartama").value = 60;
  document.getElementById("Leiras").value = "Pszichológiai gondozás";
  document.getElementById("Megjegyzes").value = "";
  document.getElementById("Kezdete").value = idopont;
  document.getElementById("TevekenysegSzakemberek").value = szakember;
  document.getElementsByName("Helyek")[0].value = "UGYVITELIH";
  document.querySelector("#SaveAnyway").nextElementSibling.click();
}

function egybekitolt(idopont) {
  megnyit();
  setTimeout(() => {
    kitolt(idopont);
  }, 1500);
}

function teljesTanev(datumokArray) {
  // promptok:
  szakember = kiLattael();
  for (let index = 0; index < datumokArray.length; index++) {
    setTimeout(() => {
      egybekitolt(datumokArray[index]);
    }, 2000 * index + 500);
    if(index==(datumokArray.length-1)){setTimeout(() => {location.reload()}, 2000 * index + 1000)}
  }
}

//Dátum tömb bészítő funkció:
function datumArrKeszito() {
  // az input beszerzése:
  // kezdő dátum:
  let kezdoNyers = prompt("Mikor kezdődött az ellátás?");
  let kezdNyersArr = kezdoNyers.match(/[0-9]+/g);
  let kezdoTiszta =
    kezdNyersArr[0] + "." + kezdNyersArr[1] + "." + kezdNyersArr[2];
  kezdoDatum = new Date(kezdoTiszta);
  console.log(kezdoDatum);
  //befejező dátum:
  let befejezoNyers = prompt("Mikor fejeződött be az ellátás?");
  let befNyersArr = befejezoNyers.match(/[0-9]+/g);
  let befejezoTiszta =
    befNyersArr[0] + "." + befNyersArr[1] + "." + befNyersArr[2];
  befejezoDatum = new Date(befejezoTiszta);
  console.log(befejezoDatum);
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
  while (dateToAdd < befejezoDatum && max < 52) {
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
  return arrToReturn;
}

// előkészítő funkciók:
/*
case 'ATB':
         pszichologus= '12498';   
         
*/


function kiLattael() {
  let ellatoSzakember = prompt(
    "Ki végezte az ellátást? Kérlek írd be a monogrammját! \nBea: ATB  \nBrigi: BB \nSári: KSK  \nEszter: SZE \nZoli: MZG \nPeti: FPZ \nAlen: ZSA "
  );
  if(/ATB|bea/i.test(ellatoSzakember)) {
    ellatoSzakember = '12498'
  }

  if(/brig|BB/i.test(ellatoSzakember)) {
    ellatoSzakember = '12470'};

  if(/ksk|sár/i.test(ellatoSzakember)) {
    ellatoSzakember = '12268';
  };
  
  if (/eszt|sze/i.test(ellatoSzakember)) {
    ellatoSzakember = "9770";
  }
  if (/zol|mzg/i.test(ellatoSzakember)) {
    ellatoSzakember = "4268";
  }
  if (/pe|fpz/i.test(ellatoSzakember)) {
    ellatoSzakember = "4978";
  }
  if (/ale|zsa/i.test(ellatoSzakember)) {
    ellatoSzakember = "10646";
  }
  return ellatoSzakember;
}

teljesTanev(datumArrKeszito());