import { startServerAndCreateNextHandler } from '@as-integrations/next'
import apolloServer from '@/lib/apolloServer'

export default startServerAndCreateNextHandler(apolloServer)
