// struktura zadania
function dane() {
	this.id = '';
	this.dl_zad = 0;
	this.poprzednik = [];
	this.najwcz_rozp = 0;
	this.najwcz_zak = 0;
	this.najp_rozp = 0;
	this.najp_zak = 0;
	this.zapas_calk = 0;
	this.ilosc_poprzednikow = 0;
	this.wbok = 0;
	this.wdol = 0;
}
// definicje zmiennych globalnych
var wynik = "", wynik2 = "",
	ilosc_zad = 0, maximum = 0, minimum = 0,
	dane_zad, najw_wbok = 0, sciezka = [],
	context = document.getElementById("cpm"),
	task = context.getContext("2d");
// algorytm wyznaczający ścieżke krytyczną
function algorithm() {
	for (var j = 0; j < ilosc_zad; j++) {
		if (dane_zad[j].poprzednik[0] == '0') {
			dane_zad[j].najwcz_rozp = 0;
			dane_zad[j].najwcz_zak = parseInt(dane_zad[j].dl_zad);
		} else {
			maximum = 0;
			for (var i = 0; i < dane_zad[j].ilosc_poprzednikow; i++) {
				for (var k = 0; k < j; k++) {
					if (dane_zad[j].poprzednik[i] == dane_zad[k].id) {
						if (maximum < dane_zad[k].najwcz_zak) {
							maximum = dane_zad[k].najwcz_zak;
						}
					}
				}
			}
			dane_zad[j].najwcz_rozp = maximum;
			dane_zad[j].najwcz_zak = parseInt(dane_zad[j].najwcz_rozp)
				+ parseInt(dane_zad[j].dl_zad);
		}
	}
	maximum = 0;
	for (var j = 0; j < ilosc_zad; j++) {
		if (maximum < dane_zad[j].najwcz_zak) {
			maximum = dane_zad[j].najwcz_zak;
		}
	}
	for (var j = 0; j < ilosc_zad; j++) {
		dane_zad[j].najp_zak = -1;
	}
	var nastepnik = 0;
	for (var i = (ilosc_zad - 1); i >= 0; i--) {
		for (var j = i + 1; j < ilosc_zad; j++) {
			for (var k = 0; k < dane_zad[j].ilosc_poprzednikow; k++) {
				if (dane_zad[i].id == dane_zad[j].poprzednik[k]) {
					nastepnik++;
					if (dane_zad[i].najp_zak == -1) {
						dane_zad[i].najp_zak = dane_zad[j].najp_rozp;
						dane_zad[i].najp_rozp = dane_zad[i].najp_zak - dane_zad[i].dl_zad;
					} else {
						if (dane_zad[i].najp_zak > dane_zad[j].najp_rozp) {
							dane_zad[i].najp_zak = dane_zad[j].najp_rozp;
							dane_zad[i].najp_rozp = dane_zad[i].najp_zak - dane_zad[i].dl_zad;
						}
					}
				}
			}
		}
		if (nastepnik == 0) {
			dane_zad[i].najp_zak = maximum;
			dane_zad[i].najp_rozp = dane_zad[i].najp_zak - dane_zad[i].dl_zad;
		} else nastepnik = 0;
	}
	for (var i = 0; i < ilosc_zad; i++) {
		dane_zad[i].zapas_calk = dane_zad[i].najp_zak - dane_zad[i].najwcz_zak;
	}
	for (var i = 0; i < ilosc_zad; i++) {
		var max = 0;
		for (var j = 0; j < dane_zad[i].ilosc_poprzednikow; j++) {
			for (var k = 0; k < i; k++) {
				if (dane_zad[i].poprzednik[j] == dane_zad[k].id) {
					if (max <= dane_zad[k].wbok) {
						max = dane_zad[k].wbok + 1;
					}
				}
			}
		}
		dane_zad[i].wbok = max;
		if (max > najw_wbok) najw_wbok = max;
	}
	// wyświetlenie wyniku
	for (var i = 0; i < ilosc_zad; i++) {
		var set = new Set(dane_zad[i].poprzednik);
		var myArr = Array.from(set);
		myArr = myArr.sort();
		wynik = wynik + "<table><tr><td>id zadania</td><td><b>" + dane_zad[i].id
			+ "</b></tr><tr><td>długość zadania</td><td><b>" + dane_zad[i].dl_zad
			+ "</b></tr><tr><td>poprzednicy</td><td><b>" + myArr.join(", ")
			+ "</b></tr><tr><td>najwcześniejsze rozpoczęcie</td><td><b>" + dane_zad[i].najwcz_rozp
			+ "</b></tr><tr><td>najwcześniejsze zakończenie</td><td><b>" + dane_zad[i].najwcz_zak
			+ "</b></tr><tr><td>najpóźniejsze rozpoczęcie</td><td><b>" + dane_zad[i].najp_rozp
			+ "</b></tr><tr><td>najpóźniejsze zakończenie</td><td><b>" + dane_zad[i].najp_zak
			+ "</b></tr><tr><td>zapas całkowity</td><td><b>" + dane_zad[i].zapas_calk
			+ "</td></tr></table>";
	}
	var a = 0;
	for (var i = 0; i < ilosc_zad; i++) {
		if (dane_zad[i].zapas_calk == 0) {
			wynik2 = wynik2 + " " + dane_zad[i].id;
			sciezka[a] = dane_zad[i].id;
			a++;
		}
	}
	document.getElementById("wynik").innerHTML = '<div class="box">Wyniki:<br><br>'
		+ wynik + '<hr><center><font size=4>Ścieżka krytyczna: <b>'
		+ wynik2 + '</b></font>.</center></div>';
	document.getElementById("canvas").className += 'box';
	task.canvas.height = ilosc_zad * 60 + 90;
	task.canvas.width = (1 + najw_wbok) * 90 + 90;
	drawTitle();
	for (var j = 0; j < najw_wbok + 1; j++) {
		var a = 0;
		for (var i = 0; i < ilosc_zad; i++) {
			if (dane_zad[i].wbok == j) {
				drawTask(dane_zad[i].wbok * 3 + 1, a * 3 + 1, dane_zad[i].id, i);
				dane_zad[i].wdol = a;
				a++;
			}
		}
	}
	for (var i = 1; i < ilosc_zad; i++) {
		for (var j = 0; j < dane_zad[i].ilosc_poprzednikow; j++) {
			var o = 0, p = 0, x = 0;
			for (var k = 0; k < i; k++) {
				if (dane_zad[i].poprzednik[j] == dane_zad[k].id) {
					o = dane_zad[k].wbok;
					p = dane_zad[k].wdol;
				}
			}
			drawLine(dane_zad[i].wbok * 3 + 2, dane_zad[i].wdol * 3 + 3, o * 3 + 4, p * 3 + 3 - 0.25, x);
		}
	}
	var o = 0, p = 0, r = 0, s = 0;
	for (var i = 0; i < sciezka.length; i++) {
		for (var j = 0; j < ilosc_zad; j++) {
			if (sciezka[i] == dane_zad[j].id) {
				o = dane_zad[j].wbok;
				p = dane_zad[j].wdol;
			}
		}
		for (var j = 0; j < ilosc_zad; j++) {
			if (sciezka[i + 1] == dane_zad[j].id) {
				r = dane_zad[j].wbok;
				s = dane_zad[j].wdol;
			}
		}
		if (i < sciezka.length - 1) {
			drawLine(r * 3 + 2, s * 3 + 3 + 0.25, o * 3 + 4, p * 3 + 3 + 0.25, 1);
		}
	}
	delete dane.zad;
}
// wprowadzanie danych
function insert_data() {
	ilosc_zad = document.getElementById("ilosc").value;
	if (ilosc_zad > 26 || ilosc_zad < 1) {
		alert("Można wprowadzić do 26 zadań!")
		window.location.href = 'index.html';
	}
	dane_zad = [ilosc_zad];
	for (var i = 0; i < ilosc_zad; i++) {
		dane_zad[i] = new dane();
	}
	for (var i = 0; i < ilosc_zad; i++) {
		dane_zad[i].id = prompt("Podaj nazwę zadania:");
		if (dane_zad[i].id == null) {
			window.location.href = 'index.html';
		}
		dane_zad[i].dl_zad = prompt("Podaj długość zadania:");
		if (i > 0) {
			dane_zad[i].ilosc_poprzednikow = prompt("Podaj ilosc poprzednikow:");
		} else {
			dane_zad[i].ilosc_poprzednikow = 0;
		}
		if (dane_zad[i].ilosc_poprzednikow == 0) dane_zad[i].poprzednik[0] = '-';
		for (var j = 0; j < dane_zad[i].ilosc_poprzednikow; j++) {
			var l = true;
			do {
				l = true;
				var e = prompt("Wpisz poprzednika");
				if (e >= 'A' && e <= 'Z') {
					for (var k = 0; k <= i; k++) {
						if (e == dane_zad[k].id) {
							l = false;
						}
					}
					if (l) {
						alert("Blad! Nie ma takiego zadania w tablicy.");
					} else {
						dane_zad[i].poprzednik[j] = e;
					}
				} else {
					alert("Błąd. Użyj dużych liter, jeśli nie ma poprzednika wpisz 0.");
				}
			} while (l);
		}
	}
	algorithm();
}
// losowanie danych
function random() {
	ilosc_zad = document.getElementById("ilosc").value;
	if (ilosc_zad > 26 || ilosc_zad < 1) {
		alert("Można wprowadzić do 26 zadań!")
		window.location.href = 'index.html';
	}
	dane_zad = [ilosc_zad];
	for (var i = 0; i < ilosc_zad; i++) {
		dane_zad[i] = new dane();
	}
	for (var i = 0; i < ilosc_zad; i++) {
		dane_zad[i].id = String.fromCharCode('A'.charCodeAt() + i);
		dane_zad[i].dl_zad = Math.floor(Math.random() * 50);
		if (i > 0) {
			dane_zad[i].ilosc_poprzednikow = Math.floor(Math.random() * i) + 1;
		} else {
			dane_zad[i].ilosc_poprzednikow = 0;
		}
		if (dane_zad[i].ilosc_poprzednikow > 4) dane_zad[i].ilosc_poprzednikow = 2;
		if (dane_zad[i].ilosc_poprzednikow == 0) {
			dane_zad[i].poprzednik[0] = '-';
		}
		var wartosc_losowa = 0;
		for (var j = 0; j < dane_zad[i].ilosc_poprzednikow; j++) {
			wartosc_losowa = Math.floor(Math.random() * i);
			for (var k = 0; k < j; k++) {
				if (dane_zad[wartosc_losowa].id == dane_zad[i].poprzednik[k]) {
					wartosc_losowa = Math.floor(Math.random() * i);
					k = 0;
				} else {
					k++;
				}
			}
			dane_zad[i].poprzednik[j] = dane_zad[wartosc_losowa].id;
		}
	}
	algorithm();
}
// rysowanie grafu
function drawTitle() {
	task.beginPath();
	task.font = "14px Consolas";
	task.fillText("Graf:", 5, 15);
	task.stroke();
}
function drawTask(x, y, name, i) {
	x = x * 30 + 30;
	y = y * 30 + 30;
	task.beginPath();
	task.lineWidth = "2";
	task.strokeStyle = "black";
	task.rect(x, y, 60, 60);
	task.moveTo(x + 30, y);
	task.lineTo(x + 30, y + 60);
	task.moveTo(x, y + 30);
	task.lineTo(x + 60, y + 30);
	task.font = "14px Consolas";
	task.fillText(name, x, y - 5);
	task.fillText(dane_zad[i].najwcz_rozp, x + 3, y + 20);
	task.fillText(dane_zad[i].najwcz_zak, x + 33, y + 20);
	task.fillText(dane_zad[i].najp_rozp, x + 33, y + 50);
	task.fillText(dane_zad[i].najp_zak, x + 3, y + 50);
	task.stroke();
}
function drawLine(x, y, m, n, c) {
	task.beginPath();
	task.lineWidth = "5";
	if (c == 1) {
		var color = "rgba(0, 0, 255, 0.8)";

	} else {
		var color = "rgba(60, 188, 141, 0.5)"
	}
	x = x * 30;
	y = y * 30;
	m = m * 30;
	n = n * 30;
	task.strokeStyle = color;
	task.moveTo(x, y);
	task.lineTo(m, n);
	task.stroke();
}