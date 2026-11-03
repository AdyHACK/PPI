/**
 * Curated authentic protein entries across 4 model organisms
 * Includes canonical amino acid sequences and Gene Ontology (BP, MF, CC) terms.
 */

export const ORGANISMS = [
  { id: 'h_sapiens', name: 'Homo sapiens', commonName: 'Human', taxonId: '9606', icon: '🧬' },
  { id: 's_cerevisiae', name: 'Saccharomyces cerevisiae', commonName: 'Baker\'s Yeast', taxonId: '4932', icon: '🍞' },
  { id: 'm_musculus', name: 'Mus musculus', commonName: 'House Mouse', taxonId: '10090', icon: '🐭' },
  { id: 'd_melanogaster', name: 'Drosophila melanogaster', commonName: 'Fruit Fly', taxonId: '7227', icon: '🪰' }
];

export const SAMPLE_PROTEINS = [
  // HOMO SAPIENS
  {
    id: 'P04637',
    name: 'Cellular tumor antigen p53 (TP53)',
    geneSymbol: 'TP53',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    length: 393,
    mwKDa: 43.65,
    description: 'Acts as a tumor suppressor in many tumor types; induces growth arrest or apoptosis depending on the physiological circumstance and cell type.',
    sequence: 'MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYQGSYGFRLGFLHSGTAKSVTCTYSPALNKMFCQLAKTCPVQLWVDSTPPPGTRVRAMAIYKQSQHMTEVVRRCPHHERCSDSDGLAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYEPPEVGSDCTTIHYNYMCNSSCMGGMNRRPILTIITLEDSSGNLLGRNSFEVRVCACPGRDRRTEEENLRKKGEPHHELPPGSTKRALPNNTSSSPQPKKKPLDGEYFTLQIRGRERFEMFRELNEALELKDAQAGKEPGGSRAHSSHLKSKKGQSTSRHKKLMFKTEGPDSD',
    goAnnotations: {
      bp: [
        { id: 'GO:0006915', term: 'Apoptotic process', evidence: 'IDA' },
        { id: 'GO:0006281', term: 'DNA repair', evidence: 'IDA' },
        { id: 'GO:0007049', term: 'Cell cycle arrest', evidence: 'EXP' },
        { id: 'GO:0042770', term: 'Signal transduction in response to DNA damage', evidence: 'TAS' }
      ],
      mf: [
        { id: 'GO:0003677', term: 'DNA binding', evidence: 'IDA' },
        { id: 'GO:0003700', term: 'Sequence-specific transcription factor activity', evidence: 'IDA' },
        { id: 'GO:0005515', term: 'Protein binding', evidence: 'IPI' },
        { id: 'GO:0008270', term: 'Zinc ion binding', evidence: 'IDA' }
      ],
      cc: [
        { id: 'GO:0005634', term: 'Nucleus', evidence: 'IDA' },
        { id: 'GO:0005654', term: 'Nucleoplasm', evidence: 'TAS' },
        { id: 'GO:0005737', term: 'Cytoplasm', evidence: 'IDA' },
        { id: 'GO:0005739', term: 'Mitochondrion', evidence: 'IDA' }
      ]
    }
  },
  {
    id: 'Q00987',
    name: 'E3 ubiquitin-protein ligase Mdm2 (MDM2)',
    geneSymbol: 'MDM2',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    length: 491,
    mwKDa: 55.23,
    description: 'E3 ubiquitin-protein ligase that mediates ubiquitination of p53/TP53, leading to its degradation by the proteasome and inhibition of p53-mediated cell cycle arrest.',
    sequence: 'MCNTNMSVPTDGAVTTSQIPASEQETLVRPKPLLLKLLKSVGAQKDTYTMKEVLFYLGQYIMTKRLYDEKQQHIVYCSNDLLGDLFGVPSFSVKEHRKIYTMIYRNLVVVNQQESSDSGTSVSENRCHLEGGSDQKDLVQELQEEKPSSSHLVSRPSTSSRRRAISETEENSDELSGERQRKRHKSDSISLSFDESLALCVIREICCERSSSSESTGTPSNPDLDAGVSEHSGDWLDQDSVSDQFSVEFEVESLDSEDYSLSEEGQELSDEDDEVYQVTVYQAGESDTDSFEEDPEISLADYWKCTSCNEMNPPLPSHCNRCWALRENWLPEDKGKDKGEISEKAKLENSTQAEEGFDVPDCKKTIVNDSRESCVEENDDKITQASQSQESEDYSQPSTSSSIIYSSQEDVKEFEREETQDKEESVESSLPLNAIEPCVICQGRPKNGCIVHGKTGHLMACFTCAKKLKKRNKPCPVCRQPIQMIVLTYFP',
    goAnnotations: {
      bp: [
        { id: 'GO:0016567', term: 'Protein ubiquitination', evidence: 'IDA' },
        { id: 'GO:0043161', term: 'Proteasome-mediated ubiquitin-dependent protein catabolic process', evidence: 'IMP' },
        { id: 'GO:0006915', term: 'Regulation of apoptotic process', evidence: 'IDA' }
      ],
      mf: [
        { id: 'GO:0004842', term: 'Ubiquitin-protein transferase activity', evidence: 'IDA' },
        { id: 'GO:0005515', term: 'Protein binding', evidence: 'IPI' },
        { id: 'GO:0008270', term: 'Zinc ion binding', evidence: 'IDA' }
      ],
      cc: [
        { id: 'GO:0005634', term: 'Nucleus', evidence: 'IDA' },
        { id: 'GO:0005737', term: 'Cytoplasm', evidence: 'IDA' },
        { id: 'GO:0005654', term: 'Nucleoplasm', evidence: 'TAS' }
      ]
    }
  },
  {
    id: 'P24941',
    name: 'Cyclin-dependent kinase 2 (CDK2)',
    geneSymbol: 'CDK2',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    length: 298,
    mwKDa: 33.93,
    description: 'Serine/threonine kinase involved in the control of the cell cycle; essential for the G1-S phase transition and progression through S phase.',
    sequence: 'MENFQKVEKIGEGTYGVVYKARNKLTGEVVALKKIRLDTETEGVPSTAIREISLLKELNHPNIVKLLDVIHTENKLYLVFEFLHQDLKKFMDASALTGIPLPLIKSYLFQLLQGLAFCHSHRVLHRDLKPQNLLINTEGAIKLADFGLARAFGVPVRTYTHEVVTLWYRAPEILLGCKYYSTAVDIWSLGCIFAEMVTRRALFPGDSEIDQLFRIFRTLGTPDEVVWPGVTSMPDYKPSFPKWARQDFSKVVPPLDEDGRSLLSQMLHYDPNKRISAKAALAHPFFQDVTKPVPHLRL',
    goAnnotations: {
      bp: [
        { id: 'GO:0007049', term: 'Cell cycle', evidence: 'TAS' },
        { id: 'GO:0000075', term: 'Cell cycle checkpoint signaling', evidence: 'IDA' },
        { id: 'GO:0006468', term: 'Protein phosphorylation', evidence: 'IDA' }
      ],
      mf: [
        { id: 'GO:0004693', term: 'Cyclin-dependent protein serine/threonine kinase activity', evidence: 'IDA' },
        { id: 'GO:0005524', term: 'ATP binding', evidence: 'IDA' },
        { id: 'GO:0005515', term: 'Protein binding', evidence: 'IPI' }
      ],
      cc: [
        { id: 'GO:0005634', term: 'Nucleus', evidence: 'IDA' },
        { id: 'GO:0005737', term: 'Cytoplasm', evidence: 'IDA' }
      ]
    }
  },
  {
    id: 'P20248',
    name: 'Cyclin-A2 (CCNA2)',
    geneSymbol: 'CCNA2',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    length: 432,
    mwKDa: 48.57,
    description: 'Essential for the control of the cell cycle at the G1/S (start) and the G2/M (mitosis) transitions; forms complexes with and activates CDK1 and CDK2.',
    sequence: 'MLGNSAPGPATREAGSALLALQQTALQEDQENINPEKAAPVQQPRTRAALAVLKSGNPRGLAQQQRPKTRRVAPLKDLPVNDEHVTVPPWKANSKQPAFTIHVDEAEKEAQKKPAESQKIEREDALAFNSAISLPGPRKPLVPLDYPMDGSFESPHTMDMSIVLEDEKPVSVNEVPDYHEDIHTYLREMEVKCKPKVGYMKKQPDITNSMRAILVDWLVEVGEEYKLQNETLHLAVNYIDRFLSSMSVLRGKLQLVGTAAMLLASKFEEIYPPEVAEFVYITDDTYTKKQVLRMEHLVLKVLTFDLAAPTVNQFLTQYFLHQQPANCKVESLAMFLGELSLIDADPYLKYLPSVIAGAAFHLALYTVTGQSWPESLIRKTGYTLESLKPCLMDLHQTYLKAPQHAQQSIREKYKNSKYHGVSLLNPPETLNL',
    goAnnotations: {
      bp: [
        { id: 'GO:0000278', term: 'Mitotic cell cycle', evidence: 'TAS' },
        { id: 'GO:0051726', term: 'Regulation of cell cycle', evidence: 'IDA' }
      ],
      mf: [
        { id: 'GO:0019901', term: 'Protein kinase binding', evidence: 'IPI' },
        { id: 'GO:0005515', term: 'Protein binding', evidence: 'IPI' }
      ],
      cc: [
        { id: 'GO:0005634', term: 'Nucleus', evidence: 'IDA' },
        { id: 'GO:0005737', term: 'Cytoplasm', evidence: 'IDA' }
      ]
    }
  },
  {
    id: 'P00533',
    name: 'Epidermal growth factor receptor (EGFR)',
    geneSymbol: 'EGFR',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    length: 1210,
    mwKDa: 134.28,
    description: 'Receptor tyrosine kinase binding ligands of the EGF family and activating several signaling cascades to convert extracellular cues into cellular responses.',
    sequence: 'MRPSGTAGAALLALLAALCPASRALEEKKVCQGTSNKLTQLGTFEDHFLSLQRMFNNCEVVLGNLEITYVQRNYDLSFLKTIQEVAGYVLIALNTVERIPLENLQIIRGNMYYENSYALAVLSNYDANKTGLKELPMRNLQEILHGAVRFSNNPALCNVESIQWRDIVSSDFLSNMSMDFQNHLGSCQKCDPSCPNGSCWGAGEENCQKLTKIICAQQCSGRCRGKSPSDCCHNQCAAGCTGPRESDCLVCRKFRDEATCKDTCPPLMLYNPTTYQMDVNPEGKYSFGATCVKKCPRNYVVTDHGSCVRACGADSYEMEEDGVRKCKKCEGPCRKVCNGIGIGEFKDSLSINATNIKHFKNCTSISGDLHILPVAFRGDSFTHTPPLDPQELDILKTVKEITGFLLIQAWPENRTDLHAFENLEIIRGRTKQHGQFSLAVVSLNITSLGLRSLKEISDGDVIISGNKNLCYANTINWKKLFGTSGQKTKIISNRGENSCKATGQVCHALCSPEGCWGPEPRDCVSCRNVSRGRECVDKCNLLEGEPREFVENSECIQCHPECLPQAMNITCTGRGPDNCIQCAHYIDGPHCVKTCPAGVMGENNTLVWKYADAGHVCHLCHPNCTYGCTGPGLEGCPTNGPKIPSIATGMVGALLLLLVVALGIGLFMRRRHIVRKRTLRRLLQERELVEPLTPSGEAPNQALLRILKETEFKKIKVLGSGAFGTVYKGLWIPEGEKVKIPVAIKELREATSPKANKEILDEAYVMASVDNPHVCRLLGICLTSTVQLITQLMPFGCLLDYVREHKDNIGSQYLLNWCVQIAKGMNYLEDRRLVHRDLAARNVLVKTPQHVKITDFGLAKLLGAEEKEYHAEGGKVPIKWMALESILHRIYTHQSDVWSYGVTVWELMTFGSKPYDGIPASEISSILEKGERLPQPPICTIDVYMIMVKCWMIDADSRPKFRELIIEFSKMARDPQRYLVIQGDERMHLPSPTDSNFYRALMDEEDMDDVVDADEYLIPQQGFFSSPSTSRTPLLSSLSATSNNSTVACIDRNGLQSCPIKEDSFLQRYSSDPTGALTEDSIDDTFLPVPEYINQSVPKRPAGSVQNPVYHNQPLNPAPSRDPHYQDPHSTAVGNPEYLNTVQPTCVNSTFDSPAHWAQKGSHQISLDNPDYQQDFFPKEAKPNGIFKGSTAENAEYLRVAPQSSEFIGA',
    goAnnotations: {
      bp: [
        { id: 'GO:0007173', term: 'Epidermal growth factor receptor signaling pathway', evidence: 'TAS' },
        { id: 'GO:0006468', term: 'Protein autophosphorylation', evidence: 'IDA' }
      ],
      mf: [
        { id: 'GO:0004714', term: 'Transmembrane receptor protein tyrosine kinase activity', evidence: 'IDA' },
        { id: 'GO:0005524', term: 'ATP binding', evidence: 'IDA' }
      ],
      cc: [
        { id: 'GO:0005886', term: 'Plasma membrane', evidence: 'IDA' },
        { id: 'GO:0005768', term: 'Endosome', evidence: 'IDA' }
      ]
    }
  },
  {
    id: 'P62993',
    name: 'Growth factor receptor-bound protein 2 (GRB2)',
    geneSymbol: 'GRB2',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    length: 217,
    mwKDa: 25.21,
    description: 'Adapter protein that provides a critical link between cell surface growth factor receptor tyrosine kinases and the Ras signaling pathway.',
    sequence: 'MEAIAKYDFKATADDELSFKRGDILKVLNEECDQNWYKAELNGKDGFIPKNYIEMKPHPWFFGKIPRAKAEEMLSKQRHDGAFLIRNTESAPGDFSLSVKFGNDVQHFKVLRDGAGKYFLWVVKFNSLNELVDYHRSTSVSRNQQIFLRDIEQVPQQPTYVQALFDFDPQEDGELGFRRGDFIHVMDNSDPNWWKGACHGQTGMFPRNYVTPVNRNV',
    goAnnotations: {
      bp: [
        { id: 'GO:0007165', term: 'Signal transduction', evidence: 'TAS' },
        { id: 'GO:0007265', term: 'Ras protein signal transduction', evidence: 'IDA' }
      ],
      mf: [
        { id: 'GO:0019901', term: 'Protein kinase binding', evidence: 'IPI' },
        { id: 'GO:0005515', term: 'Protein binding', evidence: 'IPI' }
      ],
      cc: [
        { id: 'GO:0005737', term: 'Cytoplasm', evidence: 'IDA' },
        { id: 'GO:0005886', term: 'Plasma membrane', evidence: 'IDA' }
      ]
    }
  },
  {
    id: 'P69905',
    name: 'Hemoglobin subunit alpha (HBA1)',
    geneSymbol: 'HBA1',
    organism: 'Homo sapiens',
    organismId: 'h_sapiens',
    length: 142,
    mwKDa: 15.26,
    description: 'Involved in oxygen transport from the lung to the peripheral tissues; negative control for nuclear p53 interactions.',
    sequence: 'MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR',
    goAnnotations: {
      bp: [
        { id: 'GO:0015671', term: 'Oxygen transport', evidence: 'IDA' }
      ],
      mf: [
        { id: 'GO:0005344', term: 'Oxygen transporter activity', evidence: 'IDA' },
        { id: 'GO:0020037', term: 'Heme binding', evidence: 'IDA' }
      ],
      cc: [
        { id: 'GO:0005829', term: 'Cytosol', evidence: 'IDA' },
        { id: 'GO:0072562', term: 'Blood microparticle', evidence: 'TAS' }
      ]
    }
  },

  // SACCHAROMYCES CEREVISIAE (YEAST)
  {
    id: 'P00546',
    name: 'Cyclin-dependent kinase 1 (CDC28)',
    geneSymbol: 'CDC28',
    organism: 'Saccharomyces cerevisiae',
    organismId: 's_cerevisiae',
    length: 298,
    mwKDa: 34.05,
    description: 'Catalytic subunit of the main cell cycle cyclin-dependent kinase in yeast; coordinates cell division with mitotic and B-type cyclins.',
    sequence: 'MSGELANYKRLEKVGEGTYGVVYKALDLRPGQGQRVVALKKIRLESEDEGVPSTAIREISLLKELKDDNIVRLYDIVHSDAHKLYLVFEFLDLDLKRYMEGIPKDQPLGADIVKKFMMQLCKGIAYCHSHRILHRDLKPQNLLINKDGNLKLGDFGLARAFGVPLRNYTHEIVTLWYRAPEVLLGGKQYSTGVDTWSIGCIFAEMCNRKPIFSGDSEIDQIFKIFRVLGTPNEAIWPDIVYLPDFKPSFPQWRRKDLSQVVPSLDPRGIDLLDKLLAYDPINRISAKKAMEHPYFNDHNIPLA',
    goAnnotations: {
      bp: [
        { id: 'GO:0007049', term: 'Cell cycle', evidence: 'IDA' },
        { id: 'GO:0000086', term: 'G2/M transition of mitotic cell cycle', evidence: 'IMP' }
      ],
      mf: [
        { id: 'GO:0004693', term: 'Cyclin-dependent protein serine/threonine kinase activity', evidence: 'IDA' },
        { id: 'GO:0005524', term: 'ATP binding', evidence: 'IDA' }
      ],
      cc: [
        { id: 'GO:0005634', term: 'Nucleus', evidence: 'IDA' },
        { id: 'GO:0005737', term: 'Cytoplasm', evidence: 'IDA' }
      ]
    }
  },
  {
    id: 'P24869',
    name: 'G2/mitotic-specific cyclin-2 (CLB2)',
    geneSymbol: 'CLB2',
    organism: 'Saccharomyces cerevisiae',
    organismId: 's_cerevisiae',
    length: 491,
    mwKDa: 56.28,
    description: 'B-type cyclin involved in cell cycle progression through mitosis; activates Cdc28p kinase to promote mitotic entry.',
    sequence: 'MSHQQQQLLNPLTPSSSNTSVRTPTQLTPRRSSLLTNNSVNSSKPTLSKVHSSLPNSNTRVLRHPTLNDTNKLNVNNRNDLVTNPMSNTRTFLQQSNNSNTRKFFTPKLSNTRKFFTPKSSPTRRNTPTNRLSSRRSRLVTNTNSSSSSSKPNSRRQSLSLSNNSKSTSKLTTNTKSTPTKSTSKTTTKTLTSTSTTKTAANNAKSTPTKSTAKSTAKNTANTKTSTPTESTSTSTTKTSTTTSTTKSTSTNKLNVNNRNDLVTNPMSNTRTFLQQSNNSNTRKFFTPKLSNTRKFFTPKSSPTRRNTPTNRLSSRRSRLVTNTNSSSSSSKPNSRRQSLSLSNNSKSTSKLTTNTKSTPTKSTSKTTTKTLTSTSTTKTAANNAKSTPTKSTAKSTAKNTANTKTSTPTESTSTSTTKTSTTTSTTKSTST',
    goAnnotations: {
      bp: [
        { id: 'GO:0000086', term: 'G2/M transition of mitotic cell cycle', evidence: 'IDA' },
        { id: 'GO:0007049', term: 'Cell cycle', evidence: 'TAS' }
      ],
      mf: [
        { id: 'GO:0019901', term: 'Protein kinase binding', evidence: 'IPI' }
      ],
      cc: [
        { id: 'GO:0005634', term: 'Nucleus', evidence: 'IDA' }
      ]
    }
  },

  // MUS MUSCULUS (MOUSE)
  {
    id: 'P02340',
    name: 'Cellular tumor antigen p53 (Trp53)',
    geneSymbol: 'Trp53',
    organism: 'Mus musculus',
    organismId: 'm_musculus',
    length: 390,
    mwKDa: 43.48,
    description: 'Mouse ortholog of tumor suppressor p53; regulates cell cycle arrest and apoptosis upon genotoxic stress.',
    sequence: 'MEESQSDISLELPLSQETFSGLWKLLPPEDILPSPHCMDDLLLPQDVEEFFEGPSEALRVSGAPAAQDPVTETPGPVAPAPATPWPLSSFVPSQKTYQGNYGFHLGFLQSGTAKSVMCTYSPCLNKLFCQLAKTCPVQLWVSSPPPPNTCVRAMAIYKKSEFMTEVVRRCPHHERCSDGDGLAPPQHLIRVEGNLYPEYLEDRQTFRHSVVVPYEPPEVGSDCTTIHYNYMCNSSCMGGMNRRPILTIITLEDSSGNLLGRDSFEVRVCACPGRDRRTEEENFRKKEVLCPELPPGSAKRALPTCTSASPPQKKKPLDGEYFTLKIRGRKRFEMFRELNEALELKDAHATEESGDSRAHSSYLKTKKGQSTSRHKKTMVKKVGPDSD',
    goAnnotations: {
      bp: [
        { id: 'GO:0006915', term: 'Apoptotic process', evidence: 'IDA' },
        { id: 'GO:0006281', term: 'DNA repair', evidence: 'IDA' }
      ],
      mf: [
        { id: 'GO:0003677', term: 'DNA binding', evidence: 'IDA' },
        { id: 'GO:0005515', term: 'Protein binding', evidence: 'IPI' }
      ],
      cc: [
        { id: 'GO:0005634', term: 'Nucleus', evidence: 'IDA' }
      ]
    }
  },

  // DROSOPHILA MELANOGASTER (FRUIT FLY)
  {
    id: 'P23226',
    name: 'Cyclin-dependent kinase 1 (Cdk1)',
    geneSymbol: 'Cdk1',
    organism: 'Drosophila melanogaster',
    organismId: 'd_melanogaster',
    length: 297,
    mwKDa: 34.12,
    description: 'Drosophila master mitotic regulator; complexes with Cyclin A and Cyclin B to initiate nuclear envelope breakdown and mitotic spindle assembly.',
    sequence: 'MEDFEKIEKIGEGTYGVVYKGRNRATGQIVALKKIRLESEEEGVPSTAIREISLLKELRHPNIVSLLDVVHTENKLYLVFEYLDKDLKKYMDICPDAVPLPVVKSYLFQLLQGVSFCHSHRVIHRDLKPQNLLIDREGSIKLADFGLARAFGVPLRTYTHEVVTLWYRAPEILLGSKFYSTAVDIWSLGCIFAEMITRKPLFPGDSEIDQLFRIFRLLGTPNEEVWPGVTALPDYKNTFPKWRPQNLSNVVPQLDAKGRDLLSKMLVYDPNKRISAKRALQHPYFDDLDKSAL',
    goAnnotations: {
      bp: [
        { id: 'GO:0000278', term: 'Mitotic cell cycle', evidence: 'IDA' }
      ],
      mf: [
        { id: 'GO:0004693', term: 'Cyclin-dependent protein serine/threonine kinase activity', evidence: 'IDA' },
        { id: 'GO:0005524', term: 'ATP binding', evidence: 'IDA' }
      ],
      cc: [
        { id: 'GO:0005634', term: 'Nucleus', evidence: 'IDA' }
      ]
    }
  }
];
