import { IWidgetState } from '../interface';
import { useSelector } from 'react-redux';
import { IUnitInfo } from '@apitable/core';

export function useUnitInfo(): IUnitInfo | null {
  return useSelector((state: IWidgetState) => {
    return state.unitInfo;
  });
}
