//CS_Valaszto_Letrehozo ver 1.0.6

//Variables:
let szakember = [];

//nodes:
const container = document.getElementById("Zoli-container");

const body = document.body;
const ujCsopiPopUp = document.querySelector(".inputUjcsopi");

//raw data:
let csoportNev, csoportURL, oktataisInt, ellatasNapja, oraHossza,fejlTerv,alkalomSzam;
let csoportMindenAdata = [];

function App() {
  body.innerHTML += `<div id="Zoli-container"><style>
#Zoli-container{position:fixed; top: 5%; right: 5%; max-height: 90vh; min-height: max-content; background-color: blueviolet; border-radius: 10px; height: max-content; color: azure; padding: 10px; text-align: center; z-index: 1000;}
#Zoli-container p{text-align: left; font-size: smaller;}
#Zoli-container button{ color: black;}
#Zoli-csoport-container{ min-height: max-content; max-height: 70vh; overflow-y: auto; margin:5px; border: 1px solid white; background-color: rgb(247, 53, 247); color: darkblue; border-radius: inherit; position:relative;}
.inputUjcsopi{line-height: 1.5rem; position:absolute; top: 0; left:0; width:100%;}
.csoport-gomb-container{display:flex;justify-content: space-between; padding:5px 10px; border-top: 1px dashed whitesmoke};
#Zoli-bezarogomb{ align-self: flex-end; color:pink; border-radius:2px;}
#Zoli-bezarogomb:hover{background-color: pink;}
#Zoli-bezarogomb-container{display: flex; background-color: white;}
div#H-orak{background-color: rgb(255,70,255);border-top: 1px solid blueviolet;}
div#K-orak{background-color: rgb(255,110,255);border-top: 1px solid blueviolet;}
div#Sz-orak{background-color: rgb(255,150,255);border-top: 1px solid blueviolet;}
div#Cs-orak{background-color: rgb(255,190,255);border-top: 1px solid blueviolet;}
div#P-orak{background-color: rgb(255,230,255);border-top: 1px solid blueviolet;}
</style>
<div id="Zoli-bezarogomb-container" ><a id="Zoli-bezarogomb" href="${window.location.href}">x bezár</a></div>
Csoportos ellátások kezelése
<p>Válassz a felsorolt csoportok közül, vagy vigyél fel újat az [Új csoport hozzáadása] gombbal!</p>
<button onclick="ujCsoportFelvetele()">Új csoport hozzáadása</button>
<div id="Zoli-csoport-container">
<div id="H-orak"><span id="H-szoveg"></span></div>
    <div id="K-orak"><span id="K-szoveg"></span></div>
    <div id="Sz-orak"><span id="Sz-szoveg"></span></div>
    <div id="Cs-orak"><span id="Cs-szoveg"></span></div>
    <div id="P-orak"><span id="P-szoveg"></span></div>

</div>
</div>`;
  taroltCsoportRendereles();
}

function ujCsoportFelvetele() {
  if (
    !Boolean(
      /inyr.hu\/Csoport\/Adatlap/.test(window.location.href) &&
        document
          .getElementsByTagName("h2")[0]
          .textContent.split("-")
          .includes("Csoport adatlap ")
    )
  ) {
    alert(
      "Új csoport listába vételéhez meg kell nyitnod a csoport KÉSZ adatlapját, és ott próbáld újra!"
    );
    return;
  }
  let toAppendString = `<dialog class="inputUjcsopi" open>
        <style>#Zoli-container{ min-height: 50vh;}#Zoli-csoport-container{ min-height: 40vh;}
        </style>
        <h4 id="uj-csoport-h4">Új Csoport</h4>
        <label for="csoport-neve">Csoport neve: </label><input type="text" id="csoport-neve" required value="${
          document.querySelector('span[class="text-info"]').textContent
        }">
        <label for="oraHossza">Tevékenység hossza: </label><input type="number" min="45" step="5" id="oraHossza" required value="60">
        <div id="Zoli-fejlesztesi-terv">
        <br>
        <hr>
        <b>Fejlesztési terv megadása:</b>
        <p>Választhatsz a következők közül: </p>
        A) Random generált fejlesztési terv:
                <p>Véletlenszerű gyógypedagógiai fejlesztési terv létrehozása a tárolt sablonokból:</p>
            <div>
                <label>Gyerekek kora:</label> <input name="csoport-intezmenye" type="radio" id="intezmenye-ovoda" checked> Óvodás
            <input name="csoport-intezmenye" type="radio" id="intezmenye-iskola"> Iskolás (alsó tagozat)</div>
            
            <hr>
            B) Megadok saját fejlesztési tervet: <br>
            <span id="fejlTerv-elonezet">${fejlTerv?"Egyedi fejlesztési terv: "+fejlTerv:"Saját fejlesztési terv helye."}</span>
            <br> <p><button onclick="document.getElementById('Zoli-sajat-fejlesztesi-terv').showModal(); document.getElementById('sajat-fejlesztesi-terv').value = fejlTerv.join('; ');">Terv beírása:</button></p> 
            <hr>
            <dialog id="Zoli-sajat-fejlesztesi-terv"> Tervem:<br>
            <textarea name="sajat-fejlesztesi-terv" id="sajat-fejlesztesi-terv" cols="30" rows="10" placeholder="Ide írd /másold be a fejlesztési tervet, az órák anyagát pontosvesszővel (;-vel) elválasztva. pl.: Mintázatfelismerés fejlesztése; Grafomotorika fejlesztése; stb;"></textarea>
                <br>
                <button onclick="fejlTerv = fejlTervBonto(); document.getElementById('Zoli-sajat-fejlesztesi-terv').close(); document.getElementById('fejlTerv-elonezet').textContent= 'Egyedi fejlesztési terv: '+fejlTerv">Mentés</button>
                <button onclick="document.getElementById('Zoli-sajat-fejlesztesi-terv').close()">Mégse</button>
            
        </dialog>
        </div>
        <div><label> Ellátás napja: 
        <input name="ellatas-napja" type="radio" id="hetfo" checked> H
        <input name="ellatas-napja" type="radio" id="kedd"> K
        <input name="ellatas-napja" type="radio" id="szerda"> Sze
        <input name="ellatas-napja" type="radio" id="csutortok"> Cs
        <input name="ellatas-napja" type="radio" id="pentek"> P
        </label>
        <br>
        <hr>
        <b>Felvitelre váró alkalmak száma:</b>
        <p>Ebben a munkamenetben hány alklamat szeretnél felvinni?</p>
        <br>
        A) Rendszeres kitöltés:
        <p><input type="radio" name="alkalomSzam" id="rendszeres" checked>A legutóbbi felvitt alkalom/ vagy jelen tanév szeptember 1 óta eltelt összes hétre egy-egy alkalom felvitele az órarendben szereplő napra.</p>
       
        <hr>
        B) Kitöltés megadott időintervallumban:
        <p><input type="radio" name="alkalomSzam" id="intervallum">Konkrét kezdő és befejező dátum között minden hétre egy alkalom felvitele az órarendben szereplő napra.</p>
       
        <hr>
        <button id="csoportMentes" onclick="csoportMentes()">Új csoport felvétele</button>
        
        </dialog>`;
  document.getElementById("Zoli-csoport-container").innerHTML += toAppendString;
}

function csoportMentes() {
  csoportNev = document.getElementById("csoport-neve").value;
  if (
    /inyr.hu\/Csoport\/Adatlap/.test(window.location.href) &&
    document
      .getElementsByTagName("h2")[0]
      .textContent.split("-")
      .includes("Csoport adatlap ")
  ) {
    csoportURL = window.location.href;
  } else {
    alert(
      "Kérlek nyisd meg a Csoport adatlapját annak a csoportnak, amit fel akarsz venni a listára és onnan próbáld újra!"
    );
  }
  if (document.getElementById("intezmenye-ovoda").checked) {
    oktataisInt = "OVODA";
  } else if (document.getElementById("intezmenye-iskola").checked) {
    oktataisInt = "ISKOLA";
  }

  oraHossza = document.getElementById("oraHossza").value;

  if (document.getElementById("hetfo").checked) {
    ellatasNapja = 1;
  } else if (document.getElementById("kedd").checked) {
    ellatasNapja = 2;
  } else if (document.getElementById("szerda").checked) {
    ellatasNapja = 3;
  } else if (document.getElementById("csutortok").checked) {
    ellatasNapja = 4;
  } else if (document.getElementById("pentek").checked) {
    ellatasNapja = 5;
  } else {
    ellatasNapja = NaN;
  }

  alkalomSzam = document.getElementById('intervallum').checked ? 'intervallum' : 'rendszeres';

  console.log(
    csoportNev + ": " + csoportURL + "; " + oktataisInt + "; " + ellatasNapja
  );
  if (localStorage["NT_csoportok"]) {
    csoportMindenAdata = JSON.parse(localStorage["NT_csoportok"]);
  }
  csoportMindenAdata.push([
    csoportNev,
    csoportURL,
    szakember,
    oktataisInt,
    ellatasNapja,
    oraHossza,
    fejlTerv,
    alkalomSzam
  ]);
  if (csoportNev && csoportURL) {
    document.querySelector(".inputUjcsopi").remove();
    localStorage.setItem("NT_csoportok", JSON.stringify(csoportMindenAdata));
  }

  //Renderelje az uj csoportlistat:
  taroltCsoportRendereles();
}

function taroltCsoportRendereles() {
  let toRender = `<h4>Csoportok:</h4>
  <div id="H-orak"><span id="H-szoveg"></span></div>
    <div id="K-orak"><span id="K-szoveg"></span></div>
    <div id="Sz-orak"><span id="Sz-szoveg"></span></div>
    <div id="Cs-orak"><span id="Cs-szoveg"></span></div>
    <div id="P-orak"><span id="P-szoveg"></span></div>`;
  let toRenderH, toRenderK, toRenderSz, toRenderCs, toRenderP;
  const osszesCsoport = JSON.parse(localStorage.NT_csoportok);
  console.log(osszesCsoport);
  if (osszesCsoport.length > 0) {
    function napiCsoportListazo(dayNum) {
      return osszesCsoport
        .filter((csoport) => Boolean(csoport[4] === dayNum))
        .reduce((accu, array) => {
          return (
            accu +
            `<div class="csoport-gomb-container"><button title="Csoport adatlap megnyitása" onclick=" csoportMegnyito('${array[1]}')">${array[0]}</button><button data-url="${array[1]}" title="Az aktuális csoportadatok szerkesztése" onclick="csoportSzerkesztes('${array[1]}')">szerkeszt</button><button title="csoport törlése" onclick="csoportTorlese('${array[1]}')">X</button></div>`
          );
        }, "");
    }
    toRenderH = napiCsoportListazo(1);
    toRenderK = napiCsoportListazo(2);
    toRenderSz = napiCsoportListazo(3);
    toRenderCs = napiCsoportListazo(4);
    toRenderP = napiCsoportListazo(5);
  } else {
    toRender += "<p>Nincs megjeleníthető csoport. Vigyél fel egyet!</p>";
  }
  document.getElementById("Zoli-csoport-container").innerHTML = toRender;
  if (osszesCsoport.length > 0) {
    if (toRenderH) {
      document.getElementById("H-orak").innerHTML += toRenderH;
      document.getElementById("H-szoveg").innerHTML = "Hétfő: <br>";
    }

    if (toRenderK) {
      document.getElementById("K-orak").innerHTML += toRenderK;
      document.getElementById("K-szoveg").innerHTML = "Kedd: <br>";
    }

    if (toRenderSz) {
      document.getElementById("Sz-orak").innerHTML += toRenderSz;
      document.getElementById("Sz-szoveg").innerHTML = "Szerda: <br>";
    }

    if (toRenderCs) {
      document.getElementById("Cs-orak").innerHTML += toRenderCs;
      document.getElementById("Cs-szoveg").innerHTML = "Csütörtök: <br>";
    }

    if (toRenderP) {
      document.getElementById("P-orak").innerHTML += toRenderP;
      document.getElementById("P-szoveg").innerHTML = "Péntek: <br>";
    }
  }
}

function csoportMegnyito(URL) {
  [csoportNev, csoportURL, szakember, oktataisInt, ellatasNapja, oraHossza,fejlTerv,alkalomSzam] =
    JSON.parse(localStorage["NT_csoportok"]).filter(function (item) {
      if (item.includes(URL)) {
        return true;
      }
    })[0];
  localStorage.setItem(
    "NT_aktualis_csoport",
    JSON.stringify([
      csoportNev,
      csoportURL,
      szakember,
      oktataisInt,
      ellatasNapja,
      oraHossza,
      fejlTerv,
      alkalomSzam
    ])
  );
  localStorage.setItem("CS_kovi_jelenleti", "2");
  localStorage.setItem("CS_folyamat_koveto", "választási szakasz");
  localStorage.setItem("CS_fogldatumok", JSON.stringify(""));
  const kattintos = document.createElement("a");
  kattintos.setAttribute("href", URL);
  kattintos.setAttribute("id", "kitorolni");
  document.getElementById("Zoli-container").appendChild(kattintos);
  document.getElementById("kitorolni").click();
}

function csoportSzerkesztes(mostaniURL) {
  //Töltsük be a megfelelő adatokat a localStorage-ből:
  [csoportNev, csoportURL, szakember, oktataisInt, ellatasNapja, oraHossza,fejlTerv,alkalomSzam] =
    JSON.parse(localStorage["NT_csoportok"]).filter(function (item) {
      if (item.includes(mostaniURL)) {
        return true;
      }
    })[0];

  //használjuk az Új csoport felvétele űrlapot módosítva:
  ujCsoportFelvetele();
  document.getElementById("uj-csoport-h4").textContent = "Csoport szerkesztése";
  document.getElementById("csoportMentes").textContent =
    "Csoportadatok módosítása";
  document.getElementById("csoport-neve").value = csoportNev;
  if (oktataisInt === "OVODA") {
    document.getElementById("intezmenye-ovoda").checked = true;
  } else if (oktataisInt === "ISKOLA") {
    document.getElementById("intezmenye-iskola").checked = true;
  }

  if (oraHossza) {
    document.getElementById("oraHossza").value = oraHossza;
  } else {
    document.getElementById("oraHossza").value = 60;
  }

  switch (ellatasNapja) {
    case 1:
      document.getElementById("hetfo").checked = true;
      break;

    case 2:
      document.getElementById("kedd").checked = true;
      break;
    case 3:
      document.getElementById("szerda").checked = true;
      break;

    case 4:
      document.getElementById("csutortok").checked = true;
      break;
    case 5:
      document.getElementById("pentek").checked = true;
      break;

    default:
      console.warn("Érvénytelen értéket tartalmaz az ellatasNapja!");
      break;
  }

  if(alkalomSzam == 'intervallum'){document.getElementById('intervallum').checked=true;}
  else {document.getElementById('rendszeres').checked=true;};

  // töröljük ki a szerkesztés előtti csoportot
  // töltsük be az összes csoportot:
  let mindenCsoport = JSON.parse(localStorage["NT_csoportok"]);
  //keressük ki a megfelelő elemet az array-ből
  let searchedIndex;
  mindenCsoport.map(function (element, index, array, thisArg) {
    if (element[1] === csoportURL) {
      searchedIndex = index;
      console.log(`A törlendő elem indexe: ${searchedIndex}`);
    }
  });
  //töröljük a megfelelő elemet az array-ból:
  mindenCsoport.splice(searchedIndex, 1);
  localStorage.setItem("NT_csoportok", JSON.stringify(mindenCsoport));
  // Renderelje újra a kész módosításokkal:
}

function csoportTorlese(mostaniURL) {
  if (!confirm("Biztosan törlöd ezt a csoportot?")) {
    return;
  }
  let mindenCsoport = JSON.parse(localStorage["NT_csoportok"]);
  //keressük ki a megfelelő elemet az array-ből
  let searchedIndex;
  mindenCsoport.map(function (element, index, array, thisArg) {
    if (element[1] === mostaniURL) {
      searchedIndex = index;
    }
    console.log(`A törlendő elem indexe: ${searchedIndex}`);
  });
  //töröljük a megfelelő elemet az array-ból:
  mindenCsoport.splice(searchedIndex, 1);
  localStorage.setItem("NT_csoportok", JSON.stringify(mindenCsoport));
  taroltCsoportRendereles();
}

function fejlTervBonto(){
  if(document.getElementById('sajat-fejlesztesi-terv').value)
  {let nyersAdat = document.getElementById('sajat-fejlesztesi-terv').value.split(';')
  return nyersAdat.map(item => {return item.trim()}).filter(trimmedItem => trimmedItem !='');}
  else {return null;}   
}


App();
