import ErrorPage from 'next/error'

interface PropsError {
  statusCode: number | null
}

const Error = ({ statusCode }:PropsError) => {
  return <p>{statusCode}</p>
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : (err ? err.statusCode : 404)
    return { statusCode, err }
}

export default Error
