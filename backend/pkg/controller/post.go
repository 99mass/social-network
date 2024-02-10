package controller

import (
	"database/sql"
	"errors"
	"time"

	"github.com/gofrs/uuid"

	"backend/pkg/models"
)

func CreatePost(db *sql.DB, post models.Post) (uuid.UUID, error) {
	query := `
        INSERT INTO posts (id, user_id, group_id, content, image_path, privacy, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `
	newUUID, err := uuid.NewV4()
	if err != nil {
		return uuid.UUID{}, err
	}
	_, err = db.Exec(query, newUUID.String(), post.UserID, post.GroupID, post.Content, post.ImagePath, post.Privacy, time.Now())
	if err != nil {
		return uuid.UUID{}, err
	}
	return newUUID, nil
}

func GetPostByID(db *sql.DB, postID string) (models.Post, error) {
	var post models.Post
	query := `
        SELECT *
        FROM posts
        WHERE id = ?
    `
	err := db.QueryRow(query, postID).Scan(&post.ID, &post.UserID, &post.GroupID, &post.Content, &post.ImagePath, &post.Privacy, &post.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return models.Post{}, errors.New("no post found with the provided ID")
		}
		return models.Post{}, err
	}
	return post, nil
}

func UpdatePost(db *sql.DB, post models.Post) error {
	query := `
        UPDATE posts
        SET user_id = ?, group_id = ?, content = ?, image_path = ?, privacy = ?, created_at = ?
        WHERE id = ?;
    `
	_, err := db.Exec(query, post.UserID, post.GroupID, post.Content, post.ImagePath, post.Privacy, post.CreatedAt, post.ID)
	return err
}
