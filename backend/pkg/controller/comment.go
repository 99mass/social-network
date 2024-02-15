package controller

import (
	"backend/pkg/models"
	"database/sql"
)

func GetCommentByPostID(db *sql.DB, PostID string) ([]models.Comment, error) {
    // Define the SQL query
    query := `
        SELECT *
        FROM comments
        WHERE post_id = ?;
    `

    // Prepare the statement
    stmt, err := db.Prepare(query)
    if err != nil {
        return nil, err
    }
    defer stmt.Close()

    // Execute the query with the PostID parameter
    rows, err := stmt.Query(PostID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    // Scan the results into a slice of models.Comment
    var comments []models.Comment
    for rows.Next() {
        var comment models.Comment
        err := rows.Scan(&comment.ID, &comment.PostID, &comment.UserID, &comment.Content, &comment.ImagePath, &comment.CreatedAt)
        if err != nil {
            return nil, err
        }
        comments = append(comments, comment)
    }

    // Check for any errors that occurred during iteration
    if err := rows.Err(); err != nil {
        return nil, err
    }

    return comments, nil
}
