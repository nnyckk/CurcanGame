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
| ↓ (în aer) | Lovitură în pământ: o clipă stă pe loc, apoi cade drept în jos. Deschide blocurile de dedesubt, sparge cărămizile (curcanul mare) și gheața lacurilor |
| ↑ | Intri / ieși din cafeneaua din nivelul bonus (în fața ușii) |
| ↑ ↓ + Enter | Alegi din meniu (merge și cu mouse-ul) |
| P | Pauză |
| M | Muzică pornită / oprită |

Pe telefon și tabletă apar butoane pe ecran (▼ e lovitura în pământ; în fața unei uși, în locul lui apare ▲). Pe desktop nu apar, nici dacă ecranul e tactil.

## Meniul

Pe ecranul de titlu sunt trei butoane, iar jos două insigne:

- **JOACĂ** pornește jocul.
- **SETĂRI**: muzică (DA/NU), efecte sonore (DA/NU), ecran complet (dacă browserul îl permite), **CURCAN DE AUR** (DA/NU, apare doar după ce ai găsit toate penele de aur) și **CONTROALE** (lista tastelor). Setările se țin minte în browser. ESC sau ÎNAPOI te duce o pagină înapoi.
- Jos, lângă record, insigna **PENE** arată câte pene de aur ai găsit din câte sunt în joc. E și un buton (dai click pe ea sau o atingi; se luminează doar cât ții mouse-ul pe ea, nu rămâne aleasă): deschide pagina **PENE DE AUR**, care explică ce ai de făcut. Îți spune pe scurt că în fiecare nivel se ascund 3 pene de aur, că o pană contează doar dacă ajungi cu ea la final și „ADUNĂ-LE PE TOATE. MERITĂ.” (fără să spună ce primești). După ce le ai pe toate, îți spune că surpriza te așteaptă în SETĂRI. Jos are câte un cartonaș pentru fiecare nivel: numărul nivelului și cele 3 pene mari; cele găsite sunt aurii și sclipesc din când în când, cele negăsite sunt doar o umbră; un nivel cu toate penele are cartonașul auriu. Butonul ÎNAPOI stă imediat sub casetă.
- Lângă ea, insigna **ACHIEVEMENTS** arată câte ai deblocat din 16 (la fel, un buton luminat doar la hover): deschide pagina **ACHIEVEMENTS** (vezi mai jos).
- **MOD TEST** deschide `test.html` (vezi mai jos).

Recordul apare în colțul din stânga jos al meniului principal.

## Achievements

16 lucruri de făcut, doar de colecționat (nu dau nimic în plus). 11 se văd de la început, 5 sunt secrete:

| Achievement | Ce trebuie să faci |
|---|---|
| POFTĂ BUNĂ! | ajungi la restaurantul MESOPOTAMIA |
| PANĂ PESTE PANĂ | strângi toate cele 15 pene de aur |
| BOGĂTAȘ | iei toți cei 50 de bănuți din nivelul bonus (într-o singură trecere) |
| FĂRĂ ZGÂRIETURĂ | termini un nivel fără să fii lovit (nici după o viață pierdută acolo) |
| ZIUA CURCANULUI | îl învingi pe Fermierul-Șef fără să te lovească în toată lupta |
| COMBO DE CURCAN | sari în cap la 4 dușmani la rând, fără să atingi solul |
| FULGER | termini un nivel cu cel puțin 200 de secunde rămase |
| NEMURITOR | termini tot jocul, de la primul nivel, fără să pierzi nicio viață |
| UMBRĂ ÎN NOAPTE | termini Ora de culcare fără să te vadă vreun fermier cu felinar |
| OCHI DE VULTUR | nimerești 2UP la blocul-slot din cafenea |
| PIROMAN | dobori 100 de dușmani cu penele de foc (se adună de la un joc la altul) |
| *secret:* ERA GLACIARĂ | îl îngheți pe Fermierul-Șef cu penele de gheață |
| *secret:* NEPOT ASCULTĂTOR | ajungi de 10 ori în cafeneaua lui Moș Curcan (o dată pe joc) |
| *secret:* CAP TARE | dai de 30 de ori cu capul în blocul gol din cafenea |
| *secret:* CURCANII NU ÎNOATĂ | cazi în apă de 10 ori (se adună de la un joc la altul) |
| *secret:* AUTOGOL | te prinde explozia unei bombe pe care ai așezat-o sau împins-o chiar tu |

- Când deblochezi unul, sus pe ecran coboară o casetă aurie cu iconița lui, „ACHIEVEMENT!” și numele lui, cu o mică fanfară; jocul nu se oprește. Dacă deblochezi mai multe deodată, vin una după alta.
- Pagina **ACHIEVEMENTS** din meniu are câte un cartonaș pentru fiecare, câte 8 pe pagină (2 rânduri de câte 4, cu spațiu între ele; deci 2 pagini pline), cu o iconiță simplă (o formă mare, cu contur, direct pe cartonaș, fără ramă) și numele scris mărunt dedesubt, pe o fâșie mai închisă, despărțită de iconiță printr-o linie (iconița stă fix la mijlocul părții de sus): clopotul de servit, pana de aur, cuibul cu bani (cu bănuțul din joc), scutul cu bifă, confetti de petrecere, steaua cu „X4”, fulgerul, inima cu aripi în spate, luna, ținta, flacăra, fulgul de zăpadă, ceașca de cafea cu aburi, cărămida spartă, colacul de salvare pe apă, bomba din joc (furioasă, cu picioarele strânse), cu fitilul aprins. Deblocat: cartonaș auriu, iconiță colorată, din când în când sclipește. Blocat: iconița stinsă, cu un lacăt. Cele secrete nedeblocate au un „?” și „???”. Cartonașul ales (cu săgețile sau cu mouse-ul) se face roșu și se ridică puțin. Pagina se schimbă din săgețile ◀ ▶ de pe margini sau cu ← → când treci de marginea rândului (și de pe ÎNAPOI); sub cartonașe sunt bulinele paginilor, apoi ce înseamnă cel ales; la cele secrete nedeblocate scrie doar că sunt secrete.
- Se țin minte în browser (în modul de test, separat). Ce ai făcut deja înainte să existe achievements (toate penele, ai ajuns la MESOPOTAMIA) se deblochează singur, fără casetă. Cât timp muzica e oprită, în colțul din dreapta jos apare „MUZICĂ OFF”.

## Ce găsești în joc

- **5 niveluri și un nivel bonus:** Ferma (zi), Noaptea la fermă, Lacul, apoi nivelul bonus Popas la MesoCafé, Pădurea de brazi (iarna) și Noapte de iarnă. Ultimul se termină la restaurantul MESOPOTAMIA. Nivelul bonus nu se numără (Pădurea de brazi rămâne nivelul 4). (Deșertul a ieșit din joc deocamdată; e păstrat în cod pentru mai târziu.)
- **Terenul (deocamdată în nivelurile 1 și 2):** nu mai e doar drept. La început, în locul țepilor, e un deal dublu (unul mic în față, unul mare în spate), cu câte un ucenic pe fiecare și bănuți deasupra. Are un deal mare după punctul de salvare, cu un pasaj pe dedesubt (acoperiș ca o placă groasă, tavan în trepte, ca o piramidă: intrările mai joase, la mijloc mai înalt, cu loc pentru capul curcanului mare; la gură peretele dealului coboară și se rotunjește spre tavan, ca o boltă; bănuți sus, sub tavanul înalt); pe sus poți merge peste deal. Înainte de final e un deal dublu: unul mic în față și, decalat în spatele lui, unul mai mare, mai închis la culoare, ca și cum ar fi mai departe; de pe cel mic sari pe iarba celui mare, unde sunt bănuți. Pământul e mai închis spre mijlocul unui deal sau în adâncime și mai deschis lângă margini și sub iarbă, în doar 3 nuanțe, cu treceri ușor colțuroase, fără linii între pătrățele, în toate nivelurile. Are un contur închis pe laturi și dedesubt, cu latura din dreapta în umbră, ca un fals 3D; marginile se desenează singure oriunde se termină pământul (și la gropi). Prin colțurile rotunjite se vede ce e în spate (dealul din spate sau pasajul), nu cerul. Pământul din spate (același pământ ca solul, cu aceleași pietricele și rădăcini, dar mai închis, cu aceeași umbrire lină ca pământul din față (mai deschis lângă margini, mai închis spre mijloc), cu iarbă verde aprinsă sus) pornește din sol și continuă în spatele celui din față: treci prin fața lui, dar pe iarba lui de sus poți sta și sări, ca pe scânduri (urci din lateral sau de jos prin el). Adânciturile au pământ jos, deci nu sunt apă.
- **Blocuri cu mobi pe ele:** în multe locuri, în loc de scânduri subțiri sunt rânduri de cărămizi și blocuri M pe care se plimbă ucenici, fermieri sau bombe (se întorc la margine). Dacă dai cu capul în bloc de dedesubt cât stă un mob pe el, fermierul sau ucenicul e doborât, iar bomba se aprinde. Peste gropi și apă au rămas scânduri.
- **Nivelul bonus, Popas la MesoCafé:** la începutul iernii, între Lac și Pădurea de brazi. E scurt (mai scurt decât primul nivel) și liniștit: fără punct de salvare, fără blocuri cu power-up și fără trepte; doar câțiva ucenici, două iazuri mici înghețate, două scânduri și exact 50 de bănuți (cât pentru o viață), cu cei din blocurile M: un rând după blocurile de la început, un arc pe drumul săriturii peste primul iaz, câțiva pe două scânduri în trepte înainte de MesoCafé (cei de sus, o răsplată pentru cine urcă), o grămadă de 10 după cafenea, blocuri cu câte un bănuț deasupra fiecăruia, o boltă peste copca celui de-al doilea iaz și un rând spre tăbliță. Pe drumul spre MESOPOTAMIA are o steluță în loc de bulină, iar sus scrie „NIVEL BONUS”.
  - La mijloc e o căsuță MesoCafé: pereți maro-cafea cu accente galbene, o bandă neagră cu sigla „MesoCafé” (cu litere mici și accent pe é), ferestre luminate cu rame galbene, o ușă de stejar cât personajele, zăpadă pe acoperiș și un horn din care iese fum. În fața ușii apare deasupra ei o tastă mică ↑: apeși ↑ și intri (ecranul se întunecă o clipă și sună un clopoțel).
  - Înăuntru e o cafenea veche, mică, joasă, întunecată și caldă (în jurul ei e întuneric), cu totul la scara ușii (lambriul și tejgheaua cam de un metru): tapet vișiniu, lambriu și podea din lemn închis, o grindă sus, două lămpi de alamă cu lumină caldă, firma MesoCafé pe o tăbliță cu ramă de alamă, o fereastră mică cu perdele de catifea prin care se vede ninsoarea, un tablou vechi, un ceas de perete, două măsuțe rotunde de marmură cu scaune de lemn curbat cu perne roșii (pe una, o cafea care aburește), mijlocul liber pentru blocul-slot și o tejghea veche cu espressor de alamă, căni și rafturi cu sticle și borcane. Cântă o piesă jazz lentă, în swing (pian electric, bas walking, perii pe tobă). Cât stai înăuntru, timpul nu curge. Ieși tot cu ↑, la ușa din stânga.
  - Lângă tejghea stă un curcan bătrânel și gras, prietenos: pălărie de fetru, sprâncene albe, ochelari, pipă din care iese fum, vestă verde cu nasturi aurii și baston. Se uită după tine. Când intri prima dată, îți vorbește într-o casetă mică de dialog jos pe ecran, cu bustul lui într-o ramă și numele lui (MOȘ CURCAN) într-o etichetă deasupra; îți spune „fiule”: îți urează bun venit, te întreabă dacă ești obosit, îți spune să te odihnești puțin din aventura ta și îți spune că la blocul mare ai o singură încercare, așa că să-l lovești fix când arată ce vrei. Literele apar pe rând; când s-a scris tot rândul, apare jos în dreapta un triunghi mic, gri, iar cu SPACE, ENTER sau ↑ (pe telefon: atingi ecranul) treci la replica următoare. Cât vorbește, jocul stă. Dacă stai lângă el și apeși ↑, îți mai spune ceva; după slot, îți spune ce ți-a ieșit.
  - **Blocul-slot**, în mijlocul camerei: un bloc mare, auriu, cu becuri pe margine, care arată pe rând boaba roșie, afina înghețată, „2UP” și un X (repede, cam o șesime de secundă fiecare). E un mini-joc de îndemânare, nu noroc: îl lovești cu capul o singură dată, iar ce arată în clipa aia, aia primești. Dacă simbolul tocmai s-a schimbat cât urcai din săritură, primești ce era înainte, adică ce ai văzut când ai sărit. Simbolul nimerit clipește puțin, cu becurile alergând repede, apoi primești premiul. Premiul ți se dă pe loc, nu trebuie să-l iei: boaba roșie te face direct curcan de foc, afina curcan de gheață (și dacă erai mic), 2UP îți dă două vieți în plus, iar X nu-ți dă nimic. Bătrânelul comentează ce ți-a ieșit. După aceea blocul rămâne gol, chiar dacă pierzi o viață și reiei nivelul. Dacă tot dai cu capul în blocul gol, camera se zgâlțâie de la prima lovitură, iar după primele 5 se cerne și puțin praf din tavan, din locuri la întâmplare (se stinge repede, înainte să ajungă jos). Moș Curcan se supără tot mai tare că-i strici cafeneaua („MAI ÎNCET, CĂ-MI STRICI CAFENEAUA! ABIA AM ZUGRĂVIT-O!”, „GATA, ȚI-O TREC PE NOTĂ: O CAFEA ȘI UN TAVAN NOU!” și altele).
- **Noapte de iarnă:** pădurea de brazi noaptea, sub lună și stele, cu fulgi care cad. Amestecă felinarele (fermierii te văd doar în lumina din fața lor) cu lacurile înghețate (gheața crapă dacă stai pe loc): fermierii nu calcă pe gheață, ci patrulează pe mal, deci treci lacul când se uită în altă parte, fără să aștepți pe gheață. La capăt e restaurantul MESOPOTAMIA, cu zăpadă pe acoperiș, brazi în loc de palmieri și firma și ferestrele luminate.
- **Boss: FERMIERUL-ȘEF.** Chiar înainte de restaurant (cu un punct de salvare și, înainte, un bloc albăstrui din care iese mereu afina înghețată, fie că ești mic, fie că ești mare) e o poiană cu un iaz înghețat și două scânduri deasupra lui. Te așteaptă un fermier uriaș, clasic: pălărie de paie, barbă castanie, cămașă în carouri roșu cu alb, salopetă de blugi, cizme și furcă; fața își schimbă expresia (încruntat, răcnind, obosit, amețit, lovit). Poiana e luminată de două felinare de fermă (cu petrol, atârnate de stâlpi de lemn), la capete, care își fac lumina roșie și pulsează cât boss-ul se pregătește să sară peste tine sau să dea buzna. Când intri, în spatele tău cade o stivă de baloți de fân și camera se oprește pe poiană. Prima dată când îl vezi, îți vorbește în aceeași casetă de dialog ca Moș Curcan, cu bustul lui (încruntat, cu furca) și numele FERMIERUL-ȘEF pe etichetă: îți spune că de aici nu mai scapi și că la restaurant ajungi... pe meniu. Cât vorbește, scena urcă puțin, ca să se vadă și curcanul, și el, deasupra casetei. Dacă pierzi o viață și te întorci, nu mai vorbește; doar răcnește și începe lupta. Când răcnește pornește muzica de boss (bara cu viața lui apare abia acum, nu cât vorbește); sus apare numele lui și, sub el, o bară roșie mare cu 3 segmente, câte unul pentru fiecare viață. Un segment pierdut rămâne gol, iar la fiecare lovitură bara tremură și segmentul pierdut clipește alb, apoi se golește.
  - **Furcile:** aruncă trei, una după alta, spre locul unde ești; de fiecare dată trage întâi furca înapoi și tremură. Furcile se înfig în sol și dispar. După a treia furcă e **obosit** 3 secunde: gâfâie, transpiră și se clatină.
  - **Bombele:** aruncă două bombe aprinse, la întâmplare pe jos, dar niciodată lângă el; stau în fund, cu fitilul obișnuit (cam 3 secunde). Sunt bombele obișnuite: le poți împinge spre el, iar dacă explodează lângă el, se rănește.
  - **Săritura:** pe sol apare un cerc roșu care clipește acolo unde va ateriza, lângă tine; sare, aterizează și te împunge imediat cu furca. Fugi din semn sau urcă pe o scândură.
  - **De la 2 inimi:** după fiecare lovitură primită cheamă 2–3 mobi (fermieri sau ucenici, la întâmplare), care intră pe jos din lateral: din stânga, de după baloții de fân, și din dreapta, de după cealaltă stivă de fân. Deasupra marginii din care vin apare un „!”; dacă stai chiar lângă o margine, vin toți din partea cealaltă.
  - **La ultima inimă,** în plus: când ești pe sol și departe de el, bate din picior („!”) și fuge spre tine cu furca în față, ca un taur. Dacă te ratează (sari peste el sau urci pe o scândură), se izbește de margine și rămâne **amețit** 3 secunde (steluțe).
  - **Fuge de bombe:** dacă vede o bombă aprinsă lângă picioarele lui, după o clipă sare pe o scândură apropiată și așteaptă acolo să explodeze, fuge în partea cealaltă sau, încolțit, sare peste ea. Nu poate fugi când e obosit, amețit, cub de gheață sau în mijlocul unui atac (furcile, săritura cu împunsătura, fuga ca un taur): atunci e momentul să-i pui bombe la picioare.
  - **Cum îl învingi (3 lovituri):** împingi bombele în el (orice bombă care explodează lângă el îl rănește), îi sari în cap când e obosit sau amețit (altfel pălăria te aruncă înapoi), sau îl lovești de 10 ori cu pene de gheață: se face un cub de gheață pentru 5 secunde și atunci îi poți sări în cap. Cubul e un bloc solid: nu treci prin el și nu-l poți împinge (e prea greu), trebuie să sari peste el sau pe el. Sub numele lui se vede câte pene de gheață l-au nimerit. După fiecare lovitură e mai rapid.
  - Săriturile lui nu sparg gheața (bombele, da). Nu stă niciodată deasupra apei: nu calcă în găurile din gheață, iar dacă se deschide una sub el, sare pe un loc sigur.
  - Învins, e aruncat de pe ecran, iar ambele stive de baloți de fân (cea din spatele tău și cea din dreapta, care închide drumul spre restaurant) se prăbușesc într-un nor de praf și paie. Rămân pe jos baloți desfăcuți și fân împrăștiat, iar drumul e liber în ambele direcții.
- **Lacul:** ferma ziua, dar aproape tot nivelul e un lac mare, iar drumul e pe sus: scânduri, insule care ies din apă, platforme care se mișcă (stânga-dreapta sau sus-jos) și platforme vechi, crăpate, care cad în lac la scurt timp după ce te urci pe ele (după câteva secunde reapar). Dacă pici în lac, pierzi o viață. Are două puncte de salvare, pe mici bucăți de mal. Pe lac e viață: rațe albe cu boboci (se scufundă cu coada în sus și fug măcăind dacă pleoscăie ceva lângă ele), pești care sar din apă, libelule, broaște pe nuferi care orăcăie și sar în apă când te apropii, umbre de pești sub apă și cercuri pe apă.
- **Ecranul dinaintea fiecărui nivel:** decorul nivelului, drumul spre MESOPOTAMIA (unde ai ajuns; nivelul bonus are o steluță) și un sfat de la **Moș Curcan**, înțeleptul jocului: îl spune în caseta lui de dialog (cu bustul și numele lui), cu literele care apar pe rând și „bla-bla”-ul lui. Sfaturile sunt cu vorbele lui („FIULE”), despre nivel, decor, bombe, gheață și penele de aur. Nivelul pornește când apeși ENTER sau SPACE.
- **Moș Curcan ține minte:** uneori, în loc de sfat, îți spune ceva ce ține minte:
  - după ce pierzi o viață: cum ai murit (în apă, într-o groapă, că a expirat timpul, că te-au prins), dacă ai murit de mai multe ori în același nivel sau că ți-a mai rămas o singură viață;
  - la începutul unui joc nou: până la ce nivel ai ajuns data trecută sau de câte ori ai ajuns la MESOPOTAMIA;
  - câte pene de aur ai găsit deja în nivelul în care intri;
  - după cafenea: ce ți-a ieșit la blocul lui (sau că ai plecat fără să-l încerci, ori că n-ai trecut pe la el);
  - înaintea cafenelei și în cafenea, dacă ai mai fost la el în alt joc: te salută altfel și-ți amintește ce ai luat data trecută de la bloc;
  - înaintea ultimului nivel, dacă l-ai mai întâlnit pe Fermierul-Șef.
  - Ce ține minte de la un joc la altul se păstrează în browser (în modul de test, separat).
- **Pădurea de brazi:** e un nivel de două ori mai lung, cu un lac foarte mare spre final, peste care sunt blocuri sus (cărămizi și blocuri M), păzite de mobi. E iarnă, cu munți înzăpeziți în spate, brazi, zăpadă pe jos și pe blocuri și fulguire ușoară. Muzica e mai liniștită, ca niște clopoței. Lacurile sunt mari și înghețate și se poate merge pe ele, dar:
  - pe gheață aluneci puțin când te oprești sau întorci;
  - gheața e doar un strat subțire la suprafață: dacă stai ~2 secunde pe același loc, trosnește, crapă și cazi prin ea în lac; gaura îngheață la loc după câteva secunde;
  - în unele lacuri sunt copci (apă deschisă, cu margini zimțate, bucăți de gheață plutind și țăruși cu steguleț roșu pe margini) pe care trebuie să le sari;
  - fermierii și bombele nu intră pe gheață, se opresc la mal; bombele împinse alunecă însă pe gheață de două ori mai departe;
  - explozia unei bombe sparge gheața pe care o atinge (și ea îngheață la loc după câteva secunde).
- **Noaptea la fermă:** ferestrele caselor sunt luminate, prin iarbă zboară licurici, pe cer sunt lună și stele, iar muzica e mai lentă și mai joasă. Fermierii au felinar și te văd doar dacă intri în lumina din fața lor; te poți strecura prin spatele lor. Terenul e făcut pentru strecurat: o peșteră adevărată sub pământ: intrarea e ascunsă: arată ca solul, dar sub iarbă se vede o crăpătură mică; pământul se surpă doar dacă aterizezi pe ea cu lovitura în pământ (sari și apeși ↓ în aer); curcanul trece prin el direct în gaură (nimic din joc nu-ți spune asta, doar Moș Curcan, într-un sfat: „SUB FERMĂ SUNT GALERII VECHI...”). Ieșirea e și ea ascunsă și se deschide abia când ieși, cu o explozie de pământ; după ce ai folosit-o, ambele găuri rămân deschise în nivelul ăsta (și după ce pierzi o viață). Când cazi în prima gaură, ecranul se întunecă (ca la ușa cafenelei) și ajungi într-o peșteră joasă (tavan de pământ, podeaua și movilele cu marginea de sus mai deschisă și colțurile rotunjite, ca la iarbă, în spate același pământ foarte închis ca în puțuri, cu pietre, câteva oase și cranii stinse, de forme și mărimi diferite (oase scurte și lungi, coaste, bucăți de șira spinării, cranii mici și mari), și diamante colorate care sclipesc (mici, mijlocii și mari, cu fețe), pietre și în pereți, tavan și podea, câteva oase îngropate în pământul tavanului, stalactite din tavan, stalagmite pe jos, pânze de păianjen în colțuri, ciuperci care luminează verde-albăstrui, rădăcini care atârnă din tavan și se leagănă ușor, cristale mov și albastre care strălucesc pe jos și în pereți, câteva băltoace mici și puțin adânci, cu petice de pământ ud printre ele (apă în nuanțe diferite, sclipiri care se mișcă), în care cad picături (cu cercuri pe apă și stropi când treci prin ea), picături de apă din vârfurile stalactitelor și 2 lilieci mari, atârnați, cu ochi roșii, care se sperie când treci pe lângă ei, chițăie și zboară prin peșteră (fiecare pas e verificat, așa că nu intră niciodată în pământ sau în blocuri), apoi se întorc la locul lor). În peșteră cântă o piesă a ei: lentă, rece, cu ecou de peșteră, o inimă care bate și vânt prin galerii. Două stalactite mai mari și mai deschise la culoare (ca să le recunoști) sunt periculoase: când treci pe sub ele tremură puțin, apoi cad și te lovesc dacă nu fugi; se sparg de podea, cu 12 bănuți (3 în arc peste baltă, 4 pe movilă, 3 lângă peretele din dreapta și 2 în puțul de ieșire), un singur bloc M cu putere și, lângă el, o cărămidă în care e a doua pană de aur a nivelului (o spargi doar ca curcan mare), puse mai jos, ca să te poți urca pe el după ce iei puterea (deasupra lui nu atârnă stalactite), o bombă și pământ care coboară din tavan și urcă din podea; la capăt urci pe trepte și sari în puțul din tavan, ecranul se întunecă iar și ieși sărind din a doua gaură, mult mai departe, chiar înainte de punctul de salvare (dacă sari în a doua gaură de sus, cazi lângă ieșire). Lângă prima gaură patrulează un fermier, trei dealuri suprapuse: unul mic în față, la mijloc, unul mijlociu în spate, în dreapta (cu un fermier pe el), și unul mare și mai în spate (mai închis la culoare, cel mijlociu intră peste el), în stânga, pe care ajungi doar sărind de pe cel mijlociu; deasupra celui mare e un rând de blocuri cu putere, trepte de pământ de o parte și de alta a unei ape, un deal mare în spatele dâmbului de pe care ajungi la a treia pană și un deal mic înainte de final, cu un ucenic sus. Dacă scapi din lumină, te mai caută puțin, apoi rămân nedumeriți („?”).
- **Bănuți cu M:** la 50 de bănuți primești o viață în plus.
- **Pene de aur:** în fiecare dintre cele 5 niveluri normale sunt ascunse 3 pene de aur (15 cu totul; nivelul bonus n-are), în locuri greu de ajuns, câte una din fiecare fel:
  - **la vedere, dar greu de luat:** sus de tot, peste o groapă sau peste apă (îți trebuie o săritură plină, la locul potrivit), pe un dâmb păzit de un fermier cu felinar sau deasupra unor blocuri înalte;
  - **într-o cărămidă:** arată ca toate celelalte, dar o spargi doar dacă ești mare (sau cu o explozie);
  - **ascunsă de tot:** într-un bloc invizibil, care apare dacă dai cu capul în el de dedesubt. Din când în când, acolo unde e ascunsă o pană sclipește o steluță. În ultimul nivel, una e în stiva de fân din dreapta poienii boss-ului și iese abia când stiva se prăbușește.
  - Pana dă 1000 de puncte și se aude un clinchet. Sus, lângă bănuți, sunt 3 locașuri: aurii pentru penele luate acum, transparente pentru cele găsite altă dată.
  - O pană contează doar dacă **termini nivelul**. Dacă pierzi o viață, pierzi penele luate după ultimul punct de salvare atins (cele de dinainte rămân la tine); la JOC TERMINAT le pierzi pe toate cele nesalvate. Penele găsite rămân salvate în browser; când rejoci nivelul, apar transparente și doar rămân acolo: treci prin ele, fără mesaj și fără puncte (cele din cărămidă sau din blocul invizibil ies afară și rămân deasupra blocului).
  - La finalul nivelului, cartonașul arată penele (cele găsite prima dată clipesc), iar pe drumul spre MESOPOTAMIA, sub fiecare nivel, sunt 3 buline mici, aurii pentru penele găsite.
  - Cu toate cele 15 pene deblochezi **curcanul de aur**: tot din aur, ca o statuetă (cap, creastă, cioc, coadă cu dungi, aripi, corp și picioare, cu contur maro închis), cu o sclipire care trece peste el din când în când; noaptea luminează încet: el însuși rămâne luminos (umbra nopții abia îl atinge), iar în jurul lui e o lumină caldă, aurie, care crește și scade lin; și căpșorul de la vieți devine auriu (doar aspectul). Cu costum de foc sau de gheață își păstrează penajul auriu; doar costumul e roșu, respectiv albastru ca gheața. Pornește singur când îl deblochezi și îl poți opri din SETĂRI.
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
- **Puncte de salvare** la jumătatea fiecărui nivel (lacul și pădurea de brazi, mai lungi, au câte două; nivelul bonus, scurt, n-are), cronometru și record salvat în browser.

## Testare

Deschide `test.html` (sau apasă MOD TEST în meniu). E un laborator: fără cronometru, cu vieți infinite (la moarte reapari pe loc). Jocul pornește în arena de test, iar în dreapta ai un panou:

- **Nivel:** carduri mici, cu numărul, un pătrățel în culorile decorului (cer și iarbă) și numele fiecărui nivel; click pe unul și îl joci. Arena de test se poate juca în oricare dintre cele 5 decoruri (Zi, Noapte, Iarnă, Iarnă noapte și Deșert, păstrat pentru viitor). În arenă e și un deal cu pasaj în trepte (bănuți sus, o bombă înăuntru), cu un deal mare în spate pe care se plimbă un fermier, și un bloc M sus, la care ajungi doar de pe dealul din spate. Dacă termini un nivel, treci la următorul, ca în joc.
- **Pornește de la:** începutul nivelului sau unul dintre punctele de salvare. „Repornește de aici” (sau tasta **R**) reia nivelul de unde ai reapărea dacă ai muri.
- **Harta de sub joc:** tot nivelul în mic, cu ce se vede acum pe ecran, punctele de salvare, ținta, penele de aur (romburi aurii: pline = luate acum, doar contur = găsite altă dată), mobii și curcanul. Dacă dai click sau tragi pe hartă, curcanul se mută acolo.
- **Curcanul:** îl faci mic, mare, de foc sau de gheață. Butonul **Curcan de aur** (oprit la început; nu pornește singur) arată curcanul de aur și fără pene, doar în modul de test; în joc apare abia după ce găsești toate penele.
- **Mobi:** ucenic, fermier, bombă sau bombă în fund, care apar în fața curcanului; îi poți și șterge pe toți.
- **Unelte:** invincibil (pornit de la început; îl poți opri din buton), hitbox-uri (cu legenda culorilor), viteză 1× / ½× / ¼×, pauză și avans cu un singur cadru. Butoanele aprinse (alese) sunt galbene, cu o lumină în jur. În modul de test, penele de aur se salvează separat, deci nu se amestecă cu jocul adevărat.

Butoanele folosesc chiar sprite-urile din joc. Același mod se poate deschide și direct, cu `index.html?test` (doar jocul, fără panou). Din panou te întorci la meniu cu „← Meniu”.

## Tehnic

Jocul nu are biblioteci externe și nu are nevoie de server: `index.html` încarcă fișierele din `js/` cu `<script>` obișnuite, deci merge și deschis direct din folder (dublu-click).

- grafica e desenată din cod (sprite-uri pixel-art definite ca text),
- muzica și efectele sonore sunt generate cu Web Audio API (chiptune pe gama Hijaz),
- fontul pixel 5×7 are și diacritice românești.

### Unde găsești ce

```
index.html                 pagina și lista de scripturi (ordinea lor contează)
css/style.css              stilurile paginii
js/
  baza/                    setup (ecranul, utilitare), fontul pixel, sprite-uri din text, input
  sunet/                   efectele sonore și muzica
  personaje/
    curcan/                desenele, mișcarea, penele, viața, animațiile, desenarea
    fermier/  ucenic/      desenele, felinarul, comportamentul
    bomba/                 desenele, comportamentul
    mos-curcan/            desenul, replicile din cafenea, sfaturile dintre niveluri
    curcani-prinsi/        cei 5 curcani din colivii: desenele, numele și replicile
    dusmani.js             crearea și desenarea dușmanilor
    inghetare.js           dușmanii înghețați de pana de gheață
  boss/
    fermierul-sef/         desenele, comportamentul, desenarea, replicile
  nivele/
    nivele.js              cum se construiește o hartă (newMap) și lista LEVELS
    1-ferma/  2-noapte/  3-lac/  bonus-cafenea/  4-padure/  5-iarna/
                           harta fiecărui nivel + ce ține doar de el (platformele lacului, cafeneaua)
    desert-scos/           deșertul, scos din joc, păstrat pentru mai târziu
  lume/                    teme și tile-uri, fundaluri, decor, restaurantul, noaptea,
                           iarna/ (zăpadă, gheață, brazi), apa/ (gropi, lacuri, rațe și pești)
  obiecte/                 bănuți și blocuri, power-up-uri, pene de aur, colivia și cheia, semnul de final și salvările
  animatii/                explozii, particule și texte plutitoare
  joc/                     starea jocului, fizica, pornirea nivelului, update, meniul, dialogul, achievements
  desen/                   ordinea desenării: fundal, lume, HUD, ecrane, render
  test/                    modul de test (folosit de test.html)
  main.js                  bucla principală (ultimul script)
```

**Ordinea scripturilor din `index.html` contează:** fiecare fișier poate folosi, când se încarcă, doar ce au definit fișierele de deasupra lui. Funcțiile se pot apela între ele oricum, pentru că jocul pornește abia după ce s-au încărcat toate.

**Nivel nou:** un folder nou în `js/nivele/`, cu `harta.js` (`LEVELS.push({id:..., theme:..., build(){...}});`), și un `<script>` pentru el în `index.html`, lângă celelalte hărți. Ordinea scripturilor dă ordinea nivelurilor. Ce e doar al nivelului (mecanici noi) stă în același folder.

**Personaj sau boss nou:** un folder în `js/personaje/` sau `js/boss/`, cu `sprite.js` (desenele), `logica.js` (comportamentul) și `desen.js` (desenarea), după modelul celorlalte.
