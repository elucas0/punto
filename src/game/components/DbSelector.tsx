import { Select, Option } from "@material-tailwind/react";

export type DbType = "MongoDB" | "MySQL" | "SQLite" | undefined;


export function DbSelector({selectedDb, setSelectedDb}: {selectedDb: DbType, setSelectedDb: (dbName: DbType) => void}) {

    return (
        <Select color="yellow" label="Sélectionner une BDD" value={selectedDb}>
            <Option onClick={() => setSelectedDb("MongoDB")}>MongoDB</Option>
            <Option onClick={() => setSelectedDb("MySQL")}>MySQL</Option>
            <Option onClick={() => setSelectedDb("SQLite")}>SQLite</Option>
        </Select>
    )
}