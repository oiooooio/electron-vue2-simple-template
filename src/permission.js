import getPageTitle from '@/utils/get-page-title'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import router from './router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const homePath = ['/dashboard', '/']

router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title)

    console.log('to', to.fullPath, from.fullPath)

    // Check if the navigation is already in progress to avoid infinite loop
    if (homePath.indexOf(to.fullPath) !== -1 && homePath.indexOf(from.fullPath) !== -1) {
        next()
    } else  if (to.fullPath !== from.fullPath) {
        // hack method to ensure that addRoutes is complete
        // set the replace: true, so the navigation will not leave a history record
        next({ ...to, replace: true })
    } else {
        next()
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
