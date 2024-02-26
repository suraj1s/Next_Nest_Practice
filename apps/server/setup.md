### first install nestjs cli

```bash
npm i -g @nestjs/cli
```

### create a project

```bash
nest new server
```

### add dependencies in the project

```bash
yarn workspace server add @nestjs/typeorm  typeorm sqlite3
```

### add users module controller and service

```bash
nest g module users
nest g controller /Users/controllers/users
nest g service  /Users/services/users
```
