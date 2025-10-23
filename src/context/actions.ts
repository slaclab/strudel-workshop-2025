export enum AppActionType {
  OPEN_API_MODAL = 'OPEN_API_MODAL',
  CLOSE_API_MODAL = 'CLOSE_API_MODAL',
  ADD_PREVENTATIVE_MAINTENANCE = 'ADD_PREVENTATIVE_MAINTENANCE',
}

export interface PreventativeMaintenanceItem {
  id: string;
  title: string;
  item_id: string;
  item_name?: string;
  status: string;
  repeat_number: number;
  repeat_unit: string;
  start_date: string;
  next_due_date: string;
  person_responsible: string;
  last_completed?: string;
  instructions?: string;
}

export interface AppAction {
  type: AppActionType;
  payload?: any;
}

export const openApiModal = (): AppAction => ({
  type: AppActionType.OPEN_API_MODAL,
});

export const closeApiModal = (): AppAction => ({
  type: AppActionType.CLOSE_API_MODAL,
});

export const addPreventativeMaintenance = (
  item: PreventativeMaintenanceItem
): AppAction => ({
  type: AppActionType.ADD_PREVENTATIVE_MAINTENANCE,
  payload: item,
});
