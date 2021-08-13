package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"server/models"
	"time"

	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

var validUser = models.User{
	ID:       10,
	Email:    "test@email.test",
	Password: "$2a$12$XCJRqR1XGaTVeC.K8l3hIeiME.jJB7O0gx995RRVA5OXXEu34Jkwm",
}

type Credentials struct {
	Username string `json:"user_name"`
	Password string `json:"password"`
}

func (app *application) signIn(w http.ResponseWriter, r *http.Request) {
	var creds Credentials

	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		app.errorJSON(w, errors.New("unauthorized"))
		return
	}

	hashedPassword := validUser.Password

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(creds.Password))
	if err != nil {
		app.errorJSON(w, errors.New("unauthorized"))
		return
	}

	claims := jwt.MapClaims{
		"subject":   validUser.ID,
		"issued":    time.Now().UTC().Unix(),
		"notBefore": time.Now().UTC().Unix(),
		"exp":       time.Now().UTC().Add(24 * time.Hour).Unix(),
		"iss":       "mydomain.com",
		"aud":       []string{"mydomain.com"},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(app.config.jwt.secret))
	if err != nil {
		fmt.Println(err)
		app.errorJSON(w, errors.New("error signing jwt"))
		return
	}

	app.writeJSON(w, http.StatusOK, tokenString, "response")
}
