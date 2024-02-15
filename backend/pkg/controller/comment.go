package controller

import (
	"database/sql"
	"errors"
	"time"

	"github.com/gofrs/uuid"

	"backend/pkg/models"
)

func CreateComment(db *sql.DB, comment models.Comment) (uuid.UUID, error) {
	query := `
        INSERT INTO comments (id, user_id, post_id, content, image_path, created_at)
        VALUES (?, ?, ?, ?, ?, ?);
    `
	newUUID, err := uuid.NewV4()
	if err != nil {
		return uuid.UUID{}, err
	}
	_, err = db.Exec(query, newUUID.String(), comment.UserID, comment.PostID, comment.Content, comment.ImagePath, time.Now())
	if err != nil {
		return uuid.UUID{}, err
	}
	return newUUID, nil
}

func GetCommentByID(db *sql.DB, commentID string) (models.Comment, error) {
	var comment models.Comment
	query := `
        SELECT *
        FROM comments
        WHERE id = ?
    `
	err := db.QueryRow(query, commentID).Scan(&comment.ID, &comment.UserID, &comment.PostID, &comment.Content, &comment.ImagePath, &comment.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return models.Comment{}, errors.New("no comment found with the provided ID")
		}
		return models.Comment{}, err
	}
	return comment, nil
}

func GetCommentsByPostID(db *sql.DB, postID string) ([]models.Comment, error) {
	var comments []models.Comment

	query := `
		SELECT * 
		FROM comments 
		WHERE post_id = ?
	`

	rows, err := db.Query(query, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var comment models.Comment
		err := rows.Scan(
			&comment.ID,
			&comment.UserID,
			&comment.PostID,
			&comment.Content,
			&comment.CreatedAt,
			&comment.ImagePath,
		)
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return comments, nil
}

