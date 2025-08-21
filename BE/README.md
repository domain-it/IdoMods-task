# README

## Opis projektu

Projekt składa się z dwóch głównych usług uruchamianych w kontenerach Docker za pomocą Docker Compose:

- **mongo** – baza danych MongoDB z uwierzytelnianiem SCRAM-SHA-256,
- **backend** – aplikacja Node.js zbudowana na Express, która komunikuje się z MongoDB i udostępnia API wraz z interaktywną dokumentacją Swagger pod `/api-docs`.

---

## Wymagania wstępne

- Zainstalowany Docker oraz Docker Compose
- Plik `.env` z odpowiednio skonfigurowanymi zmiennymi środowiskowymi (przykład poniżej)
- Dostęp do internetu do pobrania obrazów bazowych

---

## Konfiguracja pliku `.env`

Przed uruchomieniem należy skonfigurować zmienne środowiskowe, np. utworzyć plik `.env` w głównym folderze projektu z zawartością:

```dotenv
# Backend port
PORT=3000

# API Credentials do pobierania zamówień
API_URL=https://zooart6.yourtechnicaldomain.com/api/admin/v6
API_KEY=YXBwbGljYXRpb24xNjpYeHI1K0MrNVRaOXBaY2lEcnpiQzBETUZROUxrRzFFYXZuMkx2L0RHRXZRdXNkcmF5R0Y3ZnhDMW1nejlmVmZP

# Harmonogram zadania w formacie cron (co 10 minut)
FETCH_CRON="*/10 * * * *"

# MongoDB - dane do uwierzytelniania i połączenia
DATABASE_USER=...
DATABASE_PASSWORD=...
DATABASE_DB=ordersdb
DATABASE_HOST=mongo
DATABASE_PORT=27017

# Sekrety JWT
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
```

---

## Budowa i uruchomienie projektu

1. **Sklonuj repozytorium i przejdź do katalogu projektu backend**

2. **Wygeneruj klucze i zdefiniuj w `.env`, `ACCESS_TOKEN_SECRED` oraz `REFRESH_TOKEN_SECRED` za pomocą komendy**
```shell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. **Zedefiniuj użytkownika bazy danych `DATABASE_USER` i nadaj bezpieczne hasło dla niego `DATABASE_PASSWORD`**

4. **W katalogu z plikiem `docker-compose.yml` (położenie: `docker/`) uruchom:**

```sh
cd docker
docker compose --env-file ../.env up -d
```

Polecenie pobierze potrzebne obrazy (Node.js, MongoDB), zbuduje obraz backendowy zdefiniowany w `docker/Dockerfile`, uruchomi usługi i połączy je w sieć Docker Compose.

5. **Usługa backendowa będzie dostępna pod adresem kontenera na porcie zdefiniowanym w `.env` (np. http://localhost:3000/)**

---

## Informacje dodatkowe

- API dokumentacja Swagger jest dostępna pod:  
  `http://${ADDRESS}:${PORT}/api-docs`  
  gdzie `${PORT}` to wartość z pliku `.env`, a ${ADDRESS} to adres kontenera 

- MongoDB uruchamiane jest z włączoną autoryzacją SCRAM-SHA-256, a dane uwierzytelniające są pobierane ze zmiennych środowiskowych.

- Backend budowany jest na obrazie `node:24-alpine` zgodnie z `docker/Dockerfile`, gdzie kopiowany jest kod, instalowane zależności i aplikacja jest kompilowana przed startem.

---

## Struktura ważnych plików
- `src` - folder z całą aplikacją backendową
- `docker` - folder zawierający konfigurację usług docker oraz definicję obrazu aplikacji backendowej
- `.env` – plik ze zmiennymi środowiskowymi (porty, hasła, API keys)
- `.gitigrore` - plik zawierający wykluczenia plików z gita
- `.prettierrc` - plik konfiguracyjny formatowania projektu
- `package.json` - plik konfiguracyjny pakietów projektu
- `tsconfig.json` - plik konfiguracyjny interpretera TypeScript

---

## Uwagi końcowe

- Pamiętaj, żeby przy zmianie konfiguracji `.env` usunąć obraz kontenera uruchomić ponownie kontenery
- Usługa backendowa **zależy od uruchomionego MongoDB** (zdefiniowane w `depends_on` w compose)
- Monitoruj logi kontenerów:  
```shell
docker logs -fn backend
```

---
W razie pytań lub problemów z uruchomieniem, służę pomocą!
