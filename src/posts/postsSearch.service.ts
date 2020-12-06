import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import Post from './post.entity'
import PostSearchResult from './interfaces/postSearchResponse.interface'
import PostSearchBody from './interfaces/postSearchBody.interface'
import { TransportRequestPromise } from '@elastic/elasticsearch/lib/Transport'

@Injectable()
export class PostsSearchService {
  index = 'posts'

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: Post): Promise<TransportRequestPromise<any>> {
    return this.elasticsearchService.index<PostSearchResult, PostSearchBody>({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.author.id,
      },
    })
  }

  async search(text: string): Promise<PostSearchBody[]> {
    const { body } = await this.elasticsearchService.search<PostSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'content'],
          },
        },
      },
    })
    const hits = body.hits.hits
    return hits.map((item) => item._source)
  }

  async remove(postId: number): Promise<TransportRequestPromise<any>> {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: postId,
          },
        },
      },
    })
  }

  async update(post: Post): Promise<TransportRequestPromise<any>> {
    const newBody: PostSearchBody = {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.author.id,
    }

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`
    }, '')

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: post.id,
          },
        },
        script: {
          inline: script,
        },
      },
    })
  }
}
