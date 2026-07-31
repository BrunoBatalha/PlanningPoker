import { push, ref, serverTimestamp, set } from "firebase/database";

import { database } from "../../../firebase";

export const SUGGESTION_MAX_LENGTH = 1000;

export interface SuggestionInput {
  message: string;
  path: string;
  locale: "pt-BR" | "en";
}

async function createSuggestion({ message, path, locale }: SuggestionInput) {
  const normalizedMessage = message.trim();

  if (
    normalizedMessage.length === 0 ||
    normalizedMessage.length > SUGGESTION_MAX_LENGTH
  ) {
    throw new Error("Sugestão inválida.");
  }

  const suggestionRef = push(ref(database, "suggestions"));

  if (!suggestionRef.key) {
    throw new Error("Não foi possível gerar a chave da sugestão.");
  }

  await set(suggestionRef, {
    message: normalizedMessage,
    createdAt: serverTimestamp(),
    path,
    locale,
  });
}

export const suggestionService = {
  createSuggestion,
};
