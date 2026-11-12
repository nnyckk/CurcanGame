# Curcanul în Fugă

Un platformer pixel-art în browser. Ești un curcan și trebuie să ajungi la restaurantul fast food **MESOPOTAMIA** ca să câștigi.

## Cum joci

Deschide `index.html` în orice browser modern. Nu e nevoie de instalare sau server.

| Tastă | Acțiune |
|---|---|
| ← → | Mergi |
| SPACE | Sari (ține apăsat ca să sari mai sus) |
| X (ținut apăsat) | Fugi |
| Enter | Start |
| P | Pauză |
| M | Muzică pornită / oprită |

Pe telefon apar butoane pe ecran.

## Ce găsești în joc

- **3 niveluri:** Ferma (zi), Orașul (apus), Deșertul (noapte). Ultimul se termină la restaurantul MESOPOTAMIA.
- **Bănuți cu M:** la 50 de bănuți primești o viață în plus.
- **Grăuntele auriu:** iese din unele blocuri M și face curcanul mare. Mare, poate sparge cărămizi, iar dacă e lovit, redevine mic.
- **Dușmani:** țepi, bombe cu fitil care aleargă după tine și fermieri care te urmăresc. Îi oprești sărind pe ei.
- **Puncte de salvare** la jumătatea fiecărui nivel, cronometru și record salvat în browser.

## Tehnic

Totul e într-un singur fișier, `index.html`, fără biblioteci externe:

- grafica e desenată din cod (sprite-uri pixel-art definite ca text),
- muzica și efectele sonore sunt generate cu Web Audio API (chiptune pe gama Hijaz),
- fontul pixel 5×7 are și diacritice românești.
