import React, { useEffect, useMemo } from "react";
import { localStorageKey } from "../constants";
import * as actions from "./actions";
import { AppState, reducer, ICard, IColumn } from "./reducer";

export type { ICard, IColumn };

interface ContextType {
  columns: AppState["columns"];
  cards: AppState["cards"];
  selectedCard?: { cardId: string; columnId: string };
  setSelectedCard: (
    cardAddress: { cardId: string; columnId: string } | undefined
  ) => void;
  addColumn: (name: string) => void;
  editColumn: (args: {
    id: string;
    columnFields: Partial<Omit<IColumn, "id">>;
  }) => void;
  removeColumn: (columnId: string) => void;
  addCard: (args: { title: string; columnId: string }) => void;
  editCard: (args: {
    id: string;
    cardFields: Partial<Omit<ICard, "id">>;
  }) => void;
  removeCard: (args: { columnId: string; cardId: string }) => void;
  moveCard: (args: {
    cardId: string;
    originColumnId: string;
    targetColumnId: string;
  }) => void;
}

const AppContext = React.createContext<ContextType | undefined>(undefined);

export const useAppContext = () => React.useContext(AppContext) as ContextType;

const initialState: AppState = {
  columns: [],
  cards: new Map([]),
  selectedCard: undefined,
};

const getInitialState: () => AppState = () => {
  const persistedState = localStorage.getItem(localStorageKey);
  if (persistedState !== null) {
    const parsed = JSON.parse(persistedState) as {
      columns: AppState["columns"];
      cards: { [key: string]: ICard };
      selectedCard?: string;
    };

    const cardMap = new Map(
      Object.entries(parsed.cards).map(([id, card]) => [id, card])
    );
    return {
      columns: parsed.columns,
      cards: cardMap,
      sleetedCard: parsed.selectedCard,
    };
  }
  return initialState;
};

const AppContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = React.useReducer(reducer, getInitialState());

  useEffect(() => {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({ ...state, cards: Object.fromEntries(state.cards) })
    );
  }, [state]);

  const value: ContextType = useMemo(
    () => ({
      columns: state.columns,
      cards: state.cards,
      selectedCard: state.selectedCard,

      setSelectedCard: (cardAddress?: { cardId: string; columnId: string }) => {
        dispatch({ type: actions.SET_SELECTED_CARD, cardAddress });
      },

      addColumn: (name: string) => {
        dispatch({ type: actions.ADD_COLUMN, name });
      },

      editColumn: (args: {
        id: string;
        columnFields: Partial<Omit<IColumn, "id">>;
      }) => {
        dispatch({ type: actions.EDIT_COLUMN, ...args });
      },

      removeColumn: (columnId: string) => {
        dispatch({ type: actions.REMOVE_COLUMN, columnId });
      },

      addCard: ({ title, columnId }: { title: string; columnId: string }) => {
        dispatch({ type: actions.ADD_CARD, title, columnId });
      },

      editCard: (args: {
        id: string;
        cardFields: Partial<Omit<ICard, "id">>;
      }) => {
        dispatch({ type: actions.EDIT_CARD, ...args });
      },

      removeCard: ({
        columnId,
        cardId,
      }: {
        columnId: string;
        cardId: string;
      }) => {
        dispatch({ type: actions.REMOVE_CARD, columnId, cardId });
      },

      moveCard: ({
        cardId,
        originColumnId,
        targetColumnId,
      }: {
        cardId: string;
        originColumnId: string;
        targetColumnId: string;
      }) => {
        dispatch({
          type: actions.MOVE_CARD,
          cardId,
          originColumnId,
          targetColumnId,
        });
      },
    }),
    [state.cards, state.columns, state.selectedCard]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
