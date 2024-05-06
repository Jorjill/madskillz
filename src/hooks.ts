import { TypedUseSelectorHook, useDispatch as reduxUseDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './state/store';

export const useDispatch = () => reduxUseDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;