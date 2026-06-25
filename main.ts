// milestone 1
type person = {
    readonly id: number,
    readonly name: string,
    birth_year: number,
    death_year?: number,
    biography: string,
    image: string,

}

type ActressNationality =
    | "American"
    | "British"
    | "Australian"
    | "Israeli-American"
    | "South African"
    | "French"
    | "Indian"
    | "Israeli"
    | "Spanish"
    | "South Korean"
    | "Chinese"

type Actress = person & {
    most_famous_movies: [string, string, string],
    awards: string,
    nationality: ActressNationality,
}