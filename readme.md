# Instruções para rodar o cases

## 1. Renomear o file `.env.example` para `.env`

## 2. Instal as dependências

```bash
npm install
```

## 3. Rodar a migration

```bash
npx prisma migrate dev --name init
```

## 4. Rodar o test

```bash
npm run test
```

## 5. Rodar o server

```bash
npm run dev
```

## 6. Rodar o prisma studio

```bash
npx prisma studio
```
