import { Session } from 'electron'
import { emailTrackers } from './simplify-tracker-blocklist'

const adBlocklist = ['mail-ads.google.com']

const privacyBlocklist = [
  'gstatic.com/(.*)?/cleardot.gif',
  'mail.google.com/(.*)?/cleardot.gif',
  'mail.google.com/(.*)?/logstreamz',
  'play.google.com/log'
]

const blockerRegExp = new RegExp(
  [
    ...adBlocklist,
    ...privacyBlocklist,
    ...Object.values(emailTrackers).flat()
  ].join('|'),
  'i'
)

export function initBlocker(session: Session) {
  session.webRequest.onBeforeRequest(
    {
      urls: ['<all_urls>']
    },
    ({ url }, callback) => {
      callback({ cancel: blockerRegExp.test(url) })
    }
  )
}

export function initCleardotBlockFix() {
  window.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(() => {
      const cleardotElements = document.querySelectorAll<HTMLImageElement>(
        'img[src*="cleardot.gif"'
      )
      for (const clearDotElement of cleardotElements) {
        clearDotElement.src =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII='
      }
    })

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['src']
    })
  })
}