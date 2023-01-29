import { Resolvers } from '@/__generated__/resolver_types'

export default {
    Query: {
        hello() {
            return 'hello'
        },
    },
} satisfies Resolvers
