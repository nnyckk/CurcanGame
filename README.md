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

- **4 niveluri:** Ferma (zi), Noaptea la fermă, Pădurea de brazi (iarna), Deșertul (noapte). Ultimul se termină la restaurantul MESOPOTAMIA.
- **Pădurea de brazi:** e iarnă, cu munți înzăpeziți în spate, brazi, zăpadă pe jos și pe blocuri și fulguire ușoară. Muzica e mai liniștită, ca niște clopoței. Lacurile sunt mari și înghețate și se poate merge pe ele, dar:
  - pe gheață aluneci puțin când te oprești sau întorci;
  - gheața e doar un strat subțire la suprafață: dacă stai ~2 secunde pe același loc, trosnește, crapă și cazi prin ea în lac; gaura îngheață la loc după câteva secunde;
  - în unele lacuri sunt copci (apă deschisă, cu margini zimțate, bucăți de gheață plutind și țăruși cu steguleț roșu pe margini) pe care trebuie să le sari;
  - fermierii și bombele nu intră pe gheață, se opresc la mal; bombele împinse alunecă însă pe gheață de două ori mai departe;
  - explozia unei bombe sparge gheața pe care o atinge (și ea îngheață la loc după câteva secunde).
- **Noaptea la fermă:** ferestrele caselor sunt luminate, prin iarbă zboară licurici, pe cer sunt lună și stele, iar muzica e mai lentă și mai joasă. Fermierii au felinar și te văd doar dacă intri în lumina din fața lor; te poți strecura prin spatele lor. Dacă scapi din lumină, te mai caută puțin, apoi rămân nedumeriți („?”).
- **Bănuți cu M:** la 50 de bănuți primești o viață în plus.
- **Grăuntele auriu:** iese din unele blocuri M și face curcanul mare. Mare, poate sparge cărămizi, iar dacă e lovit, redevine mic.
- **Boaba roșie strălucitoare:** iese din aceleași blocuri când curcanul e deja mare (dacă între timp te-ai făcut mic și o iei, te face direct curcan de foc). Curcanul primește un costum roșu și aruncă pene de foc (maximum 2 deodată), care zboară cam 8 tile-uri. Penele dau jos fermierii și aprind fitilul bombelor. Dacă e lovit, curcanul pierde costumul roșu, dar rămâne mare.
- **Afina înghețată (doar iarna):** în pădurea de brazi iese din blocuri în locul boabei roșii. Curcanul primește un costum albastru deschis și aruncă pene de gheață (tot cu X), care îngheață fermierii, ucenicii și bombele (bombelor li se stinge fitilul).
  - Un dușman înghețat stă ~5 secunde prins într-un bloc de gheață: nu se mișcă, nu te rănește și îl poți împinge (alunecă, iar pe lac și mai departe).
  - Dacă gheața se sparge, moare: când îi sari în cap, când îl împingi în ceva (perete, alt mob) sau când îl prinde o explozie. Doi înghețați care se ciocnesc mor amândoi. Bomba înghețată se sparge fără să explodeze.
  - Dacă nu-l spargi, în ultima secundă tremură și crapă, apoi se dezgheață și își revine.
  - Dacă e lovit, curcanul pierde costumul de gheață, dar rămâne mare. Boaba roșie și afina se înlocuiesc una pe alta.
- **Bombele:** se plimbă, iar când te apropii își aprind fitilul și aleargă după tine. Dacă le sari în cap, se așază în fund pe loc (fitilul mai ține ~3,3 secunde). Dacă le mai sari o dată în cap, le lansezi în direcția în care se uită curcanul; o bombă care alunecă se oprește dacă îi sari în cap. Împinse din lateral, pornesc repede, alunecă vreo 15 tile-uri încetinind treptat până se opresc și ricoșează din pereți. Împinge-le spre fermieri și alți mobi: explozia îi ia cu ea, dar te poate răni și pe tine dacă ești aproape.
- **Dușmani:** țepi, bombe cu fitil și două feluri de fermieri. Îi oprești sărind pe ei.
  - **Ucenicul** (cămașă verde, cu găleată) n-are furcă: se plimbă încet înainte și înapoi, nu te urmărește și te rănește doar dacă intri în el. 100 de puncte.
  - **Fermierul cu furcă** (cămașă roșie) te urmărește și, când ajunge lângă tine, te împunge (trage întâi furca înapoi — sari peste ea). 200 de puncte.
  - În primul nivel sunt la început doar ucenici; fermierii cu furcă apar abia spre final. În nivelul 2 sunt amestecați (ucenicii n-au felinar și nu te caută).
- **Gropi cu apă:** curcanul încă nu știe să înoate. Dacă pică în apă, pleoscăie, se scufundă și pierde o viață. Bombele căzute în apă se sting fără să explodeze, iar dacă le-ai împins tu acolo, primești 100 de puncte.
- **Puncte de salvare** la jumătatea fiecărui nivel, cronometru și record salvat în browser.

## Testare

Deschide `test.html`: jocul pornește într-o arenă de test (fără cronometru, cu vieți infinite), iar în dreapta ai un panou cu butoane. Poți da power-up-uri, poți aduce fermieri și bombe în fața curcanului și poți porni invincibilitatea, slow motion-ul și afișarea hitbox-urilor. Arena se poate trece și pe noapte (felinare) sau pe iarnă (cu un lac înghețat). Același mod se poate deschide și direct, cu `index.html?test`.

## Tehnic

Totul e într-un singur fișier, `index.html`, fără biblioteci externe:

- grafica e desenată din cod (sprite-uri pixel-art definite ca text),
- muzica și efectele sonore sunt generate cu Web Audio API (chiptune pe gama Hijaz),
- fontul pixel 5×7 are și diacritice românești.
