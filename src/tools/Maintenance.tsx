import { useEffect, useState } from 'react';
import { DbSelector, DbType } from '../game/components/DbSelector';
import { Button } from '@material-tailwind/react';

export function Maintenance({ selectedDb, setSelectedDb }: { selectedDb: DbType, setSelectedDb: (dbName: DbType) => void }) {
  const [exportStatus, setExportStatus] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [dbPort, setDbPort] = useState<number>(3000);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (!selectedDb) {
      return;
    } else {
      switch (selectedDb) {
        case "MongoDB":
          setDbPort(3000);
          break;
        case "MySQL":
          setDbPort(3001);
          break;
        case "SQLite":
          setDbPort(3002);
          break;
      }
    }
  }, [selectedDb]);


  const handleExport = async () => {
    try {
      const response = await fetch(`http://localhost:${dbPort}/api/games`);

      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`);
      }

      const jsonResult = await response.json();
      const jsonString = JSON.stringify(jsonResult, null, 2);

      const blob = new Blob([jsonString], { type: 'application/json' });
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = `punto-export-from-${selectedDb}-${new Date().toISOString()}.json`;
      downloadLink.click();

      setExportStatus('Export réussi');
    } catch (error) {
      setExportStatus('Export échoué');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setImportStatus('Aucun fichier sélectionné');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`http://localhost:${dbPort}/api`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Import failed with status ${response.status}`);
      }

      setImportStatus('Import réussi');
    } catch (error) {
      setImportStatus('Import échoué');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <DbSelector selectedDb={selectedDb} setSelectedDb={setSelectedDb} />
      <Button color="blue" onClick={handleExport}>Exporter</Button>
      <p>{exportStatus}</p>
      <input type="file" onChange={handleFileChange} />
      <Button color="green" onClick={handleImport}>Importer</Button>
      <p>{importStatus}</p>
    </div>
  );
}
