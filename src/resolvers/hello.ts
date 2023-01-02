import { Resolvers } from '@/__generated__/resolver-types'

export default {
    Query: {
        hello() {
            return 'hello'
        },
    },
} satisfies Resolvers
