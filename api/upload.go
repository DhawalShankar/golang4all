// /api/upload — admin-token gated, streams images to Cloudinary
// (PRD §2.2, §6 decisions log).
package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type UploadResponse struct {
	URL string `json:"url"`
}

func UploadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	if r.Header.Get("X-Admin-Auth") != os.Getenv("ADMIN_AUTH_TOKEN") {
		writeErr(w, http.StatusUnauthorized, "Unauthorized access")
		return
	}

	// 5MB cap to stay safely inside serverless memory limits.
	if err := r.ParseMultipartForm(5 << 20); err != nil {
		writeErr(w, http.StatusBadRequest, "file too large or invalid form")
		return
	}
	file, _, err := r.FormFile("image")
	if err != nil {
		writeErr(w, http.StatusBadRequest, "missing 'image' field")
		return
	}
	defer file.Close()

	cld, err := cloudinary.NewFromParams(
		os.Getenv("CLOUDINARY_CLOUD_NAME"),
		os.Getenv("CLOUDINARY_API_KEY"),
		os.Getenv("CLOUDINARY_API_SECRET"),
	)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "storage client init failed")
		return
	}

	result, err := cld.Upload.Upload(context.Background(), file, uploader.UploadParams{
		Folder: "golangforall-posts",
	})
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "upload to storage failed")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(UploadResponse{URL: result.SecureURL})
}

func writeErr(w http.ResponseWriter, code int, msg string) {
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}
