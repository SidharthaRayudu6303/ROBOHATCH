/**
 * Sentry Test Page
 * Use this page to verify Sentry error monitoring is working
 * 
 * To test:
 * 1. Set NEXT_PUBLIC_SENTRY_DSN in .env.local
 * 2. Set NEXT_PUBLIC_SENTRY_DEBUG=true to enable Sentry in dev
 * 3. Visit /sentry-test
 * 4. Click the "Trigger Client Error" button
 * 5. Check Sentry dashboard for the error
 * 
 * ⚠️ DELETE THIS FILE BEFORE PRODUCTION DEPLOYMENT
 */

import { useState } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function SentryTest() {
  const [testResult, setTestResult] = useState('')

  const triggerClientError = () => {
    setTestResult('🔥 Triggering client-side error...')
    setTimeout(() => {
      throw new Error('🧪 Sentry Test: Client-side error triggered successfully')
    }, 100)
  }

  const triggerCaptureMessage = () => {
    Sentry.captureMessage('🧪 Sentry Test: Manual message capture', 'info')
    setTestResult('✅ Sent test message to Sentry')
  }

  const triggerCaptureException = () => {
    Sentry.captureException(new Error('🧪 Sentry Test: Manual exception capture'))
    setTestResult('✅ Sent test exception to Sentry')
  }

  const checkSentryConfig = () => {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
    const env = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV
    const debug = process.env.NEXT_PUBLIC_SENTRY_DEBUG

    setTestResult(`
      📋 Sentry Configuration:
      - DSN: ${dsn ? '✅ Configured' : '❌ Missing'}
      - Environment: ${env}
      - Debug Mode: ${debug ? '✅ Enabled' : '❌ Disabled'}
      ${!dsn ? '\n⚠️ Set NEXT_PUBLIC_SENTRY_DSN in .env.local' : ''}
      ${!debug && env === 'development' ? '\n⚠️ Set NEXT_PUBLIC_SENTRY_DEBUG=true to test in dev' : ''}
    `)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-dark-brown mb-4">
            🔍 Sentry Integration Test
          </h1>
          
          <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-yellow-800 font-semibold">
              ⚠️ This page is for testing only
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              Delete this file before deploying to production
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={checkSentryConfig}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
            >
              📋 Check Sentry Configuration
            </button>

            <button
              onClick={triggerCaptureMessage}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all"
            >
              💬 Send Test Message to Sentry
            </button>

            <button
              onClick={triggerCaptureException}
              className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all"
            >
              ⚠️ Send Test Exception to Sentry
            </button>

            <button
              onClick={triggerClientError}
              className="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
            >
              🔥 Trigger Client Error (ErrorBoundary)
            </button>
          </div>

          {testResult && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {testResult}
              </pre>
            </div>
          )}

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-bold text-dark-brown mb-4">
              📚 Testing Instructions
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Create <code className="bg-white px-2 py-1 rounded">.env.local</code> with your Sentry DSN</li>
              <li>Add <code className="bg-white px-2 py-1 rounded">NEXT_PUBLIC_SENTRY_DEBUG=true</code> to test in development</li>
              <li>Restart the dev server: <code className="bg-white px-2 py-1 rounded">npm run dev</code></li>
              <li>Click "Check Sentry Configuration" to verify setup</li>
              <li>Click test buttons to send events to Sentry</li>
              <li>Check your Sentry dashboard for the errors</li>
            </ol>
          </div>

          <div className="mt-6 p-6 bg-green-50 rounded-lg">
            <h2 className="text-xl font-bold text-dark-brown mb-4">
              ✅ Expected Results
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>In development without DEBUG flag: Errors logged to console only</li>
              <li>In development with DEBUG flag: Errors sent to Sentry</li>
              <li>In production: All errors automatically sent to Sentry</li>
              <li>ErrorBoundary shows fallback UI + sends to Sentry</li>
              <li>5xx API errors captured in Sentry</li>
              <li>4xx API errors NOT sent to Sentry (expected errors)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
