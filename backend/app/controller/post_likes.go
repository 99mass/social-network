package controller

import (
	"database/sql"
	"errors"
	"time"

	"github.com/gofrs/uuid"

	"backend/app/models"
)

// CreatePostLike crée un nouveau like pour un post.
func CreatePostLike(db *sql.DB, like models.PostLikes) error {

	query := `
		INSERT INTO post_likes (id, user_id, post_id, is_liked, created_at)
		VALUES (?, ?, ?, ?, ?)
	`
	newUUID, err := uuid.NewV4()
	if err != nil {
		return err
	}

	_, err = db.Exec(query, newUUID.String(), like.UserID, like.PostID, like.IsLiked, time.Now())
	if err != nil {
		return err
	}

	return nil
}

// GetPostLike récupère un like pour un post donné.
func GetPostLike(db *sql.DB, userID, postID string) (models.PostLikes, error) {

	var like models.PostLikes

	query := `
		SELECT * 
		FROM post_likes 
		WHERE user_id = ? AND post_id = ?
	`

	err := db.QueryRow(query, userID, postID).Scan(
		&like.ID,
		&like.UserID,
		&like.PostID,
		&like.IsLiked,
		&like.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return models.PostLikes{}, errors.New("no post_likes found with the provided ID")
		}
		return models.PostLikes{}, err
	}

	return like, nil
}


// DeletePostLike supprime un like pour un post.
func DeletePostLike(db *sql.DB, userID, postID string) error {

	query := `
		DELETE FROM post_likes 
		WHERE user_id = ? AND post_id = ?
	`

	_, err := db.Exec(query, userID, postID)
	if err != nil {
		return err
	}

	return nil
}

// CountPostLikes compte le nombre total de likes pour un post.
func CountPostLikes(db *sql.DB, postID string) (int, error) {
	var count int

	query := `
		SELECT COUNT(*) 
		FROM post_likes 
		WHERE post_id = ?
	`

	err := db.QueryRow(query, postID).Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}

// LikePost ajoute un like pour un post.
func LikePost(db *sql.DB, userID, postID string) error {
	like := models.PostLikes{
		UserID:    userID,
		PostID:    postID,
		IsLiked:   true,
	}

	// Vérifie si l'utilisateur a déjà aimé ce post.
	existingLike, err := GetPostLike(db, userID, postID)
	if err == nil && existingLike.IsLiked {
		return errors.New("user has already liked this post")
	}

	if err := CreatePostLike(db, like); err != nil {
		return err
	}

	return nil
}

// DislikePost supprime le like d'un post.
func DislikePost(db *sql.DB, userID, postID string) error {
	existingLike, err := GetPostLike(db, userID, postID)
	if err != nil {
		return err
	}

	if existingLike.IsLiked {
		// L'utilisateur a déjà aimé ce post, on peut le retirer.
		if err := DeletePostLike(db, userID, postID); err != nil {
			return err
		}
	} else {
		// L'utilisateur n'a pas aimé ce post, rien à faire.
		return errors.New("user has not liked this post")
	}

	return nil
}

// GetPostLikesCount renvoie le nombre total de likes pour un post.
func GetPostLikesCount(db *sql.DB, postID string) (int, error) {

	count, err := CountPostLikes(db, postID)
	if err != nil {
		return 0, err
	}

	return count, nil
}