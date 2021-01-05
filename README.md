# Republik-Artikel in EPUBs umwandeln

Ein einfacher Workflow um Artikel des Republik-Magazins (republik.ch) auf E-Book Readern (z.B. Tolino) zu lesen.


## Aktueller Stand

Der aktuelle Prototyp läuft **lokal in einer Node.js Umgebung**. Die HTML-Datei der konfigurierte URL wird heruntergeladen und Titel, die Zeile mit den Urheber:innen sowie Untertitel und Inhaltsparagraphen ausgelesen.

Die erstellt EPUB-Datei muss anschliessend auf den Reader transferiert werden.

Getestet mit:
- https://www.republik.ch/2021/01/04/duerrenmatts-ueberraschungen (graue Textboxen fehlen!)
- https://www.republik.ch/2021/01/02/das-faschistische-missverstaendnis (Ok)
- https://www.republik.ch/2020/12/31/ein-jahresend-gespraech-aus-dem-jenseits (Ok)

Tests im Ordner ./test_epubs/

### CLI

```console
foo@bar:~$ node index --help
Usage: index [options]

Options:
  -V, --version      output the version number
  -u, --url <url>    URL to generate EPUB file from, will provide you with a hash to get the EPUB
  -h, --hash <hash>  Short hash to download a prepared EPUB file
  --help             display help for command

You have to provide either an <url> or a <hash> to run the program.
foo
```

## Ziele

- Einfacher Online-Workflow um Republik-Artikel direkt auf einem E-Book Reader lesen zu können
- Darstellung von möglichst vielen Artikelformen des Republik-Magazins


## ToDo

- CLI erstellen
- Online-Workflow definieren
- ggf. Mercury Parser hinzuziehen und dessen Resultate nutzen: https://github.com/postlight/mercury-parser
- Definitive Wahl des EPUB-Generators (momentan https://www.npmjs.com/package/epub-gen)
- Urheber*innenzeile besser behanden (z.B. Publikationsdatum extrahieren)
- Herausgeber und weitere Metadaten ergänzen
- ggf. Angaben zu den Autoren (nur bei externen?) ergänzen
- Artikelbild als Coverbild einbinden
- Quotes einfügen (vgl. z.B. den Dürrentmatt-Artikel)
- Inhaltsbilder einfügen
- Erweiterung auf MOBI-Export (v.a. für die Kindle-Geräte)
- ...

## Motivation

Das Republik-Magazin (republik.ch) publiziert hervorragend rechechierte Geschichten und Meinungsstücke. Die Artikel befinden sich hinter einer Paywall, können aber mit interessierten Leser:innen einfach geteilt werden. Sie sind momentan online lesbar oder können als PDF exportiert werden. Beide Varianten laufen nur schlecht auf (meinem) E-Readern. E-Reader bieten ein ablenkungsfreies Leseerlebnis in hervorragender Darstellungsqualität des Textes.

Als Lösung bietet sich ein Export in das quelloffene Format EPUB an (für Kindle-Nutzer: https://allesebook.de/calibre/epub-ebooks-am-kindle-lesen/). Die Republik selbst bietet diesen Export aus verschiedenen Gründen (noch) nicht (vgl. z.B. hier https://www.republik.ch/dialog?t=general&focus=94f94030-f266-4dee-bf1f-b8d506b07e38). Auch fallen diverse Online-Konverter (in der Form: URL zu EPUB), da diese meist nicht komfortabel in E-Readern aufgerufen werden können und das Resultat nicht zufriedenstellend aussieht (z.B. zu viele nicht benötigte Elemente, wie Navigation, Kopf- und Fusszeilen etc.).

Sobald die Republik übrigens einen RSS-Feed anbietet (scheinbar auch angedacht), können die Artikel via Calibre auf die E-Reader transferiert werden.

### Disclaimer

Die Motivation ist nicht, EPUBs des Republik-Magazins allen zur Verfügung zu stellen (und damit die Paywall zu umgehen), sondern einzig den Republik-Abonnent:innen (bzw. Verleger:innen) einen einfachen Workflow für einen ablenkungsfreien Lesegenuss zu bieten. Natürlich kann das EPUB im Anschluss mit interessierten geteilt werden, genauso wie es momentan auch mit den PDFs bzw. der Direkt-URL möglich ist.


## Online-Workflow

Momentan angedacht:

1. Online-Formular, bei dem die Artikel-Url via Mobilphone eingeben wird (z.B. https://www.republik.ch/2020/12/31/ein-jahresend-gespraech-aus-dem-jenseits).
2. Das EPUB wird generiert und entweder zum Download angeboten oder ein Hash (eine Zeichenfolge in der Form ad362cf) für den Download auf einem anderen Gerät ausgegeben.
3. Im E-Reader wird ein Formular aufgerufen und der Hash (vgl. 2.) eingeben, was wiederum den Download auslöst.
