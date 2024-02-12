import { useState } from "react";
import { FeedBloc } from "./feed_bloc";
import LeftBlocGroupPage from "./left_bloc";
import DiscoverBloc from "./discover_bloc";
import YourGroup from "./your_group";
import RequestGroup from "./request_group";

export default function GroupPage() {
  const [state, setState] = useState({
    state1: true,
    state2: false,
    state3: false,
    state4: false,
  });

  const handleState = ({ state1, state2, state3, state4 }) => {
    setState({ state1, state2, state3, state4 });
  };

  return (
    <>
      <LeftBlocGroupPage state={state} handleState={handleState} />
      {state.state1 && <FeedBloc />}
      {state.state2 && <DiscoverBloc />}
      {state.state3 && <YourGroup />}
      {state.state4 && <RequestGroup />}
    </>
  );
}
