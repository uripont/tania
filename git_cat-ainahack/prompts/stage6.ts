/**
 * Prompt per a que donats uns paràmetres, el model pugui extreure la dada que correspon al camp de la frase que ha dit l'usuari.
 * @param camp          Camp pel qual s'ha de buscar la dada. Per exemple: DNI.
 * @param exempleDades  Exemple de dades que poden aparèixer en aquest camp. Per exemple: DNI: 12345678X, Passaport: AB1234567, T. R.: TR123456789
 * @param usuari        Frase de l'usuari on apareix una dada d'aquest camp. Per exemple: El meu DNI és 12345678X.
 * @returns             Prompt per a que el model pugui obtindre la dada corresponent al camp. En el exemlpe, la dada a extreure seria 12345678X.
 */
export function getStage2_6PromptStart(camp: string, exempleDades: string, usuari: string): string {
    return `
Has d'extreure una dada per a un camp a partir de la informació que et donem, que és la següent:
Camp: nom del camp
Possibles dades: exemples de dades que poden aparèixer en aquest camp
Usuari: frase de l'usuari on apareix una dada d'aquest camp.
Tu respons ÚNICAMENT amb la dada que hi ha a la frase de l'usuari i ACABA LA TEVA RESPOSTA.

Exemples d'interaccions:

Camp: DNI / Pass. / T. R.
Possibles dades: DNI: 12345678X, Passaport: AB1234567, T. R.: TR123456789
Usuari: El meu DNI és 12345678X.
Tu respons amb la dada: 12345678X

Camp: Nom i cognoms
Possibles dades: Joan Garcia Pérez, Maria López Martín, Carlos Sánchez Torres.
Usuari: Jo em dic Maria López Martín.
Tu respons amb la dada: Maria López Martín

Camp: Telèfon
Possibles dades: 123456789, 987654321, 666777888.
Usuari: Si, mira, el meu telèfon és 123456789.
Tu respons amb la dada: 123456789

Aquesta és l'ÚLTIMA interacció:
Camp: ${camp}
Possibles dades: ${exempleDades}
Usuari: ${usuari}
Tu respons amb la dada:`;
}
