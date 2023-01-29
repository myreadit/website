import { usePageQuery, withPreloader } from '@/lib/relay'
import { pagesIndexQuery } from '@/__generated__/relay/pagesIndexQuery.graphql'
import { graphql } from 'react-relay'

const query = graphql`
    query pagesIndexQuery {
        hello
    }
`

export default function IndexPage() {
    const data = usePageQuery<pagesIndexQuery>(query)
    return (
        <div>
            <h1 className="text-4xl font-extrabold">Hello world!</h1>
            <p className="text-lg">{data.hello}</p>
        </div>
    )
}

export const getStaticProps = withPreloader(async (preload, ctx) => {
    await preload(query)
})
