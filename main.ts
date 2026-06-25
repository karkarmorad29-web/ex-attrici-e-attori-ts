// milestone 1
type person = {
    readonly id: number,
    readonly name: string,
    birth_year: number,
    death_year?: number,
    biography: string,
    image: string,

}
// milestone 2
const ACTRESS_NATIONALITIES = [
    "American",
    "British",
    "Australian",
    "Israeli-American",
    "South African",
    "French",
    "Indian",
    "Israeli",
    "Spanish",
    "South Korean",
    "Chinese",
] as const;

type ActressNationality = typeof ACTRESS_NATIONALITIES[number];

type Actress = person & {
    most_famous_movies: [string, string, string],
    awards: string,
    nationality: ActressNationality,
}

// milestone 3
function isActress(dati: unknown): dati is Actress {
    return (
        typeof dati === 'object' &&
        dati !== null &&
        "id" in dati &&
        typeof (dati as any).id === 'number' &&
        "name" in dati && typeof (dati as any).name === 'string' &&
        "birth_year" in dati && typeof (dati as any).birth_year === 'number' &&
        (!("death_year" in dati) || typeof (dati as any).death_year === 'number') &&
        "biography" in dati && typeof (dati as any).biography === 'string' &&
        "image" in dati && typeof (dati as any).image === 'string' &&
        "most_famous_movies" in dati &&
        Array.isArray((dati as any).most_famous_movies) &&
        (dati as any).most_famous_movies.length === 3 &&
        (dati as any).most_famous_movies.every((m: unknown) => typeof m === 'string') &&
        "awards" in dati && typeof (dati as any).awards === 'string' &&
        "nationality" in dati && (ACTRESS_NATIONALITIES as readonly string[]).includes((dati as any).nationality)
    )
}

async function getActress(id: number): Promise<Actress | null> {
    try {
        const response = await fetch(`http://localhost:3333${id}`);
        const dati: unknown = await response.json();
        if (!isActress(dati)) {
            throw new Error('Formato dei dati non valido');
        }
        return dati;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Errore durante il recupero dei dati richiesti', error)
        } else {
            console.error('Errore sconosciuto', error);
        }
        return null;

    }

}
//milestone 4
async function getAllActresses(): Promise<Actress[]> {
    try {
        const response = await fetch(`http://localhost:3333/atresses`);
        if (!response.ok) {
            throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
        }
        const dati: unknown = await response.json();
        if (!(dati instanceof Array)) {
            throw new Error('Formato non valido: non è un Array!');
        }
        const attriciValide: Actress[] = dati.filter(isActress);
        return attriciValide;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Errore durante il recupero delle atrici', error)
        } else {
            console.error('Errore sconosciuto', error);
        }
        return [];
    }
}

// milestone 5
async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
    return Promise.all(ids.map(id => getActress(id)));
}

// bonus 1
async function createActress(dati: Omit<Actress, 'id'>): Promise<Actress | null> {
    const nuovaAttrice = { ...dati, id: Math.floor(Math.random() * 1_000_000) };
    try {
        const response = await fetch('http://localhost:3333/actresses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuovaAttrice),
        });
        if (!response.ok) {
            throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
        }
        const risultato: unknown = await response.json();
        if (!isActress(risultato)) {
            throw new Error('Formato dei dati non valido');
        }
        return risultato;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Errore durante la creazione dell\'attrice', error);
        } else {
            console.error('Errore sconosciuto', error);
        }
        return null;
    }
}

async function updateActress(id: number, dati: Partial<Omit<Actress, 'id' | 'name'>>): Promise<Actress | null> {
    try {
        const response = await fetch(`http://localhost:3333/actresses/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dati),
        });
        if (!response.ok) {
            throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
        }
        const risultato: unknown = await response.json();
        if (!isActress(risultato)) {
            throw new Error('Formato dei dati non valido');
        }
        return risultato;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Errore durante l\'aggiornamento dell\'attrice', error);
        } else {
            console.error('Errore sconosciuto', error);
        }
        return null;
    }
}

// bonus 2
const ACTOR_EXTRA_NATIONALITIES = [
    "Scottish",
    "New Zealand",
    "Hong Kong",
    "German",
    "Canadian",
    "Irish",
] as const;

const ACTOR_NATIONALITIES = [...ACTRESS_NATIONALITIES, ...ACTOR_EXTRA_NATIONALITIES] as const;

type ActorNationality = typeof ACTOR_NATIONALITIES[number];

type Actor = person & {
    known_for: [string, string, string],
    awards: [string] | [string, string],
    nationality: ActorNationality,
}

function isActor(dati: unknown): dati is Actor {
    return (
        typeof dati === 'object' &&
        dati !== null &&
        "id" in dati && typeof (dati as any).id === 'number' &&
        "name" in dati && typeof (dati as any).name === 'string' &&
        "birth_year" in dati && typeof (dati as any).birth_year === 'number' &&
        (!("death_year" in dati) || typeof (dati as any).death_year === 'number') &&
        "biography" in dati && typeof (dati as any).biography === 'string' &&
        "image" in dati && typeof (dati as any).image === 'string' &&
        "known_for" in dati &&
        Array.isArray((dati as any).known_for) &&
        (dati as any).known_for.length === 3 &&
        (dati as any).known_for.every((m: unknown) => typeof m === 'string') &&
        "awards" in dati &&
        Array.isArray((dati as any).awards) &&
        ((dati as any).awards.length === 1 || (dati as any).awards.length === 2) &&
        (dati as any).awards.every((a: unknown) => typeof a === 'string') &&
        "nationality" in dati && (ACTOR_NATIONALITIES as readonly string[]).includes((dati as any).nationality)
    );
}

async function getActor(id: number): Promise<Actor | null> {
    try {
        const response = await fetch(`http://localhost:3333/actors/${id}`);
        if (!response.ok) {
            throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
        }
        const dati: unknown = await response.json();
        if (!isActor(dati)) {
            throw new Error('Formato dei dati non valido');
        }
        return dati;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Errore durante il recupero dell\'attore', error);
        } else {
            console.error('Errore sconosciuto', error);
        }
        return null;
    }
}

async function getAllActors(): Promise<Actor[]> {
    try {
        const response = await fetch('http://localhost:3333/actors');
        if (!response.ok) {
            throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
        }
        const dati: unknown = await response.json();
        if (!(dati instanceof Array)) {
            throw new Error('Formato non valido: non è un Array!');
        }
        return dati.filter(isActor);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Errore durante il recupero degli attori', error);
        } else {
            console.error('Errore sconosciuto', error);
        }
        return [];
    }
}

async function getActors(ids: number[]): Promise<(Actor | null)[]> {
    return Promise.all(ids.map(id => getActor(id)));
}

async function createActor(dati: Omit<Actor, 'id'>): Promise<Actor | null> {
    const nuovoAttore = { ...dati, id: Math.floor(Math.random() * 1_000_000) };
    try {
        const response = await fetch('http://localhost:3333/actors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuovoAttore),
        });
        if (!response.ok) {
            throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
        }
        const risultato: unknown = await response.json();
        if (!isActor(risultato)) {
            throw new Error('Formato dei dati non valido');
        }
        return risultato;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Errore durante la creazione dell\'attore', error);
        } else {
            console.error('Errore sconosciuto', error);
        }
        return null;
    }
}

async function updateActor(id: number, dati: Partial<Omit<Actor, 'id' | 'name'>>): Promise<Actor | null> {
    try {
        const response = await fetch(`http://localhost:3333/actors/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dati),
        });
        if (!response.ok) {
            throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
        }
        const risultato: unknown = await response.json();
        if (!isActor(risultato)) {
            throw new Error('Formato dei dati non valido');
        }
        return risultato;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Errore durante l\'aggiornamento dell\'attore', error);
        } else {
            console.error('Errore sconosciuto', error);
        }
        return null;
    }
}

// bonus 3
async function createRandomCouple(): Promise<[Actress, Actor]> {
    const [attrici, attori] = await Promise.all([getAllActresses(), getAllActors()]);

    if (attrici.length === 0 || attori.length === 0) {
        throw new Error('Lista attrici o attori vuota');
    }

    const attrice = attrici[Math.floor(Math.random() * attrici.length)];
    const attore = attori[Math.floor(Math.random() * attori.length)];

    return [attrice, attore];
}