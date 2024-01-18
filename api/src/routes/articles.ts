import mongoose from 'mongoose'
import toposort from 'toposort'
import { Router } from 'express'
import { controller, permissions, validator } from '@/middlewares'
import { accessTokenAuth } from '@/middlewares/auth'
import { UrlForm } from '@/forms'
import { findOne, findAll, createOne, updateOne, deleteOne } from '@/middlewares/db'
import { recordParam } from '@/utils/urlBuilder'
import { ArticleForm } from '@/forms/articles'
import Article from '@/models/article'
import SystemConfig from '@/models/system-config'

const router = Router()

router.get('/articles',
    accessTokenAuth,
    permissions('articles.read'),
    findAll(Article),
    controller(async (req, res) => {
        res.status(200).send({ data: req.data })
    })
)

function generateTableOfContents(articlesMapping: any, rootId: any) {
    const article = articlesMapping[rootId]
    if (article == null) {
        return null;
    }

    const { children, ...articleWithoutChildren } = article
    const childrenPart = (children?.length ?? 0) === 0
        ? {}
        : { children: children.map((id: any) => generateTableOfContents(articlesMapping, id.toString())).filter((e: any) => e != null) }

    return { ...articleWithoutChildren, ...childrenPart }
}

router.get('/articles/tree',
    accessTokenAuth,
    permissions('articles.read'),
    controller(async (req, res) => {
        const user: any = req.user
        const userHasPermissionsToViewPrivateArticles = user.role.permissions.includes('articles.readPrivate')
        const articlesFilter = userHasPermissionsToViewPrivateArticles
            ? {}
            : { public: true }

        const articles: any[] = await Article.find(articlesFilter, 'id name slug public children').lean()
        const articlesMapping = Object.fromEntries(articles.map(article => [article._id, article]))
        const rootArticleId: any = await SystemConfig.findOne({ key: 'rootArticleId' })
        const toc = generateTableOfContents(articlesMapping, rootArticleId.value)
        
        return res.status(200).send({ data: toc })
    })
)

function assignIdIfEmpty(obj: any) {
    if (obj._id == null) {
        obj._id = new mongoose.Types.ObjectId();
    }
}

function getArticlesFromTableOfContents(tocEntry: any) {
    if (tocEntry.children == null || tocEntry.children.length === 0) {
        return [tocEntry];
    }

    const { children, ...restOfTocEntry } = tocEntry
    children.forEach((child: any) => assignIdIfEmpty(child));
    const childrenIds = children.map((child: any) => child._id)
    const childrenArticles = children.map((child: any) => getArticlesFromTableOfContents(child)).flat()
    
    const article = { ...restOfTocEntry, children: childrenIds }
    return [article, ...childrenArticles]
}

function listDiff<T>(a: T[], b: T[]): T[] {
    const s = new Set(b);
    return a.filter(x => !s.has(x))
}

function topoSortArticles(articles: any) {
    const articlesMapping = Object.fromEntries(articles.map((article: any) => [article._id, article]))

    const graphEdges = articles.map(
        (article: any) => article.children?.map(
            (childId: any) => [article._id, childId]
        ) ?? []
    ).flat();

    const sortedVertices = toposort(graphEdges).reverse();
    const articleIds = articles.map((article: any) => article._id)
    const orphanIds = listDiff(articleIds, sortedVertices)
    
    return [...sortedVertices, ...orphanIds].map((id: any) => articlesMapping[id])
}

router.put('/articles/tree',
    accessTokenAuth,
    permissions('articles.write'),
    // validator(ArticlesTree),
    controller(async (req, res) => {
        const articles = getArticlesFromTableOfContents(req.body)
        const sortedArticles = topoSortArticles(articles)

        for (const articleData of sortedArticles) {
            const article: any = await Article.findById(articleData._id);
            if (!article) {
                await Article.create(articleData)
                continue;
            }

            for (const key of ['name', 'slug', 'public', 'children']) {
                article[key] = articleData[key]
            }
            await article.save()
        }

        res.status(201).send({})
    })
)

const range = (n: number) => Array.from(Array(n).keys())

async function getParentNamesBySlug(slug: string) {
    const slugParts = slug.split(',')
    if (slugParts.length <= 1) {
        return [];
    }

    const parentSlugs = range(slugParts.length).map(n => slugParts.slice(0, n).join(','))
    const parentArticles = await Promise.all(parentSlugs.map(slug => Article.findOne({ slug })))
    const parentNames = parentArticles.map((article: any) => article.name)
    return parentNames
}

router.get(`/articles/${recordParam}`,
    accessTokenAuth,
    permissions('articles.read'),
    validator(UrlForm),
    findOne(Article),
    controller(async (req, res) => {
        const path = await getParentNamesBySlug(req.data.slug)
        res.status(200).send({ data: { ...req.data.toObject(), path } })
    })
)

router.post('/articles',
    accessTokenAuth,
    permissions('articles.write'),
    validator(ArticleForm),
    createOne(Article, ['name', 'public', 'slug', 'content', 'children']),
    controller(async (req, res) => {
        res.status(201).send({
            data: req.data,
            message: req.t('createdSuccessfully'),
        })
    })
)

router.put(`/articles/${recordParam}`,
    accessTokenAuth,
    permissions('articles.write'),
    validator(UrlForm),
    validator(ArticleForm),
    updateOne(Article, ['name', 'public', 'slug', 'content', 'children']),
    controller(async (req, res) => {
        res.status(200).send({
            message: req.t('updatedSuccessfully'),
        })
    })
)

router.delete(`/articles/${recordParam}`,
    accessTokenAuth,
    permissions('articles.write'),
    validator(UrlForm),
    deleteOne(Article),
    controller(async (req, res) => {
        res.status(200).send({
            message: req.t('removedSuccessfully'),
        })
    })
)

export default router
