import express, { Express } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from '../../modules/client-adm/repository/client.model';
import { customerRoute } from './routes/customer.route';

export const app: Express = express();
app.use(express.json());
app.use("/clients", customerRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });

  await sequelize.addModels([ClientModel]);
  await sequelize.sync();
}

setupDb();