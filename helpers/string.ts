export const truncate = (
  str: string | undefined,
  length: number
): string | undefined => {
  if (!str) {
    return str
  }
  if (str.length > length) {
    return `${str.substring(0, length - 3)}...`
  }
  return str
}

export const formatDate = (d: Date | undefined): string =>
  d ? d.toLocaleDateString('en-US') : ''

export const formatTime = (d: Date | undefined): string =>
  d
    ? d.toLocaleTimeString(undefined, {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
      })
    : ''

type ErrorWithMessage = {
  message: string
}
    
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}
    
function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError
    
  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError))
  }
}
    
export const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message
}    
