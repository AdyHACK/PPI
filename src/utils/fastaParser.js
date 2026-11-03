/**
 * Parses raw FASTA text format.
 * Expects format:
 * >header description
 * MKTIIALSYIFCLVFA...
 *
 * @param {string} text 
 * @returns {Array<{ header: string, id: string, description: string, sequence: string }>}
 */
export function parseFasta(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const lines = text.split(/\r?\n/);
  const records = [];
  let currentHeader = '';
  let currentSequence = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('>')) {
      if (currentHeader !== '' || currentSequence.length > 0) {
        const fullHeader = currentHeader.replace(/^>/, '').trim();
        const firstSpace = fullHeader.indexOf(' ');
        const id = firstSpace > 0 ? fullHeader.substring(0, firstSpace) : fullHeader;
        const description = firstSpace > 0 ? fullHeader.substring(firstSpace + 1) : '';

        records.push({
          header: fullHeader,
          id: id.replace(/[|]/g, '_'),
          description,
          sequence: currentSequence.join('')
        });
      }
      currentHeader = trimmed;
      currentSequence = [];
    } else {
      currentSequence.push(trimmed);
    }
  }

  // Push last record
  if (currentHeader !== '' || currentSequence.length > 0) {
    const fullHeader = currentHeader.replace(/^>/, '').trim();
    const firstSpace = fullHeader.indexOf(' ');
    const id = firstSpace > 0 ? fullHeader.substring(0, firstSpace) : (fullHeader || 'UPLOADED_PROTEIN');
    const description = firstSpace > 0 ? fullHeader.substring(firstSpace + 1) : '';

    records.push({
      header: fullHeader,
      id: id.replace(/[|]/g, '_'),
      description,
      sequence: currentSequence.join('')
    });
  }

  return records;
}

/**
 * Reads a File object as text and parses FASTA.
 * @param {File} file 
 * @returns {Promise<Array>}
 */
export function readFastaFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseFasta(e.target.result);
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read FASTA file'));
    reader.readAsText(file);
  });
}
