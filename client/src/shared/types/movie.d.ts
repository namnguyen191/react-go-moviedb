export type Movie = {
  description: string;
  id: number;
  mpaa_rating: string;
  rating: number;
  release_date: string;
  runtime: number;
  title: string;
  year: number;
  genres: { [id: number]: string };
};
