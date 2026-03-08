function Error({ statusCode }: { statusCode: number }) {
  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', color: '#18181B' }}>
      {statusCode ? `Erreur ${statusCode}` : 'Une erreur est survenue'}
    </div>
  )
}

Error.getInitialProps = ({ res, err }: { res: { statusCode: number } | null; err: { statusCode: number } | null }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
