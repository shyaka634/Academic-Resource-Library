
import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const subject= sequelize.define("Subject",{
    subject_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    description:{
        type:DataTypes.STRING,
        allowNull:true,
    },
},{tableName:"subject", timestamps:false})

export default subject;