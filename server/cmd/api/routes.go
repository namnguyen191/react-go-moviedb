package main

import (
	"context"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

func (app *application) wrap(next http.Handler) httprouter.Handle {
	return func(rw http.ResponseWriter, r *http.Request, p httprouter.Params) {
		ctx := context.WithValue(r.Context(), httprouter.ParamsKey, p)

		next.ServeHTTP(rw, r.WithContext(ctx))
	}
}

func (app *application) routes() http.Handler {
	router := httprouter.New()

	secure := alice.New(app.checkToken)

	// Graphql
	router.HandlerFunc(http.MethodPost, "/v1/graphql", app.moviesGraphQL)

	router.HandlerFunc(http.MethodGet, "/status", app.statusHandler)

	router.HandlerFunc(http.MethodPost, "/v1/signin", app.signIn)

	router.HandlerFunc(http.MethodGet, "/v1/movie/:id", app.getOneMovie)
	router.HandlerFunc(http.MethodGet, "/v1/movies", app.getAllMovies)
	router.HandlerFunc(http.MethodGet, "/v1/genres", app.getAllGenres)
	router.HandlerFunc(http.MethodGet, "/v1/movies/:genre_id", app.getAllMoviesByGenre)

	router.POST("/v1/admin/editmovie", app.wrap(secure.ThenFunc(app.editMovie)))
	// router.HandlerFunc(http.MethodPost, "/v1/admin/editmovie", app.editMovie)
	// router.HandlerFunc(http.MethodDelete, "/v1/admin/deletemovie/:id", app.deleteMovie)
	router.DELETE("/v1/admin/deletemovie/:id", app.wrap(secure.ThenFunc(app.deleteMovie)))

	return app.enableCORS(router)
}
