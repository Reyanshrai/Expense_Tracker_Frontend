import { Alert } from "react-native";

export type ErrorType = 
  | "network"
  | "firestore"
  | "duplicate_email"
  | "invalid_email"
  | "empty_group_name"
  | "invalid_amount"
  | "permission_denied"
  | "unknown";

interface ErrorMessage {
  title: string;
  message: string;
}

const errorMessages: Record<ErrorType, ErrorMessage> = {
  network: {
    title: "Network Error",
    message: "Please check your internet connection and try again.",
  },
  firestore: {
    title: "Database Error",
    message: "Something went wrong with our database. Please try again.",
  },
  duplicate_email: {
    title: "Duplicate Email",
    message: "This email is already added to the group.",
  },
  invalid_email: {
    title: "Invalid Email",
    message: "Please enter a valid email address.",
  },
  empty_group_name: {
    title: "Group Name Required",
    message: "Please enter a name for your group.",
  },
  invalid_amount: {
    title: "Invalid Amount",
    message: "Please enter a valid amount greater than 0.",
  },
  permission_denied: {
    title: "Permission Denied",
    message: "You don't have permission to perform this action.",
  },
  unknown: {
    title: "Error",
    message: "Something went wrong. Please try again.",
  },
};

export function showError(type: ErrorType, customMessage?: string) {
  const error = errorMessages[type];
  Alert.alert(error.title, customMessage || error.message);
}

export function handleFirestoreError(error: any): ErrorType {
  const code = error?.code || "";
  const message = error?.message || "";

  if (code.includes("network") || message.includes("network")) {
    return "network";
  }
  if (code.includes("permission-denied")) {
    return "permission_denied";
  }
  if (code.includes("already-exists") || message.includes("already")) {
    return "duplicate_email";
  }
  if (code.includes("invalid-argument")) {
    return "invalid_email";
  }
  if (code.includes("not-found")) {
    return "firestore";
  }

  return "unknown";
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateGroupName(name: string): boolean {
  return name.trim().length > 0;
}

export function validateAmount(amount: number): boolean {
  return amount > 0 && !isNaN(amount);
}

export function showSuccess(title: string, message: string) {
  Alert.alert(title, message, [{ text: "OK" }]);
}

export function showConfirmation(
  title: string,
  message: string,
  onConfirm: () => void,
  confirmText: string = "Delete",
  cancelText: string = "Cancel"
) {
  Alert.alert(title, message, [
    { text: cancelText, style: "cancel" },
    { text: confirmText, style: "destructive", onPress: onConfirm },
  ]);
}
