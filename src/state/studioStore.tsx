import React from "react";
import { AIAnalysisResult, ChatMessage, Protein } from "../domain/types";
import { SAMPLE_DATASET } from "../domain/constants";

export type Status = "idle" | "loading" | "success" | "error";

type StudioState = {
  selectedResidueIndex: number | null;
  dataset: Protein[];
  selectedId: string;
  sequence: string;
  analysis: AIAnalysisResult | null;
  analyzeStatus: Status;
  chatStatus: Status;
  error?: string;

  chat: ChatMessage[];
};

type Action =
  | { type: "selectResidue"; idx: number }
  | { type: "mutateResidue"; idx: number; residue: string }

  | { type: "setDataset"; dataset: Protein[] }
  | { type: "selectProtein"; id: string }
  | { type: "setSequence"; sequence: string }
  | { type: "analyzeStart" }
  | { type: "analyzeSuccess"; analysis: AIAnalysisResult }
  | { type: "analyzeError"; error: string }
  | { type: "chatStart" }
  | { type: "chatAppend"; message: ChatMessage }
  | { type: "chatError"; error: string }
  | { type: "resetError" };

const initialProtein = SAMPLE_DATASET[0];

const initialState: StudioState = {
  selectedResidueIndex: null,
  dataset: SAMPLE_DATASET,
  selectedId: initialProtein.id,
  sequence: initialProtein.sequence,
  analysis: null,
  analyzeStatus: "idle",
  chatStatus: "idle",
  error: undefined,
  chat: [{ role: "model", content: `Ready when you are — ask anything about ${initialProtein.name}.` }]
};

function reducer(state: StudioState, action: Action): StudioState {
  switch (action.type) {
    case "setDataset": {
      const ds = action.dataset.length ? action.dataset : state.dataset;
      const p = ds[0];
      return {
        ...state,
        dataset: ds,
        selectedId: p.id,
        sequence: p.sequence,
        analysis: null,
        analyzeStatus: "idle",
        chatStatus: "idle",
        error: undefined,
        chat: [{ role: "model", content: `Loaded ${p.name}. Upload another dataset anytime.` }]
      };
    }
    case "selectProtein": {
      const p = state.dataset.find(d => d.id === action.id) ?? state.dataset[0];
      return {
        ...state,
        selectedId: p.id,
        sequence: p.sequence,
        analysis: null,
        analyzeStatus: "idle",
        chatStatus: "idle",
        error: undefined,
        selectedResidueIndex: null,
        chat: [{ role: "model", content: `Loaded ${p.name}. Want a quick functional guess or deep structural notes?` }]
      };
    }
    case "setSequence":
      return { ...state, sequence: action.sequence, analysis: null, analyzeStatus: "idle", selectedResidueIndex: null };

        case "selectResidue":
      return { ...state, selectedResidueIndex: action.idx };

    case "mutateResidue": {
      const seqArr = state.sequence.split("");
      if (action.idx < 0 || action.idx >= seqArr.length) return state;
      seqArr[action.idx] = action.residue.toUpperCase().slice(0, 1);
      return {
        ...state,
        sequence: seqArr.join(""),
        analysis: null,
        analyzeStatus: "idle",
        selectedResidueIndex: action.idx
      };
    }

case "analyzeStart":
      return { ...state, analyzeStatus: "loading", error: undefined };
    case "analyzeSuccess":
      return { ...state, analyzeStatus: "success", analysis: action.analysis };
    case "analyzeError":
      return { ...state, analyzeStatus: "error", error: action.error };

    case "chatStart":
      return { ...state, chatStatus: "loading", error: undefined };
    case "chatAppend":
      return { ...state, chatStatus: "success", chat: [...state.chat, action.message] };
    case "chatError":
      return { ...state, chatStatus: "error", error: action.error };

    case "resetError":
      return { ...state, error: undefined };

    default:
      return state;
  }
}

const Ctx = React.createContext<{ state: StudioState; dispatch: React.Dispatch<Action> } | null>(null);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useStudio() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useStudio must be used inside StudioProvider");
  return v;
}

export function useSelectedProtein(state: StudioState): Protein {
  return state.dataset.find(d => d.id === state.selectedId) ?? state.dataset[0];
}
