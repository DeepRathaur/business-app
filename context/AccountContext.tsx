"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { AccountDetailsModel } from "@/shared/models";
import { LocalStorageKey } from "@/core/constants/localStorage.enum";
import { localStorageService } from "@/core/services/localStorage.service";


type State = { ecareaccounts: AccountDetailsModel[]; selectedIndex: number };
type Action =
  | { type: "select"; index: number }
  | { type: "hydrateByNumber"; number: string }
  | { type: "setAccounts"; ecareaccounts: AccountDetailsModel[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "select":
      return { ...state, selectedIndex: action.index };
    case "hydrateByNumber": {
      const idx = state.ecareaccounts.findIndex((a) => a.accountNo === action.number);
      return idx === -1 ? state : { ...state, selectedIndex: idx };
    }
    case "setAccounts": {
      const currentNumber = state.ecareaccounts[state.selectedIndex]?.accountNo;
      const newIndex = action.ecareaccounts.findIndex((a) => a.accountNo === currentNumber);
      return {
        ecareaccounts: action.ecareaccounts,
        selectedIndex: newIndex === -1 ? 0 : newIndex,
      };
    }
    default:
      return state;
  }
}

export interface AccountContextValue {
  ecareaccounts: AccountDetailsModel[];
  selectedIndex: number;
  selected: AccountDetailsModel | null;
  select: (i: number) => void;
  setAccounts: (accounts: AccountDetailsModel[]) => void;
  totalRecords?: number;
  loadMore?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    ecareaccounts: [],
    selectedIndex: 0,
  });

  const select = useCallback(
    (i: number) => {
      dispatch({ type: "select", index: i });
      const acc = state.ecareaccounts[i];
      if (acc) {
        try {
          localStorageService.set(LocalStorageKey.ACCOUNT_NO, acc.accountNo);
        } catch {}
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("default-account-changed", { detail: acc }));
        }
      }
    },
    [state.ecareaccounts]
  );

  const setAccounts = useCallback((ecareaccounts: AccountDetailsModel[]) => {
    dispatch({ type: "setAccounts", ecareaccounts });
  }, []);

  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" && localStorageService.get<string>(LocalStorageKey.ACCOUNT_NO);
      if (saved && state.ecareaccounts.length > 0) {
        dispatch({ type: "hydrateByNumber", number: saved });
      }
    } catch {}
  }, [state.ecareaccounts]);

  const selected = state.ecareaccounts[state.selectedIndex] ?? null;
  const value = useMemo(
    () => ({
      ...state,
      selected,
      select,
      setAccounts,
      totalRecords: state.ecareaccounts.length,
      loadMore: undefined,
      isLoadingMore: false,
      hasMore: false,
    }),
    [state, selected, select, setAccounts]
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx) {
    throw new Error(
      "useAccount must be used within AccountProvider (wrap app with AccountProvider)."
    );
  }
  return ctx;
}
