'use strict'

// Bring in model
const Post = use('App/Models/Post')

// Bring in Validator 
const { validate } = use('Validator')

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
        // Validate Input
        const validation = await validate(request.all(), {
            title: 'required|min:3|max:255',
            body: 'required|min:3'
        })

        if(validation.fails()){
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }

        const post = new Post()

        post.title = request.input('title')
        post.body = request.input('body')

        await post.save()

        session.flash({ notification: 'Post Added' })

        return response.redirect('/posts')

    }

    async edit({ params, view }){
        const post = await Post.find(params.id)

        return view.render('posts.edit', {
            post: post
        })
    }

    async update({ params, request, response, session }){
        // Validate Input
        const validation = await validate(request.all(), {
            title: 'required|min:3|max:255',
            body: 'required|min:3'
        })

        if(validation.fails()){
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }

        const post = await Post.find(params.id)

        post.title = request.input('title')
        post.body = request.input('body')

        await post.save()

        session.flash({ notification: 'Post Edited' })

        return response.redirect('/posts')

    }
    async detroy ({ params,  response, session }) {

        const post = await Post.find(params.id)

        await post.delete()

        session.flash({ notification: 'Post Deleted' })

        return response.redirect('/posts')

    }
}

module.exports = PostController
 