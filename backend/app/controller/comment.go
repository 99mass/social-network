package controller

import (
	"database/sql"
	"errors"
	"time"

	"github.com/gofrs/uuid"

	"backend/app/models"
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
			&comment.PostID,
			&comment.UserID,
			&comment.Content,
			&comment.ImagePath,
			&comment.CreatedAt,
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

// GetUserByCommentID récupère l'utilisateur associé à un commentaire en utilisant l'ID du commentaire.
func GetUserByCommentID(db *sql.DB, commentID string) (models.User, error) {
	var user models.User

	query := `
		SELECT u.* 
		FROM users u
		JOIN comments c ON u.id = c.user_id
		WHERE c.id = ?
	`

	err := db.QueryRow(query, commentID).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.AvatarPath,
		&user.Nickname,
		&user.AboutMe,
		&user.IsPublic,
		&user.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return models.User{}, errors.New("no user found for the provided comment ID")
		}
		return models.User{}, err
	}

	return user, nil
}

func CountCommentsByPostID(db *sql.DB, postID string) (int, error) {
	var count int
	query := `
        SELECT COUNT(*)
        FROM comments
        WHERE post_id = ?
    `
	err := db.QueryRow(query, postID).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}
