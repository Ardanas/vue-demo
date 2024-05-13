import {
  LocaleType,
  SheetTypes,
} from '@univerjs/core'

export const DEFAULT_WORKBOOK_DATA = {
  id: 'workbook-01',
  locale: LocaleType.ZH_CN,
  name: 'universheet',
  sheetOrder: ['sheet-01'],
  appVersion: '3.0.0-alpha',
  sheets: {
    'sheet-01': {
      type: SheetTypes.GRID,
      id: 'sheet-01',
      name: 'sheet1',
      cellData: {},
    },
  },
}
