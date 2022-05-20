import { generateId } from "./utils";
import * as actions from "./actions";

export interface ICard {
  id: string;
  title: string;
  description?: string;
}

export interface IColumn {
  id: string;
  name: string;
  cards: string[];
}

export interface AppState {
  columns: IColumn[];
  cards: Map<string, ICard>;
  selectedCard?: { cardId: string; columnId: string };
}

type Action =
  | { type: typeof actions.ADD_COLUMN; name: string }
  | {
      type: typeof actions.EDIT_COLUMN;
      id: string;
      columnFields: Partial<Omit<IColumn, "id">>;
    }
  | { type: typeof actions.REMOVE_COLUMN; columnId: string }
  | { type: typeof actions.ADD_CARD; title: string; columnId: string }
  | {
      type: typeof actions.EDIT_CARD;
      id: string;
      cardFields: Partial<Omit<ICard, "id">>;
    }
  | { type: typeof actions.REMOVE_CARD; columnId: string; cardId: string }
  | {
      type: typeof actions.SET_SELECTED_CARD;
      cardAddress?: { cardId: string; columnId: string };
    }
  | {
      type: typeof actions.MOVE_CARD;
      cardId: string;
      originColumnId: string;
      targetColumnId: string;
    };

export const reducer = (state: AppState, action: Action): AppState => {
  const { columns, cards } = state;
  switch (action.type) {
    case actions.ADD_COLUMN:
      return {
        ...state,
        columns: [
          ...columns,
          { id: generateId(), name: action.name, cards: [] },
        ],
      };

    case actions.EDIT_COLUMN: {
      const columnsClone = columns.slice();
      const index = columnsClone.findIndex(({ id }) => id === action.id);

      columnsClone.splice(index, 1, {
        ...columnsClone[index],
        ...action.columnFields,
      });
      return {
        ...state,
        columns: columnsClone,
      };
    }

    case actions.REMOVE_COLUMN:
      return {
        ...state,
        columns: columns.filter(({ id }) => id !== action.columnId),
      };

    case actions.ADD_CARD: {
      const columnIndex = columns.findIndex((c) => c.id === action.columnId);
      const column = columns[columnIndex];
      const cardId = generateId();
      const columnsClone = [...columns];

      columnsClone.splice(columnIndex, 1, {
        ...column,
        cards: [...column.cards, cardId],
      });

      return {
        cards: new Map(cards).set(cardId, { id: cardId, title: action.title }),
        columns: columnsClone,
      };
    }

    case actions.REMOVE_CARD: {
      const columnIndex = columns.findIndex((c) => c.id === action.columnId);
      const column = columns[columnIndex];
      const cardClone = new Map(cards);
      const columnClone = [...columns];

      cardClone.delete(action.cardId);

      columnClone.splice(columnIndex, 1, {
        ...column,
        cards: column.cards.filter((id) => id !== action.cardId),
      });

      return {
        cards: cardClone,
        columns: columnClone,
      };
    }

    case actions.MOVE_CARD: {
      const originColumnIndex = columns.findIndex(
        (c) => c.id === action.originColumnId
      );
      const targetColumnIndex = columns.findIndex(
        (c) => c.id === action.targetColumnId
      );

      const originColumn = columns[originColumnIndex];
      const targetColumn = columns[targetColumnIndex];
      const columnsClone = [...columns];

      columnsClone.splice(originColumnIndex, 1, {
        ...originColumn,
        cards: originColumn.cards.filter((id) => id !== action.cardId),
      });

      columnsClone.splice(targetColumnIndex, 1, {
        ...targetColumn,
        cards: [...targetColumn.cards, action.cardId],
      });

      return {
        ...state,
        columns: columnsClone,
      };
    }

    case actions.EDIT_CARD: {
      const card = cards.get(action.id);
      if (!card) return state;
      return {
        ...state,
        cards: new Map(cards).set(action.id, {
          ...card,
          ...action.cardFields,
        }),
      };
    }

    case actions.SET_SELECTED_CARD:
      return {
        ...state,
        selectedCard: action.cardAddress,
      };

    default:
      return state;
  }
};
