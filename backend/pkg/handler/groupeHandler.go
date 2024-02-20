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
			if group.AvataImage != "" {
				encodedImage, err := helper.EncodeImageToBase64("./pkg/static/avatarImage/" + group.AvataImage)
				if err != nil {
					log.Println("error", "unable to encode avatar image", http.StatusInternalServerError)
					return
				}
				groups[i].AvataImage = encodedImage
			}
		}

		helper.SendResponse(w, groups, http.StatusOK)
	}
}

func GroupsIManageHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
			if group.AvataImage != "" {
				encodedImage, err := helper.EncodeImageToBase64("./pkg/static/avatarImage/" + group.AvataImage)
				if err != nil {
					log.Println("error", "unable to encode avatar image", http.StatusInternalServerError)
				}
				groups[i].AvataImage = encodedImage
			}
		}

		helper.SendResponse(w, groups, http.StatusOK)
	}
}

func GroupsToDiscoverHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
			if group.AvataImage != "" {
				encodedImage, err := helper.EncodeImageToBase64("./pkg/static/avatarImage/" + group.AvataImage)
				if err != nil {
					log.Println("error", "unable to encode avatar image", http.StatusInternalServerError)

				}
				groups[i].AvataImage = encodedImage
			}
		}

		helper.SendResponse(w, groups, http.StatusOK)
	}
}
