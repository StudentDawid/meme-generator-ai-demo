# Dokumentacja Projektowa: MemeCraft MVP

## 1. Wizja i Opis Projektu

**MemeCraft** to lekka aplikacja webowa typu Single Page Application (SPA), która pozwala użytkownikom na błyskawiczne tworzenie memów. Narzędzie rozwiązuje problem skomplikowanych edytorów graficznych, dając użytkownikowi gotowe szablony i intuicyjny interfejs "wpisz i pobierz".

**Stack technologiczny:** Nuxt 3, Vuetify 3, Fabric.js (do obsługi Canvas), Imgflip API (źródło szablonów).

---

## 2. Architektura Funkcjonalna (Backlog)

### Faza 1: Fundamenty i UI (Layout)

- **[TASK 1]** Konfiguracja projektu Nuxt 3 z modułem Vuetify i wsparciem dla SASS.
- **[TASK 2]** Implementacja layoutu: `v-app-bar` (nawigacja), `v-navigation-drawer` (biblioteka szablonów), `v-main` (obszar roboczy), `v-navigation-drawer` (prawy panel edycji).

### Faza 2: Obsługa Mediów i Canvas

- **[TASK 3]** Integracja z Imgflip API: Pobieranie listy 100 najpopularniejszych memów i wyświetlanie ich w formie miniaturek.
- **[TASK 4]** Inicjalizacja Fabric.js: Stworzenie responsywnego płótna (canvas), które skaluje wgrany obrazek do granic kontenera.
- **[TASK 5]** Obsługa "Custom Upload": Umożliwienie użytkownikowi wgrania własnego pliku JPG/PNG przez `v-file-input`.

### Faza 3: Edycja i Personalizacja

- **[TASK 6]** Silnik tekstowy: Dynamiczne dodawanie warstw tekstowych na canvas. Tekst musi mieć: obrys (stroke), białe wypełnienie i czcionkę typu "Impact" (klasyka memów).
- **[TASK 7]** Panel sterowania: Suwaki (`v-slider`) do zmiany rozmiaru czcionki, wybór kolorów (`v-color-picker`).

### Faza 4: Eksport i Finalizacja

- **[TASK 8]** Generowanie pliku: Konwersja canvasu do formatu DataURL i wywołanie pobierania pliku na dysk użytkownika.

---

## 3. Szczegółowa Specyfikacja Techniczna dla AI

Aby "Google Antygravity" (lub inny model) wygenerował Ci gotowy kod, używaj poniższych wytycznych technicznych:

### Dane wejściowe (API)

- **Endpoint:** `https://api.imgflip.com/get_memes`
- **Struktura obiektu:** `meme.url`, `meme.name`, `meme.id`.

### Komponent Canvas (Kluczowy element)

- Użyj **Fabric.js**, ponieważ natywne API Canvas jest zbyt niskopoziomowe do obsługi przeciągania tekstu (drag & drop).
- Tekst mema powinien być obiektem `fabric.IText`, aby użytkownik mógł go edytować bezpośrednio na obrazku.

---

## 4. Prompt do zainicjowania kodu (Kopiuj-Wklej)

Jeśli chcesz zacząć pisać kod z pomocą AI, wklej mu to:

> "Działaj jako Senior Frontend Developer specjalizujący się w Nuxt 3 i Vuetify 3. Chcę stworzyć stronę do generowania memów.
>
> Wymagania techniczne:
>
> - Zainstaluj i skonfiguruj Nuxt 3 z Vuetify 3.
> - Stwórz główny komponent `MemeEditor.vue`, który zawiera:
>   - Lewy pasek boczny z listą obrazków pobranych z `https://api.imgflip.com/get_memes` (użyj `useFetch`).
>   - Centralną sekcję z elementem `<canvas id="meme-canvas">`.
>   - Prawy pasek boczny z polami tekstowymi `v-text-field` dla 'Górnego tekstu' i 'Dolnego tekstu'.
> - Użyj biblioteki **Fabric.js** do obsługi canvasu. Po kliknięciu w obrazek z listy, powinien on załadować się jako tło canvasu.
> - Dodaj przycisk **'Pobierz mem'**, który zapisze zawartość canvasu jako plik `.png`.
> - Zastosuj ciemny motyw (Dark Mode) z paletą kolorów Vuetify: `primary: #6200EE`."
