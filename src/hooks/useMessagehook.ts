import { createDiscreteApi } from 'naive-ui'


const { message, notification, dialog, loadingBar, modal } = createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar', 'modal']
)

export { message, notification, dialog, loadingBar, modal }
