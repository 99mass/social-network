import { getSessionCookie } from "./cookies";

 const domain = "http://localhost:8080";
 const domainSocket = "ws://localhost:8080";
  const sessionId = getSessionCookie();
 export const socketPrivateMessage=  new WebSocket(`${domainSocket}/private_message?Authorization=${sessionId}`);
 // socket ouvert
//  socketPrivateMessage.onopen = () => {
//    console.log("WebSocket connection opened");
//  };


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
  UserPosts: `${domain}/userposts`,
  Followuser: `${domain}/followuser`,
  Unfollowuser: `${domain}/unfollowuser`,
  Requestfollow: `${domain}/requestfollow`,
  Users_follows: `${domain}/users_follows`,
  Addcomment: `${domain}/addcomment`,
  Show_comments_post: `${domain}/show_comments_post`,
  Oldestrequestfollow: `${domain}/oldestrequestfollow`,
  LikeDslikepost: `${domain}/likepost`,
  GetFollowers: `${domain}/getfollowers`,
  GetFolliwgUsers: `${domain}/getfollowingusers`,
  AddGroup: `${domain}/create_group`,
  CountFollower: `${domain}/CountFollower`,
  Groupsimanage: `${domain}/groupsimanage`,
  MygroupsParticep:`${domain}/mygroups`,
  Groupstodiscover:`${domain}/groupstodiscover`,
  Show_group_invitation: `${domain}/show_group_invitation`,
  Accept_group_invitation: `${domain}/accept_group_invitation`,
  Decline_group_invitation: `${domain}/decline_group_invitation`,

};
