import { combineReducers } from "redux";
const UPDATE_DATA = "UPDATE_DATA";

export function updateData(raw_data) {
  console.log("updateData", raw_data);
  return {
    type: UPDATE_DATA,
    raw_data,
  };
}

const defaultData = [{}];

function raw_data(state = defaultData, action) {
  switch (action.type) {
    case "UPDATE_DATA":
      return {
        raw_data: action.raw_data,
      };
    default:
      return null;
  }
}

const dataStore = combineReducers({
  raw_data,
});

export default dataStore;
