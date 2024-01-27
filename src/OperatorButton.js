import { ACTIONS } from "./App.js";
export default function OperatorButton({ dispatch, op }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.CHOOSE_OP, payload: { op } })}
    >
        {op}
    </button>
  );
}
