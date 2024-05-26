import { Model, ModelStatic } from "sequelize";
import { AllDBModels } from "./DbInterface"; 

export interface DbModels extends AllDBModels { };

export type CustomModel<M extends Model> = ModelStatic<M> & { associate?(models: DbModels): void; };