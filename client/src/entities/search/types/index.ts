import type { Store } from 'effector';


export interface SearchProps {
  border?: boolean,
  disableInfo?: boolean,
  onChange: AnyToVoidFunction,
  queryStore: Store<string>,
  value?: string
}
