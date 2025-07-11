package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	http.HandleFunc("/x", func(w http.ResponseWriter, r *http.Request) {
		resp, err := http.Get("http://localhost:3001/y")
		if err != nil {
			http.Error(w, "Error calling service Y", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()
		body, _ := io.ReadAll(resp.Body)
		fmt.Fprintf(w, "Service X received: %s", body)
	})

	fmt.Println("Service X listening on port 3000")
	http.ListenAndServe(":3000", nil)
}
