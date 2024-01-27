import "./styles.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperatorButton from "./OperatorButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OP: "choose-op",
  CLEAR: "clear",
  DELETE: "delete",
  EVALUATE: "evaluate",
};

function evaluate({currOperand, prevOperand, operation})
{
  const prev = parseFloat(prevOperand)
  const curr = parseFloat(currOperand)
  if(isNaN(prev) || isNaN(curr)) return ""
  let computation = ""
  switch(operation) {
    case "+":
      computation = prev + curr
      break;
    case "-":
      computation = prev - curr
      break;
    case "×":
      computation = prev * curr
      break;
    case "÷":
      computation = prev / curr
      break;
  }
  return computation.toString();
}
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite)
      {
        return{
          ...state,
          overwrite: false,
          currOperand: payload.digit
        }
      }
      if (payload.digit == "0" && state.currOperand === "0") return state;
      if (payload.digit == "." && !state.currOperand)
        return {
          ...state,
          currOperand: `${"0"}${payload.digit}`,
        };
      if (payload.digit == "." && state.currOperand.includes(".")) return state;
      return {
        ...state,
        currOperand: `${state.currOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OP:
      if(state.currOperand == null && state.prevOperand == null) return state;
      if(state.prevOperand == null)
      {
        return {
          ...state,
          prevOperand: state.currOperand,
          operation: payload.op,
          currOperand: null
        }
      }
      if(state.currOperand == null)
      {
        return{
          ...state,
          operation: payload.op
        }
      }
      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.op,
        currOperand: null
      }
    case ACTIONS.EVALUATE:
      if(state.currOperand == null || state.prevOperand == null) return state;
      return {
        ...state,
        overwrite: true,
        currOperand: evaluate(state),
        operation: null,
        prevOperand: null
      }
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE:
      if(state.overwrite) return {}
      if(state.currOperand == null) return state
      if(state.currOperand.length == 1) return {
        ...state,
        currOperand: null
      }
      return {
        ...state,
        currOperand: state.currOperand.slice(0, -1)
      }
    default:
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("eng-uk", {
  maximumFractionDigits: 0
})

function formatOperand(operand)
{
  if(operand == null) return 
  const [integer, decimal] = operand.split('.')
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currOperand, prevOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="prev-operand">
          {formatOperand(prevOperand)}
          {operation}
        </div>
        <div className="curr-operand">{formatOperand(currOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE })}>DEL</button>
      <OperatorButton op={"÷"} dispatch={dispatch} />
      <DigitButton digit={"1"} dispatch={dispatch} />
      <DigitButton digit={"2"} dispatch={dispatch} />
      <DigitButton digit={"3"} dispatch={dispatch} />
      <OperatorButton op={"×"} dispatch={dispatch} />
      <DigitButton digit={"4"} dispatch={dispatch} />
      <DigitButton digit={"5"} dispatch={dispatch} />
      <DigitButton digit={"6"} dispatch={dispatch} />
      <OperatorButton op={"+"} dispatch={dispatch} />
      <DigitButton digit={"7"} dispatch={dispatch} />
      <DigitButton digit={"8"} dispatch={dispatch} />
      <DigitButton digit={"9"} dispatch={dispatch} />
      <OperatorButton op={"-"} dispatch={dispatch} />
      <DigitButton digit={"."} dispatch={dispatch} />
      <DigitButton digit={"0"} dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
