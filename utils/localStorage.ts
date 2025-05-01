// import { TAppUserState } from "@types";

const STORE_NAME = "SERVICE";

export const loadStore = () => {
  try {
    if (process.browser) {
      const serializedState: any = localStorage.getItem(STORE_NAME);
      const state: any = JSON.parse(serializedState);

      return state;
    }
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const saveStore = (state: any) => {
  try {
    if (process.browser) {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(STORE_NAME, serializedState);
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteStore = () => {
  try {
    if (process.browser) localStorage.removeItem(STORE_NAME);
  } catch (err) {
    console.log(err);
  }
};
