package controller

import (
	"database/sql"
	"errors"

	"backend/pkg/models"
)

// AddParticipant ajoute un participant à un événement.
func CreateParticipantStatus(db *sql.DB, participant models.EventParticipants) error {
	query := `
		INSERT INTO event_participants (event_id, user_id, chosen_option) 
		VALUES (?, ?, ?)
	`
	_, err := db.Exec(query, participant.EventID, participant.UserID, participant.Option)
	return err
}

// GetParticipantsByEventID récupère tous les participants d'un événement spécifique.
func GetParticipantsByEventID(db *sql.DB, eventID string) ([]models.EventParticipants, error) {
	query := `
		SELECT * 
		FROM event_participants 
		WHERE event_id = ?
	`
	rows, err := db.Query(query, eventID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var participants []models.EventParticipants
	for rows.Next() {
		var participant models.EventParticipants
		err := rows.Scan(&participant.EventID, &participant.UserID, &participant.Option)
		if err != nil {
			return nil, err
		}
		participants = append(participants, participant)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return participants, nil
}

// RemoveParticipant supprime un participant d'un événement.
func RemoveParticipant(db *sql.DB, eventID, userID string) error {
	query := `
		DELETE FROM event_participants 
		WHERE event_id = ? AND user_id = ?
	`
	_, err := db.Exec(query, eventID, userID)
	return err
}

// GetParticipantStatus récupère le statut de participation d'un utilisateur pour un événement spécifique.
func GetParticipantStatus(db *sql.DB, eventID, userID string) (int, error) {
	query := `
		SELECT chosen_option FROM event_participants 
		WHERE event_id = ? AND user_id = ?
	`
	var option int
	err := db.QueryRow(query, eventID, userID).Scan(&option)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 2, nil // Retourne  0 si l'utilisateur n'est pas participant
		}
		return 2, err
	}
	return option, nil
}

// UpdateParticipantStatus met à jour le statut de participation d'un utilisateur pour un événement spécifique.
func UpdateParticipantStatus(db *sql.DB, eventID, userID string, option int) error {
	query :=`
		UPDATE event_participants 
		SET chosen_option= ? 
		WHERE event_id = ? AND user_id = ?
	`
	_, err := db.Exec(query, option, eventID, userID)
	return err
}

// GetParticipantsCountAndDetailsByEventID récupère le nombre de participants pour chaque option et les détails des participants.
func GetParticipantsCountAndDetailsByEventID(db *sql.DB, eventID string) (map[int]struct{Count int; Participants []models.EventParticipants}, error)  {
	query := `
		SELECT chosen_option, 
		COUNT(*) as count 
		FROM event_participants 
		WHERE event_id = ? GROUP BY chosen_option
	`
	// Requête pour compter les participants par option
	rows, err := db.Query(query, eventID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Map pour stocker le nombre de participants par option
	optionCounts := make(map[int]int)
	for rows.Next() {
		var option int
		var count int
		err := rows.Scan(&option, &count)
		if err != nil {
			return nil, err
		}
		optionCounts[option] = count
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	// Map pour stocker les participants et le nombre de participants par option
	optionParticipants := make(map[int]struct{Count int; Participants []models.EventParticipants})
	for option, count := range optionCounts {
		participants, err := getParticipantsByOption(db, eventID, option)
		if err != nil {
			return nil, err
		}
		optionParticipants[option] = struct{Count int; Participants []models.EventParticipants}{Count: count, Participants: participants}
	}

	return optionParticipants, nil
}

// getParticipantsByOption récupère les participants d'un événement spécifique pour une option spécifique.
func getParticipantsByOption(db *sql.DB, eventID string, option int) ([]models.EventParticipants, error) {
	query := `
		SELECT * 
		FROM event_participants 
		WHERE event_id = ? AND chosen_option= ?
	`
	rows, err := db.Query(query, eventID, option)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var participants []models.EventParticipants
	for rows.Next() {
		var participant models.EventParticipants
		err := rows.Scan(&participant.EventID, &participant.UserID, &participant.Option)
		if err != nil {
			return nil, err
		}
		participants = append(participants, participant)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return participants, nil
}
