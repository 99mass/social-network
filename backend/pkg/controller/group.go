package controller

import (
	"database/sql"
	"errors"
	"log"
	"time"

	"github.com/gofrs/uuid"

	"backend/pkg/models"
)

func CreateGroup(db *sql.DB, group models.Group) (uuid.UUID, error) {
	query := `
        INSERT INTO groups (id, title, description, creator_id, avatarpath, created_at)
        VALUES (?, ?, ?, ?, ?, ?);
    `
	newUUID, err := uuid.NewV4()
	if err != nil {
		return uuid.UUID{}, err
	}
	_, err = db.Exec(query, newUUID.String(), group.Title, group.Description, group.CreatorID, group.AvatarPath, time.Now())
	if err != nil {
		return uuid.UUID{}, err
	}
	return newUUID, nil
}

func GetGrpByID(db *sql.DB, groupID string) (models.Group, error) {
	query := `
		SELECT *
		FROM groups
		WHERE id = ?
	`
	var group models.Group
	err := db.QueryRow(query, groupID).Scan(&group.ID, &group.Title, &group.Description, &group.CreatorID, &group.AvatarPath, &group.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			// No group found with the given ID
			return models.Group{}, errors.New("group not found")
		}
		return models.Group{}, err
	}
	return group, nil
}

func GetGroupByID(db *sql.DB, groupID string) (bool, error) {
	query := `
		SELECT COUNT(*)
		FROM groups
		WHERE id = ?
	`
	var count int
	err := db.QueryRow(query, groupID).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func IsMember(db *sql.DB, userID, groupID string) (bool, error) {
	query := `
        SELECT COUNT(*)
        FROM group_members
        WHERE user_id = ? AND group_id = ?
    `
	var count int
	err := db.QueryRow(query, userID, groupID).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func GetMyGroups(db *sql.DB, userID string) ([]models.GroupInfos, error) {
	// SQL query to get all groups a user is a member of
	query := `
        SELECT g.id, g.title, g.avatarpath, COUNT(m.user_id) as nbr_members
        FROM groups g
        INNER JOIN group_members m ON g.id = m.group_id
        WHERE m.user_id = ?
        GROUP BY g.id
    `

	// Prepare the statement
	stmt, err := db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	// Execute the query
	rows, err := stmt.Query(userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Scan the results into a slice of GroupInfos
	var groups []models.GroupInfos
	for rows.Next() {
		var group models.GroupInfos
		err := rows.Scan(&group.ID, &group.Title, &group.AvatarPath, &group.NbrMembers)
		if err != nil {
			return nil, err
		}
		log.Println("group:", group.NbrMembers)
		groups = append(groups, group)
	}

	// Check for errors from iterating over rows.
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return groups, nil
}

func GroupsIManage(db *sql.DB, userID string) ([]models.GroupInfos, error) {
	// SQL query to get all groups a user manages
	query := `
        SELECT g.id, g.title, g.avatarpath, COUNT(m.user_id) as nbr_members
        FROM groups g
        LEFT JOIN group_members m ON g.id = m.group_id
        WHERE g.creator_id = ?
        GROUP BY g.id
    `

	// Prepare the statement
	stmt, err := db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	// Execute the query
	rows, err := stmt.Query(userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Scan the results into a slice of GroupInfos
	var groups []models.GroupInfos
	for rows.Next() {
		var group models.GroupInfos
		err := rows.Scan(&group.ID, &group.Title, &group.AvatarPath, &group.NbrMembers)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	// Check for errors from iterating over rows.
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return groups, nil
}

func GroupsToDiscover(db *sql.DB, userID string) ([]models.GroupInfos, error) {
	// SQL query to get all groups that a user is not a member of and has not received an invitation
	query := `
        SELECT g.id, g.creator_id, g.title, g.avatarpath, COUNT(m.user_id) as nbr_members
        FROM groups g
        LEFT JOIN group_members m ON g.id = m.group_id AND m.user_id = ?
        LEFT JOIN group_invitations gi ON g.id = gi.group_id AND gi.user_id = ? AND gi.status = 'waiting'
        WHERE m.user_id IS NULL AND gi.group_id IS NULL
        GROUP BY g.id
    `

	// Prepare the statement
	stmt, err := db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	// Execute the query
	rows, err := stmt.Query(userID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Scan the results into a slice of GroupInfos
	var groups []models.GroupInfos
	for rows.Next() {
		var group models.GroupInfos
		err := rows.Scan(&group.ID, &group.CreatorID, &group.Title, &group.AvatarPath, &group.NbrMembers)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	// Check for errors from iterating over rows.
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return groups, nil
}

func GetNonGroupFollowers(db *sql.DB, userID uuid.UUID, groupId string) ([]models.UsersNoInGroup, error) {
	friends, err := GetMyFriends(db, userID)
	if err != nil {
		return nil, err
	}

	unfollowuser := []models.UsersNoInGroup{}

	for _, user := range friends {

		isInvitationSend, errr := IsInvitationSend(db, groupId, user.ID)
		ismember, err := IsMember(db, user.ID, groupId)
		isJoinRequestSend, err1 := IsJoinRequestSend(db, user.ID, groupId)
		if err != nil || errr != nil || err1 != nil {
			return nil, err
		}

		if !isInvitationSend && !ismember && !isJoinRequestSend {
			_userNot := models.UsersNoInGroup{User: user, IsInvited: false, IsUserSenderInvitation: false}
			unfollowuser = append(unfollowuser, _userNot)
		} else if isInvitationSend {
			isUserSenderInvitation, _ := IsSenderInvitationGroup(db, userID.String(), user.ID, groupId)

			_userNot := models.UsersNoInGroup{User: user, IsInvited: true, IsUserSenderInvitation: isUserSenderInvitation}
			unfollowuser = append(unfollowuser, _userNot)
		}
	}
	return unfollowuser, nil
}

func GetGroupInfosById(db *sql.DB, userID, groupID uuid.UUID) (models.GroupInfos, error) {
	// SQL query to get group information by ID
	query := `
		SELECT g.id, g.title, g.avatarpath, g.description, COUNT(m.user_id) as nbr_members
		FROM groups g
		LEFT JOIN group_members m ON g.id = m.group_id
		WHERE g.id = ?
		GROUP BY g.id
	`

	// Prepare the statement
	stmt, err := db.Prepare(query)
	if err != nil {
		return models.GroupInfos{}, err
	}
	defer stmt.Close()

	// Execute the query
	rows, err := stmt.Query(groupID)
	if err != nil {
		return models.GroupInfos{}, err
	}
	defer rows.Close()

	var group models.GroupInfos
	for rows.Next() {

		err := rows.Scan(&group.ID, &group.Title, &group.AvatarPath, &group.Description, &group.NbrMembers)
		if err != nil {
			return models.GroupInfos{}, err
		}

	}
	ismember, errs := IsMember(db, userID.String(), group.ID)
	if errs != nil {
		return models.GroupInfos{}, errs
	}
	group.IsMembers = ismember

	// Check for errors from iterating over rows.
	if err := rows.Err(); err != nil {
		return models.GroupInfos{}, err
	}

	return group, nil
}

func IsInvitationSend(db *sql.DB, groupId string, userId string) (bool, error) {
	invitationSend, err := GetGroupsInvitationsSend(db, groupId)

	if err != nil {
		return false, err
	}

	for _, invit := range invitationSend {
		if invit.UserID == userId {
			return true, nil
		}
	}
	return false, nil
}

func GetPostsGroup(db *sql.DB, groupId string) ([]models.Post, error) {
	query := `
        SELECT *
        FROM posts
        WHERE group_id = ?
    `
	rows, err := db.Query(query, groupId)
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

func IsSenderInvitationGroup(db *sql.DB, senderID, userId, groupId string) (bool, error) {
	query := `
        SELECT COUNT(*)
        FROM group_invitations
        WHERE sender_id = ? AND user_id = ? AND group_id = ?
    `
	var count int
	err := db.QueryRow(query, senderID, userId, groupId).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// GetCreatorByGroupID retrieves the creator ID of a group by its group ID.
func GetCreatorByGroupID(db *sql.DB, groupID string) (string, error) {
	query := `
		SELECT creator_id
		FROM groups
		WHERE id = ?;
	`

	// Execute the query and retrieve the result.
	var creatorID string
	err := db.QueryRow(query, groupID).Scan(&creatorID)
	if err != nil {
		return "", err
	}

	return creatorID, nil
}

func GetGroupTitle(db *sql.DB, groupID string) (string, error) {
	// Prepare the SQL query to get the group title for a specific group ID.
	query := `
		SELECT title
		FROM groups
		WHERE id = ?;
	`

	// Execute the query and retrieve the result.
	var title string
	err := db.QueryRow(query, groupID).Scan(&title)
	if err != nil {
		return "", err
	}

	return title, nil
}

func IsUserGroupCreator(db *sql.DB, userID string, groupID string) (bool, error) {

	creatorID, err := GetCreatorByGroupID(db, groupID)

	if err != nil {
		return false, err
	}

	return userID == creatorID, nil
}

func GetGroupNameByIdPost(db *sql.DB, groupID string) (string, string, error) {
	query := `
        SELECT title, avatarpath
        FROM groups
        WHERE id = ?
    `
	var title string
	var avatarpath string
	err := db.QueryRow(query, groupID).Scan(&title, &avatarpath)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Println("group not found")
			return "", "", nil
		}
		return "", "", err
	}
	return title, avatarpath, nil
}
