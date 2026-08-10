const endpoint = 'http://127.0.0.1:9099/emulator/v1/projects/labour-dorm-local/config'
const accountsEndpoint = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/projects/labour-dorm-local/accounts:batchGet'
const adminEmail = 'arrivals@hkflal.com'

try {
  const response = await fetch(endpoint)
  if (!response.ok) {
    throw new Error(`Auth Emulator returned HTTP ${response.status}`)
  }

  const accountsResponse = await fetch(accountsEndpoint, {
    headers: { Authorization: 'Bearer owner' },
  })
  if (!accountsResponse.ok) {
    throw new Error(`Auth Emulator account check returned HTTP ${accountsResponse.status}`)
  }

  const accounts = await accountsResponse.json()
  if (!accounts.users?.some((user) => user.email === adminEmail)) {
    throw new Error('The local admin account has not been created yet')
  }

  console.log('Firebase Auth Emulator and the local admin account are ready.')
} catch (error) {
  console.error(`Local admin login unavailable: ${error.message}`)
  process.exitCode = 1
}
