package routes

import (
	"database/sql"
	"net/http"

	"backend/pkg/handler"
	"backend/pkg/helper"
)

func Route(db *sql.DB) {
	//User Actions
	http.HandleFunc("/register", helper.Middleware(handler.RegisterHandler(db)))
	http.HandleFunc("/login", helper.Middleware(handler.LoginHandler(db)))
	http.HandleFunc("/logout", helper.Middleware(handler.LogOutHandler(db)))
	http.HandleFunc("/update_profil", helper.Middleware(handler.UpdateProfil(db)))
	http.HandleFunc("/followuser", helper.Middleware(handler.FollowUser(db)))
	http.HandleFunc("/unfollowuser", helper.Middleware(handler.UnfollowUser(db))) // unfollow user
	http.HandleFunc("/addpost", helper.Middleware(handler.AddPostHandler(db)))
	http.HandleFunc("/create_group", helper.Middleware(handler.AddGroupHandler(db)))
	http.HandleFunc("/addcomment", helper.Middleware(handler.AddCommentHandler(db)))
	http.HandleFunc("/show_comments_post", helper.Middleware(handler.ShowCommentsByPost(db)))
	http.HandleFunc("/likepost", helper.Middleware(handler.LikePostHandler(db)))
	http.HandleFunc("/countpostliked", helper.Middleware(handler.GetPostLikesCountHandler(db)))

	// Display Request
	http.HandleFunc("/session", helper.Middleware(handler.CheckSessionHandler(db)))
	http.HandleFunc("/user", helper.Middleware(handler.ConnectedUser(db)))
	http.HandleFunc("/profil", helper.Middleware(handler.ProfilHandler(db)))
	http.HandleFunc("/users_follows", helper.Middleware(handler.GetUsersHandler(db)))
	http.HandleFunc("/show_posts", helper.Middleware(handler.ShowPosts(db)))
	http.HandleFunc("/userposts", helper.Middleware(handler.UserPosts(db)))
	http.HandleFunc("/requestfollow", helper.Middleware(handler.RequestFollowsHandler(db)))
	http.HandleFunc("/oldestrequestfollow", helper.Middleware(handler.OldestPendingRequestFollow(db)))
	http.HandleFunc("/getfollowers", helper.Middleware(handler.GetFollowerInfos(db)))
	http.HandleFunc("/getfollowingusers", helper.Middleware(handler.GetFollowingInfos(db)))
	http.HandleFunc("/CountFollower", helper.Middleware(handler.CountFollower(db)))

}
