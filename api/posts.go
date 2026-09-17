// /api/posts — GET is public, POST/PUT/DELETE require the admin token
// (PRD §3.2, §6 decisions log).
package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"golangforall.in/pkg/db"
)

type BlogPost struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Slug      string    `json:"slug"`
	Content   string    `json:"content"`
	Section   string    `json:"section"`
	ImageURL  string    `json:"imageUrl"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if err := db.Init(r.Context()); err != nil {
		writeErr(w, http.StatusInternalServerError, "db init failed")
		return
	}

	if r.Method != http.MethodGet && r.Header.Get("X-Admin-Auth") != os.Getenv("ADMIN_AUTH_TOKEN") {
		writeErr(w, http.StatusUnauthorized, "Unauthorized access")
		return
	}

	switch r.Method {
	case http.MethodGet:
		handleGetPosts(w, r)
	case http.MethodPost:
		handleCreatePost(w, r)
	case http.MethodPut:
		handleUpdatePost(w, r)
	case http.MethodDelete:
		handleDeletePost(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func handleGetPosts(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Pool.Query(r.Context(),
		`SELECT id, title, slug, content, section, image_url, created_at, updated_at
		 FROM posts WHERE published = true ORDER BY created_at DESC`)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "query failed")
		return
	}
	defer rows.Close()

	var posts []BlogPost
	for rows.Next() {
		var p BlogPost
		if err := rows.Scan(&p.ID, &p.Title, &p.Slug, &p.Content, &p.Section, &p.ImageURL, &p.CreatedAt, &p.UpdatedAt); err != nil {
			writeErr(w, http.StatusInternalServerError, "row scan failed")
			return
		}
		posts = append(posts, p)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(posts)
}

func handleCreatePost(w http.ResponseWriter, r *http.Request) {
	var post BlogPost
	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid body")
		return
	}
	if post.Title == "" || post.Slug == "" || post.Content == "" || post.Section == "" {
		writeErr(w, http.StatusBadRequest, "title, slug, content, section are required")
		return
	}
	post.CreatedAt = time.Now()
	post.UpdatedAt = post.CreatedAt

	err := db.Pool.QueryRow(r.Context(),
		`INSERT INTO posts (title, slug, content, section, image_url, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
		post.Title, post.Slug, post.Content, post.Section, post.ImageURL, post.CreatedAt, post.UpdatedAt,
	).Scan(&post.ID)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "insert failed (slug may already exist)")
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(post)
}

func handleUpdatePost(w http.ResponseWriter, r *http.Request) {
	var post BlogPost
	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid body")
		return
	}
	if post.ID == "" {
		writeErr(w, http.StatusBadRequest, "id is required")
		return
	}
	post.UpdatedAt = time.Now()

	tag, err := db.Pool.Exec(r.Context(),
		`UPDATE posts SET title=$1, content=$2, section=$3, image_url=$4, updated_at=$5
		 WHERE id=$6`,
		post.Title, post.Content, post.Section, post.ImageURL, post.UpdatedAt, post.ID,
	)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "update failed")
		return
	}
	if tag.RowsAffected() == 0 {
		writeErr(w, http.StatusNotFound, "post not found")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(post)
}

func handleDeletePost(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		writeErr(w, http.StatusBadRequest, "id query param is required")
		return
	}

	tag, err := db.Pool.Exec(r.Context(), `DELETE FROM posts WHERE id=$1`, id)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "delete failed")
		return
	}
	if tag.RowsAffected() == 0 {
		writeErr(w, http.StatusNotFound, "post not found")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted", "id": id})
}

func writeErr(w http.ResponseWriter, code int, msg string) {
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}
