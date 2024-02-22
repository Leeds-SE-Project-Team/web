export interface articleInfo {
    username: string
    userFollower: string | number
    userFollowing: string | number
    userAvatar: string
    backgroundUrl: string
    collection: 'hiking' | 'biking' | 'running'
    title: string
    specify: string
    introduction: string
    like: number | string
    comment: string | number
    time?: string
}

export interface hoverInfo {
    username: string
    userFollower: number | string
    userFollowing: number | string
    userAvatar: string
}