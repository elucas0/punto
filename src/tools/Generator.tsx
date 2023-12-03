import { useState } from "react";
import { DbSelector, DbType } from "../game/components/DbSelector";

export function Generator() {
    const [selectedDb, setSelectedDb] = useState<DbType>();

    const handleDbSelect = (selectedDb: DbType) => {
        setSelectedDb(selectedDb);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="font-poppinslight text-white text-xl">Générateur de parties</h1>
            <DbSelector onSelectDb={handleDbSelect} />
        </div>
    )
}