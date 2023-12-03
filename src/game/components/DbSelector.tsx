import { Select, Option } from "@material-tailwind/react";

export type DbType = "MongoDB" | "MySQL" | "SQLite" | undefined;


export function DbSelector({selectedDb, setSelected}: {selectedDb: DbType, setSelected: (dbName: DbType) => void}) {

    return (
        <Select color="yellow" label="Sélectionner une BDD" value={selectedDb}>
            <Option onClick={() => setSelected("MongoDB")}>MongoDB</Option>
            <Option onClick={() => setSelected("MySQL")}>MySQL</Option>
            <Option onClick={() => setSelected("SQLite")}>SQLite</Option>
        </Select>
    )
}