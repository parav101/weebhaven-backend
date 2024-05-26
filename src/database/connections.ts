import { Options, Sequelize } from "sequelize"
import config from './config/config';
import { createModels } from "./models";
import { DbInterface } from "./typings/DbInterface";

class Database{
    private db: Sequelize = null as any;
    public dbInterface: DbInterface = null as any;
    constructor(){
       this.db = new Sequelize(config as Options)
       this.dbInterface = createModels(this.db);
    }
    syncModels() {
        this.dbInterface.sequelize.sync();
     }
     connect() {
        return this.db.authenticate();
     }
  
     close() {
        this.db.close();
     }
     transaction(){
      return this.db.transaction()
     }
}
export const db = new Database();