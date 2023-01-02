import { GetServerSideProps, GetStaticProps } from 'next'
import { PropsWithChildren, useMemo } from 'react'
import { RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay'
import { Environment, fetchQuery, GraphQLTaggedNode, Network, OperationType, RecordSource, Store } from 'relay-runtime'

const env = new Environment({
    store: new Store(new RecordSource()),
    network: Network.create(
        typeof window === 'undefined'
            ? async (req, vars) => {
                  // Server-side
                  const apollo = (await import('@/lib/apolloServer')).default
                  const { body } = await apollo.executeOperation({
                      query: req.text!,
                      variables: vars,
                  })
                  if (body.kind === 'single') {
                      return body.singleResult
                  }
                  throw new Error('@defer and @stream are not supported!')
              }
            : async (req, vars) => {
                  // Client-side
                  const res = await fetch('/api/graphql', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ query: req.text, variables: vars }),
                  })
                  return res.json()
              }
    ),
})

function preload(query: GraphQLTaggedNode, vars = {}) {
    return fetchQuery(env, query, vars).toPromise()
}

export function withPreloader<F extends GetServerSideProps | GetStaticProps = GetServerSideProps>(
    fn: (p: typeof preload, ctx: Parameters<F>[0]) => ReturnType<F> | Promise<void>
) {
    return async (ctx: Parameters<F>[0]) => {
        const res = await fn(preload, ctx)
        if (res && !('props' in res)) {
            return res
        }
        return {
            ...res,
            props: {
                ...res?.props,
                $$RELAY_STATE: env.getStore().getSource().toJSON(),
            },
        }
    }
}

export function RelayProvider({ children, pageProps }: PropsWithChildren<{ pageProps: any }>) {
    const state = pageProps.$$RELAY_STATE
    useMemo(() => {
        if (state) env.getStore().publish(new RecordSource(state))
    }, [state])
    return <RelayEnvironmentProvider environment={env}>{children}</RelayEnvironmentProvider>
}

export function usePageQuery<T extends OperationType>(query: GraphQLTaggedNode, vars: T['variables'] = {}) {
    return useLazyLoadQuery<T>(query, vars, { fetchPolicy: 'store-only' })
}
