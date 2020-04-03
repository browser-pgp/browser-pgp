import { MUIDataTableOptions, MUIDataTableColumnOptions } from 'mui-datatables'

export const createTableOptions = (
  options: MUIDataTableOptions = {},
): MUIDataTableOptions => ({
  ...options,
  download: false,
  print: false,
  responsive: 'scrollMaxHeight',
})

export class Col<T> {
  constructor(
    readonly name: string,
    readonly opath: (item: T) => any,
    readonly options: MUIDataTableColumnOptions = {},
  ) {}
}
