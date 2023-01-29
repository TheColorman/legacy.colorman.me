const records = {
    A: ['Fine Line', 'Harry Styles', '297'],
    B: ['Flower Boy', 'Tyler, The Creator', '137'],
    C: ['Thriller', 'Michael Jackson', '157'],
    D: ['Astroworld', 'Travis Scott', '197'],
    E: ['When We All Fall Asleep Where Do We Go?', 'Billie Eilish', '227'],
    F: ['Circles', 'Mac Miller', '237'],
    G: ['Kind Of Blue', 'Miles Davis', '137'],
    H: ['Blitz', 'Jung', '197'],
    I: ['The Dark Side Of The Moon', 'Pink Floyd', '197'],
    J: ['Jesus Is King', 'Kanye West', '217'],
    K: ['Harry Styles', 'Harry Styles', '167'],
    L: ['Abbey Road', 'The Beatles', '217'],
    M: ['Dizzy Mizz Lizzy', 'Dizzy Mizz Lizzy', '207'],
    N: ['Greatest Hits', 'Queen', '227'],
    O: ['Forevigt', 'Hans Philip', '217'],
    P: ['Californication', 'Red Hot Chili Peppers', '167'],
    Q: ['Rumours', 'Fleetwood Mac', '117'],
    R: ['Alter Echo', 'Dizzy Mizz Lizzy', '187'],
    S: ['Led Zeppelin IV', 'Led Zeppelin', '137'],
    T: ['Friends', 'Original Soundtrack', '277'],
    U: ['Bad', 'Michael Jackson', '157'],
    V: ['The Rise and Fall of Ziggy Stardust and the Spiders From Mars', 'David Bowie', '187'],
    W: ['Demon Days', 'Gorillaz', '197'],
    X: ['2014 Forest Hills Drive', 'J. Cole', '197'],
    Y: ['Nevermind', 'Nirvana', '197'],
    Z: ['Curtain Call: The Hits', 'Eminem', '197'],
    AA: ['Igor', 'Tyler, The Creator', '187'],
    AB: ['Random Access Memories', 'Daft Punk', '217'],
    AC: ['Beerbongs & Bentleys', 'Post Malone', '267'],
    AD: ['Metallica', 'Metallica', '217']
}

function storeRecord(number) {
    sessionStorage.setItem("recordNumber", number);
    window.location.href = "./buy/index.html";
}

function numToAlphabet(num) {
    var s = '';
    var t;

    while (num > 0) {
        t = (num - 1) % 26;
        s = String.fromCharCode(65 + t) + s;
        num = (num - t)/26 | 0;
    }
    return s || undefined;
}

document.addEventListener('DOMContentLoaded', function() {
    var recordNumber = sessionStorage.getItem("recordNumber");
    var recordLetter = numToAlphabet(recordNumber);
    document.getElementById("picture").src = "../img/records/" + recordNumber + ".jpg";
    document.getElementById("sName").innerHTML = records[recordLetter][0];
    document.getElementById('aName').innerHTML = records[recordLetter][1];
    document.getElementById('amount').innerHTML = records[recordLetter][2] + ' DKK';
    document.title = `Køb LP, ${records[recordLetter][0]} - ${records[recordLetter][1]} | Vinylplader.dk`;
    document.getElementById('available').innerHTML = document.getElementById('available').innerHTML + 'JA';
    document.getElementById('recprice').innerHTML = document.getElementById('recprice').innerHTML + records[recordLetter][2] + ' DKK';
    document.getElementById('delivprice').innerHTML = document.getElementById('delivprice').innerHTML + '33 DKK';
    document.getElementById('total').innerHTML = document.getElementById('total').innerHTML + (parseInt(records[recordLetter][2])+33) + ' DKK';
}, false);

function buyPage(src, song, price) {
    console.log('test: ' + src + song + price);
}