import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Barcode extends Model {
    public id!: number;
    public barcode!: string;
}

Barcode.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        barcode: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: 'Barcode',
        tableName: 'barcode_data',
        timestamps: false,
    }
);

export default Barcode;
