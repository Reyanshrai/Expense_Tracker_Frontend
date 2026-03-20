import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

interface DeepLinkData {
  action: string;
  params: Record<string, string>;
}

export function useDeepLink() {
  const router = useRouter();
  const [pendingJoinGroupId, setPendingJoinGroupId] = useState<string | null>(null);

  useEffect(() => {
    // Handle initial URL (app opened via link)
    const handleInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        parseAndHandleURL(url);
      }
    };

    handleInitialURL();

    // Handle URL changes (app already open)
    const subscription = Linking.addEventListener("url", (event) => {
      if (event.url) {
        parseAndHandleURL(event.url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const parseAndHandleURL = (url: string): DeepLinkData | null => {
    try {
      const { path, queryParams } = Linking.parse(url);
      
      if (path === "join" && queryParams?.groupId) {
        const groupId = queryParams.groupId as string;
        setPendingJoinGroupId(groupId);
        return { action: "join", params: { groupId } };
      }

      return null;
    } catch (error) {
      console.error("Error parsing deep link:", error);
      return null;
    }
  };

  const clearPendingJoin = () => {
    setPendingJoinGroupId(null);
  };

  const generateInviteLink = (groupId: string): string => {
    return `expensetrackerfrontend://join?groupId=${groupId}`;
  };

  return {
    pendingJoinGroupId,
    clearPendingJoin,
    generateInviteLink,
    parseAndHandleURL,
  };
}
