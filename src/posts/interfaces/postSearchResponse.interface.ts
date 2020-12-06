import PostSearchBody from './postSearchBody.interface'

interface PostSearchResult {
  hits: {
    total: {
      value: number
    }
    hits: Array<{
      _source: PostSearchBody
    }>
  }
}

export default PostSearchResult
