 <img src="README_media/AinaHack_logo.png" width="120">

---

<p align="center">
  <img src="README_media/TANIA_expressions.png" width="500">
</p>

# TANIA: Tecnologia d'Assistència Natural per Instàncies Administratives




#### Un projecte participant a l'*Aina Hack 2024* de l'equip *git cat/*

**TANIA** és una demo d'aplicació mòbil i web, representant la visió d'un assistent humanament intel·ligent per a la gestió de tràmits administratius telemàtics.

# image aqui
 
 La missió de TANIA és **millorar i agilitzar la comunicació entre ciutadania i l'administració pública**, mitjançant l'ús del llenguatge natural (amb tota la seva riquesa de dialectes i d'accents) en una interfície moderna, empàtica i accessible. 
 
 És una demostració de l'existència d'una **nova capa d'interacció entre la ciutadania i l'administració pública**, fins ara inexplorada, que creiem que s'implementarà en un futur proper a les administracions públiques d'arreu del món. Un petit tastet del futur, que ja és possible amb la tecnologia oberta del present.

## 🌟 Funcionalitats
### 🔍 **Identificar quin model d'instància s'ha d'emplenar davant d'una situació concreta**.
L'usuari explica el seu problema amb les seves pròpies paraules via veu. TANIA processa aquesta informació i intel·ligentment tria, d'entre tots els models d'instàncies disponibles, el que s'hauria de fer servir per començar a solucionar el problema.

- **Útil per la ciutadania**: De la forma més ràpida possible, sense prendre accions més enllà d'explicar el teu problema en veu alta, TANIA decideix quina és la instància adequada per a la teva situació. **No fa falta conèixer tots els tràmits administratius i per a què serveix cada un**, TANIA ho fa per tu.

- **Útil pels treballadors públics**: Redueix la feina de triar el model d'instància adequat per a cada cas, que és una tasca que requereix 1) un ampli coneixement de tots els tràmits administratius i 2) la capacitat de selecció de la instància més adequada en base al problema explicat (per això fins ara només ho podien fer treballadors humans). **TANIA allibera aquesta càrrega de feina repetitiva.**
  
### 💬 **Emplenar instàncies a partir d'entrevistes**
 Mitjançant una conversa natural, TANIA completa automàticament els camps necessaris de formularis oficials. Funciona com una entrevista, fent preguntes i anotant el model d'instància en base a les resposets. Té el context suficient per anar emplenant els camps de forma completa, formal i detallada; i sap demanar més informació si cal.

- **Útil per la ciutadania**: No cal llenguatge formal i precís, **TANIA emplena instàncies en base al que li expliquis en veu alta "de tu a tu"**. I segueixes poguent modificar qualsevol camp si cal. Molt més ràpid i fàcil que emplenar tots els camps un a un mitjançant un teclat d'ordinador.

- **Útil pels treballadors públics**: Pot reduir el nombre de consultes presencials que fa la ciutadania davant la frustració de triar/emplenar instàncies, a escala (tantes peticions alhora com facin falta). Més destacablement, **TANIA garanteix que TOTS els camps de les instàncies rebudes contenen els detalls necessaris** per a la seva correcta tramitació (ja que segueix entrevistant fins que així sigui), fet que potencialment **redueix l'emissió "esmenes de requeriments" per demanar més informació** als ciutadans.

#### 🚀 Però la millor forma d'entendre-ho és veient-ho en acció:

# video here


## ❓Per què ja és factible implementar TANIA?

> [!IMPORTANT]
> En poques paraules: és **més barat** que la solució actual, i és **fàcil d'incorporar** opcionalment als sistemes actuals.

### 💶 **Cost-efectivitat**
> El cost d'operar el servei de TANIA és ordres de magnitud més baix que el cost en hores de feina humana per a la mateixa tasca. 

Pels motius expostas anteriorment, TANIA estalvia temps a dues bandes, tant dels ciutadans com dels treballadors de l'administració.

Fent estimacions conservadores, el cost de mantenir TANIA en recursos computacionals reservats (targetes gràfiques per a l'inferència de models d'IA de codi obert) és de menys de 5€ l'hora. Per exemple, a data d'avui el *hosting* a AWS de 3 NVIDIA L4 costen 0,80€ l'hora, cada una fent de *host* del model de text a parla, de parla a text, i de processament de text, respectivament.

Aquests recursos poden gestionar múltiples peticions simultàniament, amb disponibilitat 24/7. Amb optimització de recursos, com per exemple utilitzar les mateixes GPUs per a les TANIA de diferents ajuntaments i administracions (per minimitzar el temps en què aquests recursos no es fan servir), aquest cost quedaria repartit entre totes les agències que la fessin servir (una reducció tranquil·lament d'entre 2x a 10x en el cost per agència/administració).

A més, un mateix nivell de poder computacional s'abarateix dràsticament amb el temps, amb reduccions addicionals d'entre 2x a 10x cada any.

I els nous models d'IA són cada cop més eficients, reduint encara més el cost d'inferència.

Combinant aquestes reduccions de cost, el cost de TANIA per cobrir les necessitats de centenars d'ajuntaments i administracions es pot situar tranquil·lament per sota d'1€ l'hora; amb indicatius de que els costos es tornin negligibles durant la propera dècada. Substituïnt desenes, centenars o milers d'hores equivalents de feina humana.

### 🔗 Interoperativitat

> TANIA està dissenyada per produir com a *output* els mateixos *inputs* que els sistemes actuals esperen.

L’output de TANIA es genera en format de text estructurat, com la informació que ompliria un formulari telemàtic. Aquesta informació es pot enviar directament a les API o sistemes interns que ja utilitza l’administració pública per gestionar els tràmits, sense cap necessitat de modificar els sistemes existents.

TANIA actua com una “capa externa” o interfície addicional, que no força cap modificació del que ja existeix, només afegir una forma alternativa de fer-los servir.

---

## ⚙️ Documentació tècnica
### 🛠️ Arquitectura del sistema

- **Interfície Digital Empàtica**: Dissenyada per ser accessible per a persones de totes les edats.
- **Model de Llicència GNU**: L'aplicació és open source, permetent-ne l'ús gratuït i contribucions de la comunitat.
- **Models d'AinaKit utilitzats**:
  - 🧠✍️ **Text-to-Text**
  - 🗣️ **Text-to-Speech**
  - 🎧 **Speech-to-Text**
  
  Aquests models són part del projecte **AinaKit**, oferint eficiència i suport multilingüe per a representar totes les varietats del català, incloent dialectes i minoritats.

## ⚙️ Funcionament i Orquestració

El sistema s'organitza en diferents etapes:
- **Escolta Activa**: Transcriu les converses de veu a text i analitza profundament el context.
- **Processament Intel·ligent**: Decideix les tasques a realitzar i ofereix respostes adequades.
- **Interfície Humanitzada**: Ofereix una experiència empàtica i natural, superant la simple funció d'interfície de text.


---
## Replicabilitat: Com provar i fer servir TANIA



---

*Aquest prototip s'ha desenvolupat en exactament 24h a l'Aina Hackk 2024, per l'equip "git cat/", conformat per l'Isabel Salazar, l'Àlex Rodríguez i l'Oriol Pont. El projecte està sotmès a una llicència tipus GNU: és propietat de la comunitat oberta, i no permet implementacions de codi tancat basats en ell.*