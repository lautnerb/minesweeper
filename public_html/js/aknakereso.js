var oszlopokSzama = 8;
var sorokSzama = 8;
var bombakSzama = 10;
var BOMBA = 'B';
var palyaSzamok;
var palyaFelfedett;
var vereseg = false;
var gyozelem = false;

function start(){
    var szint = document.getElementById('szint').value;
    switch (szint){
        case 'kezdo':
            oszlopokSzama = 8;
            sorokSzama = 8;
            bombakSzama = 10;
            break;
        case 'halado':
            oszlopokSzama = 16;
            sorokSzama = 16;
            bombakSzama = 40;
            break;
        case 'mester':
            oszlopokSzama = 30;
            sorokSzama = 16;
            bombakSzama = 99;
            break;
    }
    initPalya();
}

function initPalya(){
    vereseg = false;
    gyozelem = false;
    
    var s = '';
    palyaSzamok = new Array(sorokSzama);
    palyaFelfedett = new Array(sorokSzama);
    
    for (var i = 0; i < sorokSzama; i++) {
        s += '<tr>';
        palyaSzamok[i] = new Array(oszlopokSzama);
        palyaFelfedett[i] = new Array(oszlopokSzama);
        
        for (var j = 0; j < oszlopokSzama; j++) {
            s += '<td class="mezo" id="p_' + i + '_' + j + '" onmouseup="mouseClick(this, event);"></td>';
            palyaSzamok[i][j] = 0;
            palyaFelfedett[i][j] = 0;
        }
        s += '</tr>';
    }
    document.getElementById('palya').innerHTML = s;
    bombaElhelyez();
    //megMutat();
}

function bombaElhelyez(){
    var i = 0;
    while(i < bombakSzama){
        var sor = parseInt(Math.random() * sorokSzama);
        var oszlop = parseInt(Math.random() * oszlopokSzama);
        
        if (palyaSzamok[sor][oszlop] !== BOMBA) {
            palyaSzamok[sor][oszlop] = BOMBA;
            var szomszedok = getSzomszedok(new Pont(sor, oszlop));
            for (var j in szomszedok) {
                var pont = szomszedok[j];
                if (palyaSzamok[pont.sor][pont.oszlop] !== BOMBA) {
                    palyaSzamok[pont.sor][pont.oszlop]++;
                }
            }
            i++;
        }
    }
}

function megMutat(){
    for (var i = 0; i < sorokSzama; i++) {
        for (var j = 0; j < oszlopokSzama; j++) {
            document.getElementById('p_' + i + '_' + j).innerHTML = palyaSzamok[i][j];
        }
    }
}

function mouseClick(source, event){
       
    if (event.button === 0) {
        balKatt(source);
    }else{
        jobbKatt(source);
    }
}

function balKatt(source){
    if (vereseg) {
        alert('Vesztettél!');
    }else if (gyozelem) {
        alert('Nyertél!');
    }else{
        var id = source.id.split('_');
        var pont = new Pont(Number(id[1]), Number(id[2]));
        
        if (palyaFelfedett[pont.sor][pont.oszlop] === 0) {
            if (palyaSzamok[pont.sor][pont.oszlop] === BOMBA) {
                mutatBombak();
                robban(pont);
            }else{
                felfed(pont);
            }
        } 
        gyozelemEllenoriz();
    }
}

function jobbKatt(source){
    var id = source.id.split('_');
    var pont = new Pont(Number(id[1]), Number(id[2]));
        
    if (palyaFelfedett[pont.sor][pont.oszlop] === 0) {

        if (source.innerHTML === '') {
            source.innerHTML = '&#x1F6A9;';
        }else if (source.innerHTML === '🚩') {
            source.innerHTML = '?';
        }else if (source.innerHTML === '?') {
            source.innerHTML = '';
        }
    }
}

function robban(pont){
    var mezo = getMezo(pont);
    mezo.innerHTML = '&#x1F4A5;';
    mezo.className += ' robbanoMezo';
    vereseg = true;
}

function felfed(pont){
    var mezo = getMezo(pont);
    mezo.className += ' felfedettMezo';
    palyaFelfedett[pont.sor][pont.oszlop] = 1;
    mezo.innerHTML = '';
    
    if(palyaSzamok[pont.sor][pont.oszlop] === 0){
        var szomszedok = getSzomszedok(pont);

        for (var i in szomszedok) {
            var szomszedPont = szomszedok[i];

            if (palyaFelfedett[szomszedPont.sor][szomszedPont.oszlop] === 0) {
                felfed(szomszedPont);
            }
        }
    }else {
        mezo.innerHTML = palyaSzamok[pont.sor][pont.oszlop];
    }
}

function getMezo(pont){
    return document.getElementById('p_' + pont.sor + '_' + pont.oszlop);
}

function getSzomszedok(pont){
    var szomszedok = [];
    
    for (var i = pont.sor - 1; i <= pont.sor + 1; i++) {
        for (var j = pont.oszlop - 1; j <= pont.oszlop + 1; j++) {
            if (!(i === pont.sor && j === pont.oszlop) &&
                    (i >= 0 && i < sorokSzama) &&
                    (j >= 0 && j < oszlopokSzama)) {
                szomszedok.push(new Pont(i, j));
            }
        }
    }
    return szomszedok;
}

function gyozelemEllenoriz(){
    var felfedettMezokSzama = 0;
    for(var i = 0; i < sorokSzama; i++){
        for (var j = 0; j < oszlopokSzama; j++) {
            felfedettMezokSzama += palyaFelfedett[i][j];
        }
    }
    if (felfedettMezokSzama >= sorokSzama * oszlopokSzama - bombakSzama) {
        gyoz();
    }
}

function gyoz(){
    gyozelem = true;
    mutatBombak();
}

function mutatBombak(){
    for (var i = 0; i < sorokSzama; i++) {
        for (var j = 0; j < oszlopokSzama; j++) {
            if (palyaSzamok[i][j] === BOMBA) {
                var mezo = document.getElementById('p_' + i + '_' + j + '');
                mezo.innerHTML = '&#x1F4A3;';
            }
        }
    }
}

function Pont(sor, oszlop){
    this.sor = sor;
    this.oszlop = oszlop;
};

initPalya();

document.getElementById('palya').oncontextmenu = function ()
{
    return false;     // cancel default menu
};


