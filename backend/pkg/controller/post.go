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

func PostToShow(db *sql.DB, userID string) ([]models.Post, error) {
	// Define the SQL query
	query := `
        SELECT DISTINCT p.*
        FROM posts p
        LEFT JOIN followers f ON p.user_id = f.following_id AND f.follower_id = ?
        LEFT JOIN almost_users au ON p.id = au.post_id AND au.authorize_users = ? 
		LEFT JOIN group_members gm ON p.group_id = gm.group_id AND gm.user_id = ?
        WHERE (
			p.user_id = ? OR
            p.privacy = 'public' OR
            (p.privacy = 'private' AND (f.follower_id IS NOT NULL OR f.following_id IS NOT NULL)) OR
            (p.privacy = 'almost' AND au.user_id IS NOT NULL)
        ) ORDER BY p.created_at DESC;
    `

	// Prepare the statement
	stmt, err := db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	// Execute the query with the userID parameter
	rows, err := stmt.Query(userID, userID, userID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Scan the results into a slice of models.Post
	var posts []models.Post
	for rows.Next() {
		var post models.Post
		err := rows.Scan(&post.ID, &post.UserID, &post.GroupID, &post.Content, &post.ImagePath, &post.Privacy, &post.CreatedAt)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	// Check for any errors that occurred during iteration
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func GetPostsByUserID(db *sql.DB, userID string) ([]models.Post, error) {
	query := `
		SELECT *
		FROM posts
		WHERE user_id = ?
	`

	rows, err := db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var post models.Post
		err := rows.Scan(&post.ID, &post.UserID, &post.GroupID, &post.Content, &post.ImagePath, &post.Privacy, &post.CreatedAt)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

// IsPostLikedByUser vérifie si un post est aimé par un utilisateur.
func IsPostLikedByUser(db *sql.DB, userID, postID string) (bool, error) {
	query := `
		SELECT COUNT(*) 
		FROM post_likes 
		WHERE user_id = ? AND post_id = ? AND is_liked = true
	`

	var count int
	err := db.QueryRow(query, userID, postID).Scan(&count)
	if err != nil {
		if err == sql.ErrNoRows {
			// Aucun like trouvé
			return false, nil
		}
		return false, err
	}

	return count > 0, nil
}

func GetGroupPosts(db *sql.DB, userID, groupID string) ([]models.Post, error) {
    // SQL query to get all posts for a specific group if the user is a member
    query := `
        SELECT p.*
        FROM posts p
        INNER JOIN group_members gm ON p.group_id = gm.group_id
        WHERE p.group_id = ? AND gm.user_id = ?
    `

    // Prepare the statement
    stmt, err := db.Prepare(query)
    if err != nil {
        return nil, err
    }
    defer stmt.Close()

    // Execute the query
    rows, err := stmt.Query(groupID, userID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    // Scan the results into a slice of Posts
    var posts []models.Post
    for rows.Next() {
        var post models.Post
        err := rows.Scan(&post.ID, &post.UserID, &post.GroupID, &post.Content, &post.ImagePath, &post.Privacy, &post.CreatedAt)
        if err != nil {
            return nil, err
        }
        posts = append(posts, post)
    }

    // Check for errors from iterating over rows.
    if err := rows.Err(); err != nil {
        return nil, err
    }

    return posts, nil
}
