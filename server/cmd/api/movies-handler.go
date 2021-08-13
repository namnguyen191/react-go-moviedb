package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"server/models"
	"strconv"
	"time"

	"github.com/julienschmidt/httprouter"
)

func (app *application) getOneMovie(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))

	if err != nil {
		app.logger.Println(errors.New("invalid id parameter"))
		app.errorJSON(w, err)
		return
	}

	movie, err := app.models.DB.Get(id)

	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, movie, "movie")

	if err != nil {
		app.errorJSON(w, err)
	}
}

func (app *application) getAllMovies(w http.ResponseWriter, r *http.Request) {
	movies, err := app.models.DB.All()

	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, movies, "movies")

	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

func (app *application) getAllGenres(w http.ResponseWriter, r *http.Request) {
	genres, err := app.models.DB.GenresAll()

	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, genres, "genres")

	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

func (app *application) getAllMoviesByGenre(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	genreID, err := strconv.Atoi(params.ByName("genre_id"))
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	movies, err := app.models.DB.All(genreID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, movies, "movies")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

func (app *application) deleteMovie(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.models.DB.DeleteMovie(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.writeJSON(w, http.StatusNoContent, nil, "response")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

func (app *application) editMovie(w http.ResponseWriter, r *http.Request) {
	var movie models.Movie

	err := json.NewDecoder(r.Body).Decode(&movie)
	if err != nil {
		fmt.Println(err)
		app.errorJSON(w, err)
		return
	}

	movie.UpdatedAt = time.Now()

	if movie.ID == 0 {
		movie.CreatedAt = time.Now()
		err = app.models.DB.InsertMovie(movie)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
		err = app.writeJSON(w, http.StatusCreated, nil, "response")
	} else {
		existingMovie, _ := app.models.DB.Get(movie.ID)
		movie.CreatedAt = existingMovie.CreatedAt
		movie.MovieGenre = existingMovie.MovieGenre
		movie.Year = existingMovie.Year
		err = app.models.DB.UpdateMovie(movie)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
		err = app.writeJSON(w, http.StatusNoContent, nil, "response")
	}

	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

// func (app *application) searchMovies(w http.ResponseWriter, r *http.Request) {

// }
