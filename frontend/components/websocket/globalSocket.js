import { domainSocket } from "../../utils/api";
import { getSessionCookie } from "../../utils/cookies";

export function globalSocket(setSocket) {
  const sessionId = getSessionCookie();
  const private_message = new WebSocket(
    `${domainSocket}/global_socket?Authorization=${sessionId}`
  );
  setSocket(private_message);
}

export function allDiscussionPrivateSocket(setSocketDiscussion) {
  const sessionId = getSessionCookie();
  const discussions = new WebSocket(
    `${domainSocket}/discussion?Authorization=${sessionId}`
  );
  setSocketDiscussion(discussions);
}

export function allDiscussionGroupPrivateSocket(
  setSocketDiscussionGroup,
  group_id
) {
  const sessionId = getSessionCookie();
  const discussions = new WebSocket(
    `${domainSocket}/group_chat?Authorization=${sessionId}&group_id=${group_id}`
  );
  setSocketDiscussionGroup(discussions);
}

export function recentDiscussionsSocket(setSocketRecentDiscussion) {

  const sessionId = getSessionCookie();
  const recentDiscussions = new WebSocket(
    `${domainSocket}/recent_discussions?Authorization=${sessionId}`
  );
  setSocketRecentDiscussion(recentDiscussions);
}
