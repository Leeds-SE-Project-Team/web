export interface articleInfo {
    username: string
    userFollow: string | number
    userAvatar: string
    backgroundUrl: string
    collection: 'hiking' | 'biking' | 'running'
    title: string
    specify: string
    introduction: string
    like: number | string
    comment: string | number
}