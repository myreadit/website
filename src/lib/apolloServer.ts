import { ApolloServer } from '@apollo/server'
import { mergeResolvers } from '@graphql-tools/merge'
import { join } from 'desm'
import { readFileSync } from 'node:fs'

export default new ApolloServer({
    typeDefs: readFileSync(join(import.meta.url, '../schema.gql'), 'utf-8'),
    resolvers: importAllResolvers(),
})

function importAllResolvers() {
    // @ts-ignore
    const r = require.context('../resolvers', false, /\.ts$/)
    return mergeResolvers(r.keys().map((key: any) => r(key).default))
}
