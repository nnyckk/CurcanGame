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
| ↑ ↓ + Enter | Alegi din meniu (merge și cu mouse-ul) |
| P | Pauză |
| M | Muzică pornită / oprită |

Pe telefon apar butoane pe ecran.

## Meniul

Pe ecranul de titlu sunt trei butoane:

- **JOACĂ** pornește jocul.
- **SETĂRI**: muzică (DA/NU), efecte sonore (DA/NU), ecran complet (dacă browserul îl permite) și **CONTROALE** (lista tastelor). Muzica și efectele se țin minte în browser. ESC sau ÎNAPOI te duce o pagină înapoi.
- **MOD TEST** deschide `test.html` (vezi mai jos).

Recordul apare în colțul din stânga jos al meniului principal. Cât timp muzica e oprită, în colțul din dreapta jos apare „MUZICĂ OFF”.

## Ce găsești în joc

- **5 niveluri:** Ferma (zi), Noaptea la fermă, Lacul, Pădurea de brazi (iarna), Noapte de iarnă. Ultimul se termină la restaurantul MESOPOTAMIA. (Deșertul a ieșit din joc deocamdată; e păstrat în cod pentru mai târziu.)
- **Noapte de iarnă:** pădurea de brazi noaptea, sub lună și stele, cu fulgi care cad. Amestecă felinarele (fermierii te văd doar în lumina din fața lor) cu lacurile înghețate (gheața crapă dacă stai pe loc): fermierii nu calcă pe gheață, ci patrulează pe mal, deci treci lacul când se uită în altă parte, fără să aștepți pe gheață. La capăt e restaurantul MESOPOTAMIA, cu zăpadă pe acoperiș, brazi în loc de palmieri și firma și ferestrele luminate.
- **Boss: FERMIERUL-ȘEF.** Chiar înainte de restaurant (cu un punct de salvare și un bloc cu power-up înainte: mic, te face mare; mare, îți dă afina înghețată) e o poiană cu un iaz înghețat și două scânduri deasupra lui. Te așteaptă un fermier uriaș, clasic: pălărie de paie, barbă castanie, cămașă în carouri roșu cu alb, salopetă de blugi, cizme și furcă; fața își schimbă expresia (încruntat, răcnind, obosit, amețit, lovit). Poiana e luminată de două felinare pe stâlpi, la capete, care se fac roșii și pulsează cât boss-ul se pregătește să sară peste tine sau să dea buzna. Când intri, în spatele tău cad niște butuci, camera se oprește pe poiană și pornește muzica de boss; sus apare numele lui și 3 inimi.
  - **Furcile:** aruncă trei, una după alta, spre locul unde ești; de fiecare dată trage întâi furca înapoi și tremură. Furcile se înfig în sol și dispar. După a treia furcă e **obosit** 3 secunde: gâfâie, transpiră și se clatină.
  - **Bombele:** aruncă două bombe aprinse, la întâmplare pe jos, dar niciodată lângă el; stau în fund, cu fitilul obișnuit (cam 3 secunde). Sunt bombele obișnuite: le poți împinge spre el, iar dacă explodează lângă el, se rănește.
  - **Săritura:** pe sol apare un cerc roșu care clipește acolo unde va ateriza, lângă tine; sare, aterizează și te împunge imediat cu furca. Fugi din semn sau urcă pe o scândură.
  - **De la 2 inimi:** după fiecare lovitură primită cheamă 2–3 mobi (fermieri sau ucenici, la întâmplare), care sar din brazi.
  - **La ultima inimă,** în plus: când ești pe sol și departe de el, bate din picior („!”) și fuge spre tine cu furca în față, ca un taur. Dacă te ratează (sari peste el sau urci pe o scândură), se izbește de margine și rămâne **amețit** 3 secunde (steluțe).
  - **Fuge de bombe:** dacă vede o bombă aprinsă lângă picioarele lui, după o clipă sare pe o scândură apropiată și așteaptă acolo să explodeze, fuge în partea cealaltă sau, încolțit, sare peste ea. Nu poate fugi când e obosit, amețit, cub de gheață sau în mijlocul unui atac (furcile, săritura cu împunsătura, fuga ca un taur): atunci e momentul să-i pui bombe la picioare.
  - **Cum îl învingi (3 lovituri):** împingi bombele în el (orice bombă care explodează lângă el îl rănește), îi sari în cap când e obosit sau amețit (altfel pălăria te aruncă înapoi), sau îl lovești de 10 ori cu pene de gheață: se face un cub de gheață pentru 5 secunde și atunci îi poți sări în cap. Cubul e un bloc solid: nu treci prin el și nu-l poți împinge (e prea greu), trebuie să sari peste el sau pe el. Sub numele lui se vede câte pene de gheață l-au nimerit. După fiecare lovitură e mai rapid.
  - Săriturile lui nu sparg gheața (bombele, da). Nu stă niciodată deasupra apei: nu calcă în găurile din gheață, iar dacă se deschide una sub el, sare pe un loc sigur.
  - Învins, e aruncat de pe ecran, poarta spre restaurant se sparge și drumul e liber.
- **Lacul:** ferma ziua, dar aproape tot nivelul e un lac mare, iar drumul e pe sus: scânduri, insule care ies din apă, platforme care se mișcă (stânga-dreapta sau sus-jos) și platforme vechi, crăpate, care cad în lac la scurt timp după ce te urci pe ele (după câteva secunde reapar). Dacă pici în lac, pierzi o viață. Are două puncte de salvare, pe mici bucăți de mal. Pe lac e viață: rațe albe cu boboci (se scufundă cu coada în sus și fug măcăind dacă pleoscăie ceva lângă ele), pești care sar din apă, libelule, broaște pe nuferi care orăcăie și sar în apă când te apropii, umbre de pești sub apă și cercuri pe apă.
- **Ecranul dinaintea fiecărui nivel:** decorul nivelului, drumul spre MESOPOTAMIA (unde ai ajuns) și un sfat ales la întâmplare. Nivelul pornește când apeși ENTER sau SPACE.
- **Pădurea de brazi:** e un nivel de două ori mai lung, cu un lac foarte mare spre final, peste care sunt platforme sus, păzite de mobi. E iarnă, cu munți înzăpeziți în spate, brazi, zăpadă pe jos și pe blocuri și fulguire ușoară. Muzica e mai liniștită, ca niște clopoței. Lacurile sunt mari și înghețate și se poate merge pe ele, dar:
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
  - Dacă gheața se sparge, moare: când îi sari în cap, când îl împingi în ceva (perete, alt mob) sau când îl prinde o explozie. Dacă îl împingi într-un alt mob, mor amândoi (fermierul, ucenicul sau bomba e aruncat de pe ecran, iar bomba nu mai explodează; alt înghețat se sparge și el). Bomba înghețată se sparge fără să explodeze.
  - Dacă nu-l spargi, în ultima secundă tremură și crapă, apoi se dezgheață și își revine.
  - Dacă e lovit, curcanul pierde costumul de gheață, dar rămâne mare. Boaba roșie și afina se înlocuiesc una pe alta.
- **Bombele:** se plimbă, iar când te apropii își aprind fitilul și aleargă după tine. Dacă le sari în cap, se așază în fund pe loc (fitilul mai ține ~3,3 secunde). Dacă le mai sari o dată în cap, le lansezi în direcția în care se uită curcanul; o bombă care alunecă se oprește dacă îi sari în cap. Împinse din lateral, pornesc repede, alunecă vreo 15 tile-uri încetinind treptat până se opresc și ricoșează din pereți. Împinge-le spre fermieri și alți mobi: explozia îi ia cu ea, dar te poate răni și pe tine dacă ești aproape.
- **Dușmani:** țepi, bombe cu fitil și două feluri de fermieri. Îi oprești sărind pe ei.
  - **Ucenicul** (cămașă verde, cu găleată) n-are furcă: se plimbă încet înainte și înapoi, nu te urmărește și te rănește doar dacă intri în el. 100 de puncte.
  - **Fermierul cu furcă** (cămașă roșie) te urmărește și, când ajunge lângă tine, te împunge (trage întâi furca înapoi — sari peste ea). 200 de puncte.
  - În primul nivel sunt la început doar ucenici; fermierii cu furcă apar abia spre final. În nivelul 2 sunt amestecați (ucenicii n-au felinar și nu te caută).
- **Apele mai mari** (de cel puțin 7 tile-uri) au umbre de pești sub apă (iarna, pe sub gheață). La fermă au și câte un locuitor: ziua o rață, noaptea o broască pe un nufăr.
- **Gropi cu apă:** curcanul încă nu știe să înoate. Dacă pică în apă, pleoscăie, se scufundă și pierde o viață. Bombele căzute în apă se sting fără să explodeze, iar dacă le-ai împins tu acolo, primești 100 de puncte.
- **Puncte de salvare** la jumătatea fiecărui nivel (lacul și pădurea de brazi, mai lungi, au câte două), cronometru și record salvat în browser.

## Testare

Deschide `test.html` (sau apasă MOD TEST în meniu). E un laborator: fără cronometru, cu vieți infinite (la moarte reapari pe loc). Jocul pornește în arena de test, iar în dreapta ai un panou:

- **Nivel:** carduri cu poza primului ecran al fiecărui nivel; click pe unul și îl joci. Arena de test se poate juca în oricare dintre cele 5 decoruri (Zi, Noapte, Iarnă, Iarnă noapte și Deșert, păstrat pentru viitor). Dacă termini un nivel, treci la următorul, ca în joc.
- **Pornește de la:** începutul nivelului sau unul dintre punctele de salvare. „Repornește de aici” (sau tasta **R**) reia nivelul de unde ai reapărea dacă ai muri.
- **Harta de sub joc:** tot nivelul în mic, cu ce se vede acum pe ecran, punctele de salvare, ținta, mobii și curcanul. Dacă dai click sau tragi pe hartă, curcanul se mută acolo.
- **Curcanul:** îl faci mic, mare, de foc sau de gheață.
- **Mobi:** ucenic, fermier, bombă sau bombă în fund, care apar în fața curcanului; îi poți și șterge pe toți.
- **Unelte:** invincibil, hitbox-uri (cu legenda culorilor), viteză 1× / ½× / ¼×, pauză și avans cu un singur cadru.

Butoanele folosesc chiar sprite-urile din joc. Același mod se poate deschide și direct, cu `index.html?test` (doar jocul, fără panou). Din panou te întorci la meniu cu „← Meniu”.

## Tehnic

Totul e într-un singur fișier, `index.html`, fără biblioteci externe:

- grafica e desenată din cod (sprite-uri pixel-art definite ca text),
- muzica și efectele sonore sunt generate cu Web Audio API (chiptune pe gama Hijaz),
- fontul pixel 5×7 are și diacritice românești.
