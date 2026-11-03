// 20 Canonical Amino Acids in standard single-letter notation
export const VALID_AMINO_ACIDS = new Set([
  'A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L',
  'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y'
]);

export const AMINO_ACID_PROPERTIES = {
  A: { name: 'Alanine', type: 'hydrophobic', mw: 89.09 },
  R: { name: 'Arginine', type: 'basic', mw: 174.20 },
  N: { name: 'Asparagine', type: 'polar', mw: 132.12 },
  D: { name: 'Aspartate', type: 'acidic', mw: 133.10 },
  C: { name: 'Cysteine', type: 'special', mw: 121.16 },
  E: { name: 'Glutamate', type: 'acidic', mw: 147.13 },
  Q: { name: 'Glutamine', type: 'polar', mw: 146.15 },
  G: { name: 'Glycine', type: 'special', mw: 75.07 },
  H: { name: 'Histidine', type: 'basic', mw: 155.16 },
  I: { name: 'Isoleucine', type: 'hydrophobic', mw: 131.18 },
  L: { name: 'Leucine', type: 'hydrophobic', mw: 131.18 },
  K: { name: 'Lysine', type: 'basic', mw: 146.19 },
  M: { name: 'Methionine', type: 'hydrophobic', mw: 149.21 },
  F: { name: 'Phenylalanine', type: 'hydrophobic', mw: 165.19 },
  P: { name: 'Proline', type: 'special', mw: 115.13 },
  S: { name: 'Serine', type: 'polar', mw: 105.09 },
  T: { name: 'Threonine', type: 'polar', mw: 119.12 },
  W: { name: 'Tryptophan', type: 'hydrophobic', mw: 204.23 },
  Y: { name: 'Tyrosine', type: 'polar', mw: 181.19 },
  V: { name: 'Valine', type: 'hydrophobic', mw: 117.15 }
};

/**
 * Validates an amino acid sequence string.
 * @param {string} rawSequence 
 * @returns {object} Validation result
 */
export function validateSequence(rawSequence) {
  if (!rawSequence || typeof rawSequence !== 'string') {
    return {
      isValid: false,
      cleanedSequence: '',
      length: 0,
      errors: ['Sequence cannot be empty.'],
      invalidChars: [],
      estimatedMwKDa: 0
    };
  }

  // Remove whitespace, numbers, carriage returns, formatting
  const sanitized = rawSequence.replace(/[\s\r\n\t0-9]/g, '').toUpperCase();

  if (sanitized.length === 0) {
    return {
      isValid: false,
      cleanedSequence: '',
      length: 0,
      errors: ['Sequence contains no amino acid characters.'],
      invalidChars: [],
      estimatedMwKDa: 0
    };
  }

  const invalidChars = [];
  let totalMw = 0;

  for (let i = 0; i < sanitized.length; i++) {
    const char = sanitized[i];
    if (!VALID_AMINO_ACIDS.has(char)) {
      invalidChars.push({ char, position: i + 1 });
    } else {
      totalMw += AMINO_ACID_PROPERTIES[char]?.mw || 110;
    }
  }

  const errors = [];
  if (invalidChars.length > 0) {
    const uniqueInvalid = Array.from(new Set(invalidChars.map(item => item.char))).join(', ');
    errors.push(`Invalid amino acid residue(s) detected: [${uniqueInvalid}]. Only 20 standard canonical amino acids (A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, V, W, Y) are accepted.`);
  }

  // Warning if sequence is truncated per ESM-2 1024 AA limit
  const isTruncated = sanitized.length > 1024;
  const warnings = [];
  if (isTruncated) {
    warnings.push(`Sequence exceeds 1,024 amino acids (${sanitized.length} AA). Per ESM-2 tokenization protocol, it will be automatically truncated to the first 1,024 residues.`);
  }

  const estimatedMwKDa = (totalMw / 1000).toFixed(2);

  return {
    isValid: invalidChars.length === 0,
    cleanedSequence: sanitized,
    length: sanitized.length,
    errors,
    warnings,
    invalidChars,
    isTruncated,
    estimatedMwKDa: parseFloat(estimatedMwKDa)
  };
}
