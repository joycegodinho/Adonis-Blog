'use strict'

// Bring in model

const Post = use('App/Models/Post')

class PostController {
    async index({ view }) {

        const posts = await Post.all()
        console.log(posts)
        return view.render('posts.index', {
            title: 'Latest Posts',
            posts: posts.toJSON()
        })
    }

    async details({ params, view }){
        const post = await Post.find(params.id)
        console.log(post)

        return view.render('posts.details', {
            post: post
        })

    }

    async add({ view }){
        return view.render('posts.add')
    }

    async store ({ request, response, session }) {
        const post = new Post()

        post.title = request.input('title')
        post.body = request.input('body')

        await post.save()

        session.flash({ notification: 'Post Added' })

        return response.redirect('/posts')

    }
}

module.exports = PostController
 