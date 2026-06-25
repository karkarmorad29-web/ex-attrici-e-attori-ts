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

    } catch (error) {
        if (error instanceof Error) {
            console.error('Errore durante il recupero dei dati richiesti', error)
        } else {
            console.error('Errore sconosciuto', error);
        }
        return null;

    }

}