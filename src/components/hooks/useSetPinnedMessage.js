// @ts-check
import { useCallback } from "react";
import {
  selectPeerNameByID,
  selectSessionMetadata,
  useHMSActions,
  useHMSStore,
  useHMSVanillaStore,
} from "@100mslive/react-sdk";
import { ToastManager } from "../Toast/ToastManager";
import { SESSION_STORE_KEY } from "../../common/constants";

/**
 * set pinned chat message by updating the session store
 */
export const useSetPinnedMessage = () => {
  const hmsActions = useHMSActions();
  const vanillaStore = useHMSVanillaStore();
  const pinnedMessage = useHMSStore(selectSessionMetadata);

  const setPinnedMessage = useCallback(
    /**
     * @param {import("@100mslive/react-sdk").HMSMessage | undefined} message
     */
    async message => {
      let newPinnedMessage = null;

      if (message) {
        const peerName =
          vanillaStore.getState(selectPeerNameByID(message.sender)) ||
          message.senderName;

        if (peerName) {
          newPinnedMessage = `${peerName}: ${message.message}`;
        } else {
          newPinnedMessage = message.message;
        }
      }

      try {
        if (newPinnedMessage !== pinnedMessage) {
          await hmsActions.sessionStore
            .set(SESSION_STORE_KEY.PINNED_MESSAGE, newPinnedMessage)
            .catch(err => ToastManager.addToast({ title: err.description }));
        }
      } catch (err) {
        // Handle the error here
        console.error(err);
      }
    },
    [hmsActions, vanillaStore, pinnedMessage]
  );

  return { setPinnedMessage };
};
