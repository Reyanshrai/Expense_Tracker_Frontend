import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
    GoogleAuthProvider,
    signInWithCredential,
    UserCredential,
} from "firebase/auth";
import { useEffect } from "react";
import { Platform } from "react-native";
import { auth } from "./firebase";

// Required for web browser to complete the authentication session
WebBrowser.maybeCompleteAuthSession();

// Google OAuth Client IDs - You'll need to add these to your .env file
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "";
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "";
const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "";

/**
 * Hook to handle Google Sign-In for mobile
 * Usage in component:
 * const { promptAsync, loading } = useGoogleAuth();
 * 
 * Then call promptAsync() when user presses "Continue with Google"
 */
export function useGoogleAuth() {
  const redirectUri = makeRedirectUri({
    scheme: "expensetrackerfrontend",
    path: "oauth2redirect",
  });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID || undefined,
    redirectUri,
  });

  const loading = !request;

  return { promptAsync, response, loading };
}

/**
 * Sign in with Google on mobile using expo-auth-session
 * This function handles the complete flow:
 * 1. Opens Google login screen
 * 2. Retrieves Google ID token
 * 3. Authenticates with Firebase using GoogleAuthProvider
 * 4. Returns user credentials
 * 
 * @returns Promise<UserCredential> - Firebase user credentials
 */
export async function signInWithGoogleMobile(): Promise<UserCredential> {
  try {
    // Build the Google OAuth request
    const redirectUri = makeRedirectUri({
      scheme: "expensetrackerfrontend",
      path: "oauth2redirect",
    });

    // Determine which client ID to use based on platform
    let clientId = GOOGLE_CLIENT_ID;
    if (Platform.OS === "ios" && GOOGLE_IOS_CLIENT_ID) {
      clientId = GOOGLE_IOS_CLIENT_ID;
    } else if (Platform.OS === "android" && GOOGLE_ANDROID_CLIENT_ID) {
      clientId = GOOGLE_ANDROID_CLIENT_ID;
    }

    if (!clientId) {
      throw new Error(
        "Google Client ID not configured. Please add EXPO_PUBLIC_GOOGLE_CLIENT_ID to your .env file."
      );
    }

    // Create the auth request
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=id_token&` +
      `scope=${encodeURIComponent("openid profile email")}&` +
      `nonce=${Math.random().toString(36).substring(2)}`;

    // Open the auth session
    const result = await WebBrowser.openAuthSessionAsync(
      authUrl,
      redirectUri
    );

    if (result.type !== "success") {
      throw new Error("Google Sign-In was cancelled or failed");
    }

    // Extract the ID token from the redirect URL
    const url = result.url;
    const idToken = extractIdTokenFromUrl(url);

    if (!idToken) {
      throw new Error("Failed to get ID token from Google");
    }

    // Create Google credential with the ID token
    const credential = GoogleAuthProvider.credential(idToken);

    // Sign in with Firebase using the credential
    const userCredential = await signInWithCredential(auth, credential);

    return userCredential;
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    throw new Error(error.message || "Google Sign-In failed");
  }
}

/**
 * Extract ID token from the redirect URL
 */
function extractIdTokenFromUrl(url: string): string | null {
  try {
    // Parse the URL fragment (after #)
    const fragmentIndex = url.indexOf("#");
    if (fragmentIndex === -1) return null;

    const fragment = url.substring(fragmentIndex + 1);
    const params = new URLSearchParams(fragment);
    return params.get("id_token");
  } catch (error) {
    console.error("Error extracting ID token:", error);
    return null;
  }
}

/**
 * Alternative implementation using the hook-based approach
 * This is the recommended way for React components
 */
export function useGoogleSignIn(
  onSuccess?: (credential: UserCredential) => void,
  onError?: (error: Error) => void
) {
  const redirectUri = makeRedirectUri({
    scheme: "expensetrackerfrontend",
    path: "oauth2redirect",
  });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID || undefined,
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      if (id_token) {
        // Create Google credential with the ID token
        const credential = GoogleAuthProvider.credential(id_token);

        // Sign in with Firebase
        signInWithCredential(auth, credential)
          .then((userCredential) => {
            onSuccess?.(userCredential);
          })
          .catch((error) => {
            console.error("Firebase Sign-In Error:", error);
            onError?.(error);
          });
      } else {
        onError?.(new Error("No ID token received from Google"));
      }
    } else if (response?.type === "error") {
      onError?.(new Error(response.error?.message || "Google Sign-In failed"));
    }
  }, [response]);

  return {
    promptAsync,
    loading: !request,
  };
}
