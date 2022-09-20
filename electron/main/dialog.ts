import { dialog }  from 'electron'

export const $message = async (e, arg) => await dialog.showMessageBox(null, arg)
