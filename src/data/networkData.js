/**
 * Curated network dataset for the Interactive Protein Interaction Network
 * Styled with a botanical scientific color palette.
 */

export const NETWORK_CLUSTERS = [
  { id: 'cell_cycle', name: 'Cell Cycle & DNA Repair', color: '#244A3B' },
  { id: 'signaling', name: 'RTK & Signal Transduction', color: '#659A8B' },
  { id: 'ubiquitin', name: 'Ubiquitin & Proteasome', color: '#88A58B' },
  { id: 'apoptosis', name: 'Apoptosis & Survival', color: '#C87575' },
  { id: 'transcription', name: 'Chromatin & Transcription', color: '#A5B18A' }
];

export const NETWORK_NODES = [
  {
    id: 'TP53',
    uniprotId: 'P04637',
    name: 'Cellular tumor antigen p53',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    cluster: 'cell_cycle',
    x: 420,
    y: 280,
    size: 24,
    degree: 8,
    goTerms: ['Apoptotic process (GO:0006915)', 'DNA repair (GO:0006281)', 'DNA binding (GO:0003677)', 'Nucleus (GO:0005634)']
  },
  {
    id: 'MDM2',
    uniprotId: 'Q00987',
    name: 'E3 ubiquitin-protein ligase Mdm2',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    cluster: 'ubiquitin',
    x: 490,
    y: 190,
    size: 20,
    degree: 6,
    goTerms: ['Protein ubiquitination (GO:0016567)', 'Negative regulation of p53 (GO:0043518)', 'Nucleus (GO:0005634)']
  },
  {
    id: 'CDK2',
    uniprotId: 'P24941',
    name: 'Cyclin-dependent kinase 2',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    cluster: 'cell_cycle',
    x: 320,
    y: 350,
    size: 22,
    degree: 7,
    goTerms: ['Cell cycle (GO:0007049)', 'Protein phosphorylation (GO:0006468)', 'ATP binding (GO:0005524)']
  },
  {
    id: 'CCNA2',
    uniprotId: 'P20248',
    name: 'Cyclin-A2',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    cluster: 'cell_cycle',
    x: 230,
    y: 390,
    size: 19,
    degree: 5,
    goTerms: ['Mitotic cell cycle (GO:0000278)', 'Protein kinase binding (GO:0019901)']
  },
  {
    id: 'CDKN1A',
    uniprotId: 'P38936',
    name: 'Cyclin-dependent kinase inhibitor 1 (p21)',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    cluster: 'cell_cycle',
    x: 360,
    y: 250,
    size: 20,
    degree: 6,
    goTerms: ['G1/S transition of mitotic cell cycle (GO:0000082)', 'Kinase inhibitor activity (GO:0019207)']
  },
  {
    id: 'EGFR',
    uniprotId: 'P00533',
    name: 'Epidermal growth factor receptor',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    cluster: 'signaling',
    x: 640,
    y: 360,
    size: 22,
    degree: 7,
    goTerms: ['EGFR signaling pathway (GO:0007173)', 'Protein tyrosine kinase activity (GO:0004714)', 'Plasma membrane (GO:0005886)']
  },
  {
    id: 'GRB2',
    uniprotId: 'P62993',
    name: 'Growth factor receptor-bound protein 2',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    cluster: 'signaling',
    x: 580,
    y: 440,
    size: 19,
    degree: 6,
    goTerms: ['Signal transduction (GO:0007165)', 'SH2/SH3 domain binding (GO:0017124)']
  },
  {
    id: 'SOS1',
    uniprotId: 'Q07889',
    name: 'Son of sevenless homolog 1',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    cluster: 'signaling',
    x: 680,
    y: 480,
    size: 18,
    degree: 5,
    goTerms: ['Guanine nucleotide exchange factor activity (GO:0005085)', 'Ras signaling (GO:0007265)']
  },
  {
    id: 'HRAS',
    uniprotId: 'P01112',
    name: 'GTPase HRas',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    cluster: 'signaling',
    x: 750,
    y: 410,
    size: 20,
    degree: 5,
    goTerms: ['Small GTPase mediated signal transduction (GO:0007264)', 'GTP binding (GO:0005525)']
  },
  {
    id: 'BAX',
    uniprotId: 'Q07812',
    name: 'Apoptosis regulator BAX',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    cluster: 'apoptosis',
    x: 480,
    y: 360,
    size: 19,
    degree: 5,
    goTerms: ['Release of cytochrome c from mitochondria (GO:0001836)', 'Positive regulation of apoptotic process (GO:0043065)']
  },
  {
    id: 'BCL2',
    uniprotId: 'P10415',
    name: 'Apoptosis regulator Bcl-2',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    cluster: 'apoptosis',
    x: 550,
    y: 300,
    size: 20,
    degree: 5,
    goTerms: ['Negative regulation of apoptotic process (GO:0043066)', 'Mitochondrial outer membrane (GO:0005741)']
  },
  {
    id: 'ATM',
    uniprotId: 'Q13315',
    name: 'Serine/threonine-protein kinase ATM',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    cluster: 'cell_cycle',
    x: 350,
    y: 160,
    size: 20,
    degree: 4,
    goTerms: ['DNA damage response (GO:0006974)', 'Protein kinase activity (GO:0004672)']
  },
  {
    id: 'EP300',
    uniprotId: 'Q09472',
    name: 'Histone acetyltransferase p300',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    cluster: 'transcription',
    x: 270,
    y: 210,
    size: 19,
    degree: 4,
    goTerms: ['Histone acetylation (GO:0016575)', 'Transcription coactivator activity (GO:0003713)']
  },
  {
    id: 'CDC28',
    uniprotId: 'P00546',
    name: 'Cyclin-dependent kinase 1 (Yeast)',
    organism: 'Saccharomyces cerevisiae',
    organismId: 's_cerevisiae',
    cluster: 'cell_cycle',
    x: 180,
    y: 180,
    size: 20,
    degree: 4,
    goTerms: ['G2/M transition of mitotic cell cycle (GO:0000086)', 'ATP binding (GO:0005524)']
  },
  {
    id: 'CLB2',
    uniprotId: 'P24869',
    name: 'G2/mitotic-specific cyclin-2 (Yeast)',
    organism: 'Saccharomyces cerevisiae',
    organismId: 's_cerevisiae',
    cluster: 'cell_cycle',
    x: 120,
    y: 250,
    size: 18,
    degree: 3,
    goTerms: ['Cell cycle (GO:0007049)', 'Protein kinase binding (GO:0019901)']
  }
];

export const NETWORK_EDGES = [
  { source: 'TP53', target: 'MDM2', weight: 0.98, type: 'Physical / Ubiquitination', confidence: 'Very High (0.98)' },
  { source: 'TP53', target: 'CDKN1A', weight: 0.96, type: 'Transcriptional Activation', confidence: 'Very High (0.96)' },
  { source: 'TP53', target: 'BAX', weight: 0.94, type: 'Apoptotic Induction', confidence: 'Very High (0.94)' },
  { source: 'TP53', target: 'ATM', weight: 0.95, type: 'Phosphorylation Activation', confidence: 'Very High (0.95)' },
  { source: 'TP53', target: 'EP300', weight: 0.92, type: 'Coactivation Acetylation', confidence: 'High (0.92)' },
  { source: 'CDK2', target: 'CCNA2', weight: 0.99, type: 'Kinase-Cyclin Complex', confidence: 'Very High (0.99)' },
  { source: 'CDK2', target: 'CDKN1A', weight: 0.97, type: 'Kinase Inhibition', confidence: 'Very High (0.97)' },
  { source: 'EGFR', target: 'GRB2', weight: 0.96, type: 'Phosphotyrosine SH2 Binding', confidence: 'Very High (0.96)' },
  { source: 'GRB2', target: 'SOS1', weight: 0.95, type: 'SH3-Proline Rich Binding', confidence: 'Very High (0.95)' },
  { source: 'SOS1', target: 'HRAS', weight: 0.94, type: 'GEF Activation', confidence: 'High (0.94)' },
  { source: 'EGFR', target: 'HRAS', weight: 0.88, type: 'Downstream Signaling', confidence: 'High (0.88)' },
  { source: 'BAX', target: 'BCL2', weight: 0.96, type: 'Heterodimerization Block', confidence: 'Very High (0.96)' },
  { source: 'MDM2', target: 'CDKN1A', weight: 0.84, type: 'Ubiquitination / Degradation', confidence: 'Medium-High (0.84)' },
  { source: 'ATM', target: 'MDM2', weight: 0.89, type: 'Phosphorylation', confidence: 'High (0.89)' },
  { source: 'CDC28', target: 'CLB2', weight: 0.97, type: 'Orthologous CDK-Cyclin Complex', confidence: 'Very High (0.97)' }
];
