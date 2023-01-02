/** @type {import('@graphql-codegen/cli').CodegenConfig} */
module.exports = {
    schema: 'src/schema.gql',
    generates: {
        'src/__generated__/resolver-types.ts': {
            plugins: ['typescript', 'typescript-resolvers'],
        },
    },
}
