import { useDispatch } from "react-redux";
import "./results.less";
import { randomizeQuestions, resetTest } from "../../slices/testSlice";
import { choosePage } from "../../slices/pageSlice";

export const Results: React.FC = () => {
  const dispatch = useDispatch();
  return (
    <div className="results-container">
      result
      <div
        className="reset-button"
        onClick={() => {
          dispatch(resetTest());
          dispatch(choosePage("practice"));
          dispatch(randomizeQuestions());
        }}
      >
        Reset
      </div>
    </div>
  );
};
