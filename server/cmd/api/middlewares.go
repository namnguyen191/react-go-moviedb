package main

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt"
)

func (app *application) enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "DELETE")

		next.ServeHTTP(w, r)
	})
}

func (app *application) checkToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Authorization")

		authHeader := r.Header.Get("Authorization")
		fmt.Println(r.Header)

		// if authHeader == "" {
		// 	// could set an anoymious user
		// 	// return
		// }

		headerParts := strings.Split(authHeader, " ")

		if len(headerParts) != 2 || headerParts[0] != "Bearer" {
			app.errorJSON(w, errors.New("invalid auth header"))
			return
		}

		tokenString := headerParts[1]

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			return []byte(app.config.jwt.secret), nil
		})

		if err != nil {
			app.errorJSON(w, errors.New(err.Error()))
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			if err = claims.Valid(); err != nil {
				fmt.Println(err)
				app.errorJSON(w, errors.New("token has falsy claim expired"))
				return
			}

			if !claims.VerifyAudience("mydomain.com", true) {
				app.errorJSON(w, errors.New("invalid audience"))
				return
			}

			if !claims.VerifyIssuer("mydomain.com", true) {
				app.errorJSON(w, errors.New("invalid issuer"))
				return
			}

			userID := claims["subject"].(float64)

			fmt.Println(userID)

		} else {
			fmt.Println(err)
			app.errorJSON(w, errors.New("invalid token or unauthorized token"))
			return
		}

		next.ServeHTTP(w, r)
	})
}
