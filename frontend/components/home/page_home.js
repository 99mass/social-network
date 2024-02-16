import { useEffect, useState } from "react";
import LeftBloc from "./left_bloc";
import MidlleBloc from "./middle_bloc";
import RightBloc from "./rigthB_bloc";
import { getUserBySession } from "../../handler/getUserBySession";

export default function PageHome() {
  const [datasUser, setDatasUser] = useState(null);

  useEffect(() => {
    if (datasUser == null) {
      getUserBySession(setDatasUser);
    }
  }, []);

  return (
    <>
      <LeftBloc />
      <MidlleBloc />
      <RightBloc datasUser={datasUser && datasUser} />
    </>
  );
}
