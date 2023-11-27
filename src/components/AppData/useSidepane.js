import { useCallback } from "react";
import {
  selectAppData,
  useHMSActions,
  useHMSStore,
  useHMSVanillaStore,
} from "@100mslive/react-sdk";
import { useWidgetState } from "./useUISettings";
import { APP_DATA, WIDGET_STATE, WIDGET_VIEWS } from "../../common/constants";

export const useIsSidepaneTypeOpen = sidepaneType => {
  if (!sidepaneType) {
    throw Error("Pass one of the side pane options");
  }

  const currentSidePane = useHMSStore(selectAppData(APP_DATA.sidePane));
  return currentSidePane === sidepaneType;
};

export const useSidepaneState = () => {
  return useHMSStore(selectAppData(APP_DATA.sidePane));
};

export const useSidepaneToggle = sidepaneType => {
  const hmsActions = useHMSActions();
  const vanillaStore = useHMSVanillaStore();

  const toggleSidepane = useCallback(() => {
    const currentSidePane = vanillaStore.getState(
      selectAppData(APP_DATA.sidePane)
    );
    const isOpen = currentSidePane === sidepaneType;

    hmsActions.setAppData(APP_DATA.sidePane, isOpen ? "" : sidepaneType);
  }, [vanillaStore, hmsActions, sidepaneType]);

  return toggleSidepane;
};

export const useWidgetToggle = () => {
  const { widgetView, setWidgetState } = useWidgetState();

  const toggleWidget = useCallback(
    id => {
      id = typeof id === "string" ? id : undefined;

      if (id) {
        setWidgetState({
          [WIDGET_STATE.pollInView]: id,
          [WIDGET_STATE.view]: WIDGET_VIEWS.VOTE,
        });
      } else {
        setWidgetState({
          [WIDGET_STATE.pollInView]: "",
          [WIDGET_STATE.view]: widgetView ? null : WIDGET_VIEWS.LANDING,
        });
      }
    },
    [widgetView, setWidgetState]
  );

  return toggleWidget;
};

export const useSidepaneReset = () => {
  const hmsActions = useHMSActions();

  const resetSidepane = useCallback(() => {
    hmsActions.setAppData(APP_DATA.sidePane, "");
    hmsActions.setAppData(APP_DATA.widgetState, {
      [WIDGET_STATE.pollInView]: "",
      [WIDGET_STATE.view]: "",
    });
  }, [hmsActions]);

  return resetSidepane;
};
