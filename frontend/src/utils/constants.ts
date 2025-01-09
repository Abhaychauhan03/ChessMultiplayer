import { Chess } from "chess.js";
import { upgradePiece } from "../types/types";

export const chess: Chess = new Chess();

export const upgrade: upgradePiece[] = ["q", "r", "n", "b"];
