const domain = "http://localhost:8080";

export const api = {
  Registre: `${domain}/register`,
  Login: `${domain}/login`,
  Session: `${domain}/session`,
  Logout: `${domain}/logout`,
  User: `${domain}/user`,
  Profil: `${domain}/profil`,
  UpdateProfilUser: `${domain}/update_profil`,
  Addpost: `${domain}/addpost`,
  ShowPosts: `${domain}/show_posts`,
  userPosts: `${domain}/userposts`,
  Followuser: `${domain}/followuser`,
  Unfollowuser: `${domain}/unfollowuser`,
  Requestfollow: `${domain}/requestfollow`,
  users_follows: `${domain}/users_follows`,
  addcomment:`${domain}/addcomment`,
  show_comments_post: `${domain}/show_comments_post`,
  oldestrequestfollow: `${domain}/oldestrequestfollow`,
  likeDslikepost:`${domain}/likepost`,
  getFollowers:`${domain}/getfollowers`,
  getFollingUsers:`${domain}/getfollowingusers`,
  AddGroup: `${domain}/create_group`
};
