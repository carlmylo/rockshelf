import { animate, AnimatedSection, mountSmallMessageLocaleKey, TransComponent } from '@renderer/lib.exports'
import { useSmallMessageState } from './SmallMessage.state'
import { useEffect, useMemo, useState } from 'react'
import { ErrorIcon, LoadingIcon, SuccessIcon } from '@renderer/assets/icons'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

export function SmallMessage() {
  const { t } = useTranslation()
  const message = useSmallMessageState((x) => x.message)
  const setSmallMessageState = useSmallMessageState((x) => x.setSmallMessageState)
  const active = useMemo(() => message !== null, [message])
  const timeout = useSmallMessageState((x) => x.timeout)

  const i18nKey = useMemo(() => mountSmallMessageLocaleKey(message), [message])

  useEffect(
    function SetNewActiveTimeout() {
      if (timeout !== null) clearTimeout(timeout)
      if (message) {
        if (message.type !== 'loading' && message.type !== 'debug') {
          const newTimeout = setTimeout(() => setSmallMessageState({ message: null }), message.timeout || 4000)
          setSmallMessageState({ timeout: newTimeout })
        }
      }
    },
    [message]
  )
  return (
    <AnimatedSection id="SmallMessage" condition={active} {...animate({ opacity: true })} className={clsx('absolute! top-3 right-3 z-50 ml-auto w-[30%] max-w-[30%] flex-row! items-start border bg-black/90 p-2 backdrop-blur-md', message && message.type === 'warn' ? 'border-yellow-500' : message && message.type === 'error' ? 'border-red-500' : message && message.type === 'success' ? 'border-green-500' : '')}>
      {message && (
        <div className="w-full flex-row! items-start">
          {message.type === 'loading' && <LoadingIcon className="mt-0.5 mr-2 min-w-8 animate-spin text-lg" />}
          {message.type === 'success' && <SuccessIcon className="mt-0.5 mr-2 min-w-8 text-lg text-green-500" />}
          {(message.type === 'info' || message.type === 'warn' || message.type === 'error') && <ErrorIcon className={clsx('mt-0.5 mr-2 min-w-8 text-lg', message.type === 'error' ? 'text-red-500' : message.type === 'warn' ? 'text-yellow-500' : '')} />}
          <div className="w-full">
            <h1 className="mb-0.5 w-full border-b border-neutral-800 text-sm uppercase">{t(message.type)}</h1>
            <p className="rounded-xs text-xs wrap-anywhere">{message.type === 'debug' ? message.code : <TransComponent i18nKey={i18nKey} values={message.messageValues} />}</p>
          </div>
        </div>
      )}
    </AnimatedSection>
  )
}
