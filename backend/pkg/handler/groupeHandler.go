package handler

import (
	"database/sql"
	"log"
	"net/http"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/utils"
)

func GetMyGroupsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			groups, err := controller.GetMyGroups(db, sess.UserID.String())
			if err != nil {
				helper.SendResponseError(w, "error", "can't load groups", http.StatusInternalServerError)
				return
			}

			// Encode avatar images
			for i, group := range groups {
				if group.AvatarPath != "" {
					encodedImage, err := helper.EncodeImageToBase64("./pkg/static/avatarImage/" + group.AvatarPath)
					if err != nil {
						log.Println("error", "unable to encode avatar image", http.StatusInternalServerError)
					}
					groups[i].AvatarPath = encodedImage
				}
			}

			helper.SendResponse(w, groups, http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "method not allowed", http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}

func GroupsIManageHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			groups, err := controller.GroupsIManage(db, sess.UserID.String())
			if err != nil {
				helper.SendResponseError(w, "error", "can't load groups", http.StatusInternalServerError)
				return
			}

			// Encode avatar images
			for i, group := range groups {
				if group.AvatarPath != "" {
					encodedImage, err := helper.EncodeImageToBase64("./pkg/static/avatarImage/" + group.AvatarPath)
					if err != nil {
						log.Println("error", "unable to encode avatar image", http.StatusInternalServerError)
					}
					groups[i].AvatarPath = encodedImage
				}
			}

			helper.SendResponse(w, groups, http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "method not allowed", http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}

func GroupsToDiscoverHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			groups, err := controller.GroupsToDiscover(db, sess.UserID.String())
			if err != nil {
				helper.SendResponseError(w, "error", "can't load groups", http.StatusInternalServerError)
				return
			}

			// Encode avatar images
			for i, group := range groups {
				if group.AvatarPath != "" {
					encodedImage, err := helper.EncodeImageToBase64("./pkg/static/avatarImage/" + group.AvatarPath)
					if err != nil {
						log.Println("error", "unable to encode avatar image", http.StatusInternalServerError)
					}
					groups[i].AvatarPath = encodedImage
				}
				nbrMember, err := controller.CountGroupMembers(db, group.ID)
				if err != nil {
					helper.SendResponseError(w, "errro", "can't count members", http.StatusInternalServerError)
					return
				}
				groups[i].NbrMembers = nbrMember
			}

			helper.SendResponse(w, groups, http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "method not allowed", http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
