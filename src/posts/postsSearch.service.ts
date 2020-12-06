import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import Post from './post.entity'
import PostSearchResult from './interfaces/postSearchResponse.interface'
import PostSearchBody from './interfaces/postSearchBody.interface'
import { TransportRequestPromise } from '@elastic/elasticsearch/lib/Transport'
import PostCountResult from './interfaces/postCountBody.interface'

@Injectable()
export class PostsSearchService {
  index = 'posts'

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: Post): Promise<any> {
    return this.elasticsearchService.index<PostSearchResult, PostSearchBody>({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        paragraphs: post.paragraphs,
        authorId: post.author.id,
      },
    })
  }

  async count(query: string, fields: string[]): Promise<number> {
    const { body } = await this.elasticsearchService.count<PostCountResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query,
            fields,
          },
        },
      },
    })
    return body.count
  }

  async search(
    text: string,
    offset?: number,
    limit?: number,
    startId = 0,
  ): Promise<{ results: PostSearchBody[]; count: number }> {
    let separateCount = 0
    if (startId) {
      separateCount = await this.count(text, ['title', 'paragraphs'])
    }

    const { body } = await this.elasticsearchService.search<PostSearchResult>({
      index: this.index,
      from: offset,
      size: limit,
      body: {
        query: {
          bool: {
            should: {
              multi_match: {
                query: text,
                fields: ['title', 'paragraphs'],
              },
            },
            filter: {
              range: {
                id: {
                  gt: startId,
                },
              },
            },
          },
        },
        sort: {
          id: {
            order: 'asc',
          },
        },
      },
    })
    const count = body.hits.total.value
    const hits = body.hits.hits
    const results = hits.map((item) => item._source)
    return {
      count: startId ? separateCount : count,
      results,
    }
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
      paragraphs: post.paragraphs,
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
