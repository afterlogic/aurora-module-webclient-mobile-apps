const path = require('path')
const { sharedHelper } = require(path.join(
  process.env.AURORA_E2E_ROOT,
  'helpers/paths'
))
const { test, expect } = require('@playwright/test')
const { T } = sharedHelper('timeouts')
const { gotoLoggedIn, step, attachScreenshot, hasCredentials } = sharedHelper('login')
const { openSettings, openSettingsTab } = require('../../../SettingsWebclient/test/e2e/helpers/settings')

function mobileAppsTab(page) {
  const byName = page.locator(
    '[data-test-id="settings-tab"][data-settings-name="mobile-apps"], [data-test-id="settings-tab"][data-settings-path="mobile-apps"]'
  )
  const byText = page.getByTestId('settings-tab').filter({
    hasText: /mobile apps?|apps/i,
  })
  return byName.or(byText).first()
}

function mobileAppsPane(page) {
  return page.getByTestId('settings-mobile-apps-pane')
}

test.describe('Desktop Mobile Apps settings', () => {
  test.skip(!hasCredentials(), 'Set E2E_LOGIN_PRIMARY in .env.e2e')

  test('opens Mobile Apps settings and shows server links when available', async ({
    page,
    browserName,
  }) => {
    test.setTimeout(T(120000))
    test.skip(browserName !== 'chromium', 'Chrome-only new P3 spec')

    await gotoLoggedIn(page)
    await openSettings(page)

    test.skip(
      !(await mobileAppsTab(page).isVisible().catch(() => false)),
      'Mobile Apps settings tab is not available on this stand'
    )

    await step('Open Mobile Apps settings tab', async () => {
      await openSettingsTab(page, 'mobile-apps')
      await expect(mobileAppsPane(page)).toBeVisible({ timeout: T(30000) })
      await attachScreenshot(page, 'mobile-apps-01-open')
    })

    await step('Inspect available app sections', async () => {
      const pane = mobileAppsPane(page)
      const mailSection = pane.getByTestId('settings-mobile-apps-mail')
      const filesSection = pane.getByTestId('settings-mobile-apps-files')
      const emptyState = pane.getByTestId('settings-mobile-apps-empty')

      const mailVisible = await mailSection.isVisible().catch(() => false)
      const filesVisible = await filesSection.isVisible().catch(() => false)
      const emptyVisible = await emptyState.isVisible().catch(() => false)

      if (!mailVisible && !filesVisible) {
        test.skip(
          emptyVisible,
          'Mobile Apps settings are present, but app links are disabled on this stand'
        )
      }

      if (mailVisible) {
        const serverBlock = pane.getByTestId('settings-mobile-apps-mail-server')
        if (await serverBlock.isVisible().catch(() => false)) {
          const url = serverBlock.getByTestId('settings-mobile-apps-mail-server-url')
          await expect(url).toBeVisible()
          await expect
            .poll(async () => (await url.innerText().catch(() => '')).trim().length, {
              timeout: T(15000),
              intervals: [200, 400, 800],
            })
            .toBeGreaterThan(0)
        }
      }

      if (filesVisible) {
        const serverBlock = pane.getByTestId('settings-mobile-apps-files-server')
        if (await serverBlock.isVisible().catch(() => false)) {
          const url = serverBlock.getByTestId('settings-mobile-apps-files-server-url')
          await expect(url).toBeVisible()
          await expect
            .poll(async () => (await url.innerText().catch(() => '')).trim().length, {
              timeout: T(15000),
              intervals: [200, 400, 800],
            })
            .toBeGreaterThan(0)
        }
      }

      const visibleLinks = pane.locator(
        [
          '[data-test-id="settings-mobile-apps-mail-ios"]:visible',
          '[data-test-id="settings-mobile-apps-mail-android"]:visible',
          '[data-test-id="settings-mobile-apps-files-win"]:visible',
          '[data-test-id="settings-mobile-apps-files-ios"]:visible',
          '[data-test-id="settings-mobile-apps-files-android"]:visible',
        ].join(', ')
      )
      const linksCount = await visibleLinks.count()
      console.log(`  → Visible Mobile Apps links: ${linksCount}`)
      console.log(
        linksCount > 0
          ? '  → Store links are available on this stand'
          : '  → Store links are hidden on this stand; server URLs are the stable coverage'
      )
      await attachScreenshot(page, 'mobile-apps-02-sections')
    })
  })
})
