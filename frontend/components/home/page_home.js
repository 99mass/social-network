import { useEffect, useState } from "react";
import LeftBloc from "./left_bloc";
import MidlleBloc from "./middle_bloc";
import RightBloc from "./rigthB_bloc";
import { getUserBySession } from "../../handler/getUserBySession";

export default function PageHome() {
  const [datasUser, setDatasUser] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
      getUserBySession(setDatasUser);
  }, []);

  return (
    <>
      <LeftBloc setPosts={setPosts} />
      <MidlleBloc posts={posts} setPosts={setPosts} />
      <RightBloc datasUser={datasUser && datasUser} />
    </>
  );
}
