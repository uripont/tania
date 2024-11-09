export const TIPUS_INSTANCIES = `TIPUS D’INSTÀNCIES:
1- INSTÀNCIA GENÈRICA. Descripció: Instància per a sol·licitar informació general o ajuda amb tràmits administratius.
2- INSTÀNCIA BECA MENJADOR. Descripció: Instància per sol·licitar ajudes de menjador per a estudiants.
3- INSTÀNCIA DUPLICAT DE CERTIFICAT. Descripció: Instància per sol·licitar un còpies o duplicats de documents oficials, habitualment perduts.
4- INFORME D'ACCIDENT DE TRÁNSIT DE LA GUARDIA URBANA. Descripció: Instància per a documentar l'ocurrència de sinistres de trànsit a l'autoritat'.
5- CERTIFICAT DE PAGAMENT DE MULTES, IMPOSTOS, TAXES I PREUS PÚBLICS. Descripció: Instància per a sol·licitar una acreditació que et permeti pagar diferents tràmits públics.
6- BONIFICACIÓ DE L'IMPOST SOBRE  BÉNS IMMOBLES. Descripció: Instància per a sol·licitar una bonificació de la quota de l’Impost sobre Béns Immobles (IBI).
7- CANVI D'ADREÇA FISCAL. Descripció: Instància per a comunicar un canvi de domicili de contribuents donats d'alta a les bases de dades de tributs i multes de l'Institut Municipal d'Hisenda.
8- SUSPENSIÓ DE L'EXECUCIÓ DE SANCIONS PER INFRACCIONS DE TRÀNSIT. Descripció: Instància per a sol·licitar la suspensió de l’execució de sancions per a les normes de circulació per infraccions lleus o greus que no comportin suspensió del permís o llicència de conducció.
9- ALTA PER NAIXEMENT AL PADRÓ MUNICIPAL D'HABITANTS. Descripció: Instància per a sol·licitar l’alta al padró municipal del vostre nadó.
10- BAIXA DE LA LLICÈNCIA DE TERRASSES. Descripció: Instància per a sol·licitar la baixa del permís d'instal·lació de terrasa ubicada en les places, carrers i espais d'ús públic.`;

export const LLISTA_INSTANCIES = [
    "INSTÀNCIA GENÈRICA",
    "INSTÀNCIA BECA MENJADOR",
    "INSTÀNCIA DUPLICAT DE CERTIFICAT",
    "INSTÀNCIA D'ACCIDENT DE TRÀNSIT DE LA GUARDIA URBANA",
    "CERTIFICAT DE PAGAMENT DE MULTES, IMPOSTOS, TAXES I PREUS PÚBLICS",
    "BONIFICACIÓ DE L'IMPOST SOBRE BÉNS IMMOBLES",
    "CANVI D'ADREÇA FISCAL",
    "SUSPENSIÓ DE L'EXECUCIÓ DE SANCIONS PER INFRACCIONS DE TRÀNSIT",
    "ALTA PER NAIXEMENT AL PADRÓ MUNICIPAL D'HABITANTS",
    "BAIXA DE LA LLICÈNCIA DE TERRASSES",
]

export const InstanceData: { [key: string]: any } = {
    'INSTÀNCIA GENÈRICA': require('./instanceData/instancia-generica.json'),
    'INSTÀNCIA BECA MENJADOR': require('./instanceData/instancia-beca-menjador.json'),
    'INSTÀNCIA DUPLICAT DE CERTIFICAT': require('./instanceData/instancia-duplicat-de-certificat.json'),
    'INSTÀNCIA D\'ACCIDENT DE TRÀNSIT DE LA GUARDIA URBANA': require('./instanceData/instancia-d-accident-de-transit-de-la-guardia-urbana.json'),
    'CERTIFICAT DE PAGAMENT DE MULTES, IMPOSTOS, TAXES I PREUS PÚBLICS': require('./instanceData/certificat-pagament-de-multes-impostos-taxes-i-drets-publics.json'),
    'BONIFICACIÓ DE L\'IMPOST SOBRE BÉNS IMMOBLES': require('./instanceData/bonificacio-de-l-impost-sobre-bens-immobles.json'),
    'CANVI D\'ADREÇA FISCAL': require('./instanceData/canvi-d-adreca-fiscal.json'),
    'SUSPENSIÓ DE L\'EXECUCIÓ DE SANCIONS PER INFRACCIONS DE TRÀNSIT': require('./instanceData/suspensio-de-l-execusio-de-sancions-per-infraccions-de-transit.json'),
    'ALTA PER NAIXEMENT AL PADRÓ MUNICIPAL D\'HABITANTS': require('./instanceData/alta-per-naixament-al-padro-municipal-d-habitants.json'),
    'BAIXA DE LA LLICÈNCIA DE TERRASSES': require('./instanceData/alta-per-baixa-de-la-llicencia-de-terrasses.json')
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