# Curcanul în Fugă

Un platformer pixel-art în browser. Ești un curcan și trebuie să ajungi la restaurantul fast food **MESOPOTAMIA** ca să câștigi.

## Cum joci

Deschide `index.html` în orice browser modern. Nu e nevoie de instalare sau server.

| Tastă | Acțiune |
|---|---|
| ← → | Mergi |
| SPACE | Sari (ține apăsat ca să sari mai sus) |
| X (ținut apăsat) | Fugi |
| X (apăsare scurtă) | Aruncă o pană de foc (doar cu boaba roșie) |
| Enter | Start |
| P | Pauză |
| M | Muzică pornită / oprită |

Pe telefon apar butoane pe ecran.

## Ce găsești în joc

- **3 niveluri:** Ferma (zi), Orașul (apus), Deșertul (noapte). Ultimul se termină la restaurantul MESOPOTAMIA.
- **Bănuți cu M:** la 50 de bănuți primești o viață în plus.
- **Grăuntele auriu:** iese din unele blocuri M și face curcanul mare. Mare, poate sparge cărămizi, iar dacă e lovit, redevine mic.
- **Boaba roșie strălucitoare:** iese din aceleași blocuri când curcanul e deja mare (dacă între timp te-ai făcut mic și o iei, te face direct curcan de foc). Curcanul primește un costum roșu și aruncă pene de foc (maximum 2 deodată), care zboară cam 8 tile-uri. Penele dau jos fermierii și aprind fitilul bombelor. Dacă e lovit, curcanul pierde costumul roșu, dar rămâne mare.
- **Bombele:** se plimbă, iar când te apropii își aprind fitilul și aleargă după tine. Dacă le sari în cap, se așază în fund pe loc (fitilul mai ține ~3,3 secunde). Împinse din lateral, pornesc repede, alunecă vreo 15 tile-uri încetinind treptat până se opresc și ricoșează din pereți. Împinge-le spre fermieri și alți mobi: explozia îi ia cu ea, dar te poate răni și pe tine dacă ești aproape.
- **Dușmani:** țepi, bombe cu fitil și fermieri care te urmăresc și, când ajung lângă tine, te împung cu furca (trag întâi furca înapoi — sari peste ea). Îi oprești sărind pe ei.
- **Gropi cu apă:** curcanul încă nu știe să înoate. Dacă pică în apă, pleoscăie, se scufundă și pierde o viață. Bombele căzute în apă se sting fără să explodeze, iar dacă le-ai împins tu acolo, primești 100 de puncte.
- **Puncte de salvare** la jumătatea fiecărui nivel, cronometru și record salvat în browser.

## Testare

Deschide `test.html`: jocul pornește într-o arenă de test (fără cronometru, cu vieți infinite), iar în dreapta ai un panou cu butoane. Poți da power-up-uri, poți aduce fermieri și bombe în fața curcanului și poți porni invincibilitatea, slow motion-ul și afișarea hitbox-urilor. Același mod se poate deschide și direct, cu `index.html?test`.

## Tehnic

Totul e într-un singur fișier, `index.html`, fără biblioteci externe:

- grafica e desenată din cod (sprite-uri pixel-art definite ca text),
- muzica și efectele sonore sunt generate cu Web Audio API (chiptune pe gama Hijaz),
- fontul pixel 5×7 are și diacritice românești.
