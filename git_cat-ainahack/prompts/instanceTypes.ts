export const TIPUS_INSTANCIES = `TIPUS D’INSTÀNCIES:
1- INSTÀNCIA GENÈRICA (id: 1). Descripció: Instància per a sol·licitar informació general o ajuda amb tràmits administratius.
2- INSTÀNCIA BECA MENJADOR (id: 2). Descripció: Instància per sol·licitar ajudes de menjador per a estudiants.
3- INSTÀNCIA DUPLICAT DE CERTIFICAT (id: 3). Descripció: Instància per sol·licitar un còpies o duplicats de documents oficials, habitualment perduts.
4- INFORME D'ACCIDENT DE TRÀNSIT DE LA GUÀRDIA URBANA (id: 4). Descripció: Instància per a documentar l'ocurrència de sinistres de trànsit a l'autoritat'.
5- CERTIFICAT DE PAGAMENT DE MULTES, IMPOSTOS, TAXES I PREUS PÚBLICS (id: 5). Descripció: Instància per a sol·licitar una acreditació que et permeti pagar diferents tràmits públics.
6- BONIFICACIÓ DE L'IMPOST SOBRE BÉNS IMMOBLES (id: 6). Descripció: Instància per a sol·licitar una bonificació de la quota de l’Impost sobre Béns Immobles (IBI).
7- CANVI D'ADREÇA FISCAL (id: 7). Descripció: Instància per a comunicar un canvi de domicili de contribuents donats d'alta a les bases de dades de tributs i multes de l'Institut Municipal d'Hisenda.
8- SUSPENSIÓ DE L'EXECUCIÓ DE SANCIONS PER INFRACCIONS DE TRÀNSIT (id: 8). Descripció: Instància per a sol·licitar la suspensió de l’execució de sancions per a les normes de circulació per infraccions lleus o greus que no comportin suspensió del permís o llicència de conducció.
9- ALTA PER NAIXEMENT AL PADRÓ MUNICIPAL D'HABITANTS (id: 9). Descripció: Instància per a sol·licitar l’alta al padró municipal del vostre nadó.
10- BAIXA DE LA LLICÈNCIA DE TERRASSES (id: 10). Descripció: Instància per a sol·licitar la baixa del permís d'instal·lació de terrasa ubicada en les places, carrers i espais d'ús públic.`;

export const LLISTA_INSTANCIES = [
    "(id: 1)",
    "(id: 2)",
    "(id: 3)",
    "(id: 4)",
    "(id: 5)",
    "(id: 6)",
    "(id: 7)",
    "(id: 8)",
    "(id: 9)",
    "(id: 10)"
]

export const InstanceData: { [key: string]: any } = {
    '(id: 1)': require('./instanceData/instancia-generica.json'),
    '(id: 2)': require('./instanceData/instancia-beca-menjador.json'),
    '(id: 3)': require('./instanceData/instancia-duplicat-de-certificat.json'),
    '(id: 4)': require('./instanceData/instancia-d-accident-de-transit-de-la-guardia-urbana.json'),
    '(id: 5)': require('./instanceData/certificat-pagament-de-multes-impostos-taxes-i-drets-publics.json'),
    '(id: 6)': require('./instanceData/bonificacio-de-l-impost-sobre-bens-immobles.json'),
    '(id: 7)': require('./instanceData/canvi-d-adreca-fiscal.json'),
    '(id: 8)': require('./instanceData/suspensio-de-l-execusio-de-sancions-per-infraccions-de-transit.json'),
    '(id: 9)': require('./instanceData/alta-per-naixament-al-padro-municipal-d-habitants.json'),
    '(id: 10)': require('./instanceData/alta-per-baixa-de-la-llicencia-de-terrasses.json')
  };
  
  export const getInstanceData = (key: string) => {
    const data = InstanceData[key];
    if (!data) throw new Error(`No data found for instance type: ${key}`);
    return data;
  };
/* 
  'INSTÀNCIA BECA MENJADOR': require('./instanceData/instancia-beca-menjador.json'),
    'INSTÀNCIA DUPLICAT DE CERTIFICAT': require('./instanceData/instancia-duplicat-certificat.json'),
    'INSTÀNCIA D\'ACCIDENT DE TRÀNSIT DE LA GUARDIA URBANA': require('./instanceData/instantia-accident-transit.json'),
    'CERTIFICAT DE PAGAMENT DE MULTES, IMPOSTOS, TAXES I PREUS PÚBLICS': require('./instanceData/certificat-pagament.json'),    
    'BONIFICACIÓ DE L\'IMPOST SOBRE  BÉNS IMMOBLES': require('./instanceData/bonificacio-ibi.json'),
    'CANVI D\'ADREÇA FISCAL': require('./instanceData/canvi-adreca-fiscal.json'),
    'SUSPENSIÓ DE L\'EXECUCIÓ DE SANCIONS PER INFRACCIONS DE TRÀNSIT': require('./instanceData/suspensio-sancions-transit.json'),
    'ALTA PER NAIXEMENT AL PADRÓ MUNICIPAL D\'HABITANTS': require('./instanceData/alta-naixement-padro.json'),
    'BAIXA DE LA LLICÈNCIA DE TERRASSES': require('./instanceData/baixa-llicencia-terrasses.json'), */